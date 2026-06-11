import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import InventoryStock from "@/modules/models/inventoryStockModel";
import StockSale from "@/modules/models/stockSaleModel";
import Transaction from "@/modules/models/transactionModel";
import Trash from "@/modules/models/trashModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// GET: daftar penjualan stok ke pengepul (untuk halaman /sales)
export async function GET(request) {
  await connect();

  try {
    const userId = getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const bankSampahId = new mongoose.Types.ObjectId(userId);

    const [sales, summary] = await Promise.all([
      StockSale.find({ bankSampah: bankSampahId })
        .populate("trash")
        .sort({ createdAt: -1 })
        .lean(),
      StockSale.aggregate([
        { $match: { bankSampah: bankSampahId, status: { $ne: "cancelled" } } },
        {
          $group: {
            _id: null,
            totalSoldWeight: { $sum: "$soldWeight" },
            totalStockOutWeight: { $sum: "$stockOutWeight" },
            totalShrinkWeight: { $sum: "$shrinkWeight" },
            totalRevenue: { $sum: "$revenue" },
            totalCogs: { $sum: "$cogs" },
            totalProfit: { $sum: "$profit" },
            salesCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      sales,
      summary: summary[0] || {
        totalSoldWeight: 0,
        totalStockOutWeight: 0,
        totalShrinkWeight: 0,
        totalRevenue: 0,
        totalCogs: 0,
        totalProfit: 0,
        salesCount: 0,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: catat penjualan stok ke pengepul
export async function POST(request) {
  await connect();

  try {
    const userId = getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const reqBody = await request.json();
    const { trash, buyer, shrinkReason, clearStock, updateMasterPrice } =
      reqBody;
    const soldWeight = Number(reqBody.soldWeight);
    const sellPricePerKg = Number(reqBody.sellPricePerKg || 0);
    const overrideRevenue =
      reqBody.revenue !== undefined && reqBody.revenue !== null
        ? Number(reqBody.revenue)
        : null;

    if (!trash) {
      return NextResponse.json(
        { error: "Data sampah wajib dipilih" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(soldWeight) || soldWeight <= 0) {
      return NextResponse.json(
        { error: "Berat timbangan pengepul harus lebih dari 0" },
        { status: 400 }
      );
    }

    const bankSampahId = new mongoose.Types.ObjectId(userId);
    const session = await mongoose.startSession();
    let createdSale = null;
    let updatedStock = null;

    try {
      await session.withTransaction(async () => {
        const stock = await InventoryStock.findOne({
          bankSampah: bankSampahId,
          trash,
        }).session(session);

        if (!stock) {
          throw new Error("Stok sampah tidak ditemukan");
        }

        // Berat keluar stok: habiskan semua, atau sesuai input.
        const stockOutWeight = clearStock
          ? stock.currentWeight
          : Number(reqBody.stockOutWeight);

        if (!Number.isFinite(stockOutWeight) || stockOutWeight <= 0) {
          throw new Error("Berat keluar stok harus lebih dari 0");
        }
        if (stockOutWeight > stock.currentWeight) {
          throw new Error(
            `Berat keluar stok melebihi stok tersedia (${stock.currentWeight} kg)`
          );
        }

        const revenue =
          overrideRevenue && overrideRevenue > 0
            ? overrideRevenue
            : soldWeight * sellPricePerKg;

        if (!Number.isFinite(revenue) || revenue <= 0) {
          throw new Error("Nilai penjualan harus lebih dari 0");
        }

        // WAC modal per kg dari stok tersisa. Susut/kelebihan masuk ke profit bank.
        const avgCost =
          stock.currentWeight > 0
            ? stock.totalCostBasis / stock.currentWeight
            : 0;
        const cogs = Math.min(avgCost * stockOutWeight, stock.totalCostBasis);
        const profit = revenue - cogs;
        const shrinkWeight = stockOutWeight - soldWeight;

        const trashData = await Trash.findOne({
          _id: trash,
          user: bankSampahId,
        })
          .select("trashName trashSellPrice")
          .session(session);

        const masterSellPriceSnapshot = Number(trashData?.trashSellPrice || 0);
        const effectiveSellPrice =
          sellPricePerKg > 0 ? sellPricePerKg : revenue / soldWeight;
        const priceChanged =
          masterSellPriceSnapshot > 0 &&
          Math.abs(effectiveSellPrice - masterSellPriceSnapshot) > 0.0001;

        const sale = new StockSale({
          bankSampah: bankSampahId,
          trash,
          trashNameSnapshot:
            trashData?.trashName || stock.trashNameSnapshot || "",
          stockOutWeight,
          soldWeight,
          shrinkWeight,
          shrinkReason: shrinkWeight > 0 ? shrinkReason || "" : "",
          sellPricePerKg: effectiveSellPrice,
          masterSellPriceSnapshot,
          priceChanged,
          revenue,
          cogs,
          profit,
          status: "completed",
          buyer: buyer || "",
        });

        await sale.save({ session });
        createdSale = sale;

        updatedStock = await InventoryStock.findOneAndUpdate(
          { bankSampah: bankSampahId, trash },
          {
            $set: {
              trashNameSnapshot:
                trashData?.trashName || stock.trashNameSnapshot || "",
            },
            $inc: {
              currentWeight: -stockOutWeight,
              totalWeightSold: soldWeight,
              totalShrinkWeight: shrinkWeight,
              totalCostBasis: -cogs,
              totalSalesRevenue: revenue,
              totalProfit: profit,
            },
          },
          { new: true, session }
        );

        // Opsi: perbarui harga jual master sampah ke harga ini.
        if (
          updateMasterPrice &&
          trashData &&
          effectiveSellPrice > 0 &&
          Math.abs(effectiveSellPrice - masterSellPriceSnapshot) > 0.0001
        ) {
          await Trash.updateOne(
            { _id: trash, user: bankSampahId },
            {
              $set: { trashSellPrice: effectiveSellPrice },
              $push: {
                changeLogs: {
                  modifiedBy: bankSampahId,
                  changes: { trashSellPrice: String(masterSellPriceSnapshot) },
                  updatedAt: new Date(),
                },
              },
            },
            { session }
          );
        }

        // Auto-tag deposit terkait jadi "Sudah Dijual" (FIFO) sebesar stockOutWeight.
        // Hanya untuk status deposit (COGS/tag), TIDAK menyentuh saldo nasabah.
        const pendingDeposits = await Transaction.find({
          bankSampah: bankSampahId,
          trash,
          transactionType: "deposit",
          transactionStatus: "pending",
        })
          .sort({ createdAt: 1 })
          .select("_id trashWeight")
          .session(session);

        const idsToTag = [];
        let accumulated = 0;
        for (const deposit of pendingDeposits) {
          if (accumulated >= stockOutWeight) break;
          idsToTag.push(deposit._id);
          accumulated += Number(deposit.trashWeight || 0);
        }

        if (idsToTag.length > 0) {
          await Transaction.updateMany(
            { _id: { $in: idsToTag } },
            { $set: { transactionStatus: "completed" } },
            { session }
          );
        }
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json({
      success: true,
      message: "Penjualan berhasil dicatat",
      sale: createdSale,
      stock: updatedStock,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Gagal mencatat penjualan" },
      { status: 500 }
    );
  }
}
