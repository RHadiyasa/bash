import { connect } from "@/config/dbConfig";
import { getCustomerFromToken } from "@/lib/helpers/getCustomerFromToken";
import "@/modules/models/trashModel";
import Transaction from "@/modules/models/transactionModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connect();

  try {
    const decoded = getCustomerFromToken(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = new mongoose.Types.ObjectId(decoded.id);
    const { searchParams } = new URL(request.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10"), 5),
      50
    );
    const type = searchParams.get("type") || "all";
    const status = searchParams.get("status") || "all";
    const skip = (page - 1) * limit;

    const filter = { customer: customerId };
    if (type !== "all") filter.transactionType = type;
    if (status !== "all") filter.transactionStatus = status;

    const [transactions, total, summary, monthlyTrend, trashBreakdown] =
      await Promise.all([
        Transaction.find(filter)
          .populate("trash", "trashName trashCategory trashPrice")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Transaction.countDocuments(filter),

        // Ringkasan total — exclude failed agar konsisten dengan Customer.totalDeposit/totalWithdraw
        Transaction.aggregate([
          {
            $match: {
              customer: customerId,
              transactionStatus: { $ne: "failed" },
            },
          },
          {
            $group: {
              _id: null,
              totalDepositAmount: {
                $sum: {
                  $cond: [
                    { $eq: ["$transactionType", "deposit"] },
                    "$transactionAmount",
                    0,
                  ],
                },
              },
              totalWithdrawAmount: {
                $sum: {
                  $cond: [
                    { $eq: ["$transactionType", "withdraw"] },
                    "$transactionAmount",
                    0,
                  ],
                },
              },
              totalWeight: {
                $sum: {
                  $cond: [
                    { $eq: ["$transactionType", "deposit"] },
                    "$trashWeight",
                    0,
                  ],
                },
              },
              depositCount: {
                $sum: {
                  $cond: [{ $eq: ["$transactionType", "deposit"] }, 1, 0],
                },
              },
              withdrawCount: {
                $sum: {
                  $cond: [{ $eq: ["$transactionType", "withdraw"] }, 1, 0],
                },
              },
            },
          },
        ]),

        // Tren per bulan (6 bulan terakhir) — hanya deposit
        Transaction.aggregate([
          {
            $match: {
              customer: customerId,
              transactionType: "deposit",
              transactionStatus: { $ne: "failed" },
              createdAt: {
                $gte: new Date(
                  new Date().setMonth(new Date().getMonth() - 5, 1)
                ),
              },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              totalAmount: { $sum: "$transactionAmount" },
              totalWeight: { $sum: "$trashWeight" },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),

        // Breakdown per jenis sampah — hanya deposit aktif
        Transaction.aggregate([
          {
            $match: {
              customer: customerId,
              transactionType: "deposit",
              transactionStatus: { $ne: "failed" },
            },
          },
          {
            $group: {
              _id: "$trash",
              totalWeight: { $sum: "$trashWeight" },
              totalAmount: { $sum: "$transactionAmount" },
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "trashes",
              localField: "_id",
              foreignField: "_id",
              as: "trashData",
            },
          },
          { $unwind: { path: "$trashData", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              trashName: { $ifNull: ["$trashData.trashName", "Sampah"] },
              totalWeight: 1,
              totalAmount: 1,
              count: 1,
            },
          },
          { $sort: { totalWeight: -1 } },
        ]),
      ]);

    const summaryData = summary[0] || {
      totalDepositAmount: 0,
      totalWithdrawAmount: 0,
      totalWeight: 0,
      depositCount: 0,
      withdrawCount: 0,
    };
    const activeBalance = Math.max(
      Number(summaryData.totalDepositAmount || 0) -
        Number(summaryData.totalWithdrawAmount || 0),
      0
    );

    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        total,
      },
      summary: {
        ...summaryData,
        activeBalance,
      },
      monthlyTrend,
      trashBreakdown,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
