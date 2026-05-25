import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import InventoryStock from "@/modules/models/inventoryStockModel";
import StockSale from "@/modules/models/stockSaleModel";
import Transaction from "@/modules/models/transactionModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// PATCH: batalkan penjualan (reverse stok, set status=cancelled)
export async function PATCH(request, { params }) {
  await connect();

  try {
    const userId = getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID penjualan tidak valid" },
        { status: 400 }
      );
    }

    const bankSampahId = new mongoose.Types.ObjectId(userId);
    const session = await mongoose.startSession();
    let updatedSale = null;

    try {
      await session.withTransaction(async () => {
        const sale = await StockSale.findOne({
          _id: id,
          bankSampah: bankSampahId,
        }).session(session);

        if (!sale) {
          throw new Error("Penjualan tidak ditemukan");
        }

        if (sale.status === "cancelled") {
          throw new Error("Penjualan sudah dibatalkan");
        }

        // Reverse InventoryStock.
        await InventoryStock.findOneAndUpdate(
          { bankSampah: bankSampahId, trash: sale.trash },
          {
            $inc: {
              currentWeight: sale.stockOutWeight,
              totalWeightSold: -sale.soldWeight,
              totalShrinkWeight: -sale.shrinkWeight,
              totalCostBasis: sale.cogs,
              totalSalesRevenue: -sale.revenue,
              totalProfit: -sale.profit,
            },
          },
          { session }
        );

        // Reverse FIFO deposit tags: kembalikan deposit "completed" ke "pending"
        // sebesar stockOutWeight (LIFO — deposit terbaru di-untag lebih dulu).
        const taggedDeposits = await Transaction.find({
          bankSampah: bankSampahId,
          trash: sale.trash,
          transactionType: "deposit",
          transactionStatus: "completed",
        })
          .sort({ createdAt: -1 })
          .select("_id trashWeight")
          .session(session);

        const idsToUntag = [];
        let accumulated = 0;
        for (const deposit of taggedDeposits) {
          if (accumulated >= sale.stockOutWeight) break;
          idsToUntag.push(deposit._id);
          accumulated += Number(deposit.trashWeight || 0);
        }

        if (idsToUntag.length > 0) {
          await Transaction.updateMany(
            { _id: { $in: idsToUntag } },
            { $set: { transactionStatus: "pending" } },
            { session }
          );
        }

        sale.status = "cancelled";
        await sale.save({ session });
        updatedSale = sale.toObject();
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json({
      success: true,
      message: "Penjualan berhasil dibatalkan",
      sale: updatedSale,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Gagal membatalkan penjualan" },
      { status: 500 }
    );
  }
}
