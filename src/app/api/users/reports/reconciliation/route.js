import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import InventoryStock from "@/modules/models/inventoryStockModel";
import StockSale from "@/modules/models/stockSaleModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// GET: rekonsiliasi per jenis sampah
// Invarian: totalWeightIn = currentWeight + totalWeightSold + totalShrinkWeight
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

    const [stocks, cogsPerTrash] = await Promise.all([
      InventoryStock.find({ bankSampah: bankSampahId })
        .populate("trash", "trashName trashCategory trashPrice trashSellPrice")
        .sort({ totalWeightIn: -1 })
        .lean(),
      StockSale.aggregate([
        {
          $match: {
            bankSampah: bankSampahId,
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: "$trash",
            totalCogs: { $sum: "$cogs" },
            salesCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Index COGS lookup by trashId string.
    const cogsMap = {};
    for (const row of cogsPerTrash) {
      cogsMap[String(row._id)] = row;
    }

    const rows = stocks.map((stock) => {
      const trashKey = String(stock.trash?._id || stock.trash);
      const cogsData = cogsMap[trashKey] || { totalCogs: 0, salesCount: 0 };

      const totalWeightIn = stock.totalWeightIn || 0;
      const currentWeight = stock.currentWeight || 0;
      const totalWeightSold = stock.totalWeightSold || 0;
      const totalShrinkWeight = stock.totalShrinkWeight || 0;
      const totalSalesRevenue = stock.totalSalesRevenue || 0;
      const totalCogs = cogsData.totalCogs || 0;
      const totalProfit = totalSalesRevenue - totalCogs;

      // stockOutWeight = weight that left the stock for sales (sold + shrink)
      const stockOutWeight = totalWeightSold + totalShrinkWeight;
      // shrink % relative to total stock out weight
      const shrinkRatio =
        stockOutWeight > 0 ? (totalShrinkWeight / stockOutWeight) * 100 : 0;

      // Invarian: totalWeightIn ≈ currentWeight + totalWeightSold + totalShrinkWeight
      const expectedIn = currentWeight + totalWeightSold + totalShrinkWeight;
      const balanced = Math.abs(totalWeightIn - expectedIn) < 0.001;

      return {
        trashId: trashKey,
        trashName:
          stock.trash?.trashName || stock.trashNameSnapshot || "Sampah",
        totalWeightIn,
        currentWeight,
        totalWeightSold,
        totalShrinkWeight,
        stockOutWeight,
        shrinkRatio,
        totalSalesRevenue,
        totalCogs,
        totalProfit,
        salesCount: cogsData.salesCount,
        balanced,
      };
    });

    // Grand totals
    const totals = rows.reduce(
      (acc, r) => {
        acc.totalWeightIn += r.totalWeightIn;
        acc.currentWeight += r.currentWeight;
        acc.totalWeightSold += r.totalWeightSold;
        acc.totalShrinkWeight += r.totalShrinkWeight;
        acc.stockOutWeight += r.stockOutWeight;
        acc.totalSalesRevenue += r.totalSalesRevenue;
        acc.totalCogs += r.totalCogs;
        acc.totalProfit += r.totalProfit;
        acc.salesCount += r.salesCount;
        return acc;
      },
      {
        totalWeightIn: 0,
        currentWeight: 0,
        totalWeightSold: 0,
        totalShrinkWeight: 0,
        stockOutWeight: 0,
        totalSalesRevenue: 0,
        totalCogs: 0,
        totalProfit: 0,
        salesCount: 0,
      }
    );

    totals.shrinkRatio =
      totals.stockOutWeight > 0
        ? (totals.totalShrinkWeight / totals.stockOutWeight) * 100
        : 0;

    const invariantOk = rows.every((r) => r.balanced);

    return NextResponse.json({
      success: true,
      rows,
      totals,
      invariantOk,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
