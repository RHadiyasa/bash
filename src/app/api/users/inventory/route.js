import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import InventoryStock from "@/modules/models/inventoryStockModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

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
    const [stocks, summary] = await Promise.all([
      InventoryStock.find({ bankSampah: bankSampahId })
        .populate("trash")
        .sort({ currentWeight: -1 })
        .lean(),
      InventoryStock.aggregate([
        { $match: { bankSampah: bankSampahId } },
        {
          $group: {
            _id: null,
            currentWeight: { $sum: "$currentWeight" },
            totalWeightIn: { $sum: "$totalWeightIn" },
            totalWeightSold: { $sum: "$totalWeightSold" },
            totalCostBasis: { $sum: "$totalCostBasis" },
            totalSalesRevenue: { $sum: "$totalSalesRevenue" },
            totalProfit: { $sum: "$totalProfit" },
            totalShrinkWeight: { $sum: "$totalShrinkWeight" },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      stocks,
      summary: summary[0] || {
        currentWeight: 0,
        totalWeightIn: 0,
        totalWeightSold: 0,
        totalCostBasis: 0,
        totalSalesRevenue: 0,
        totalProfit: 0,
        totalShrinkWeight: 0,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
