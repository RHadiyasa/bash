import { connect } from "@/config/dbConfig";
import { requireDeveloper } from "@/lib/helpers/requireDeveloper";
import User from "@/modules/models/userModel";
import Customer from "@/modules/models/customersModel";
import Transaction from "@/modules/models/transactionModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connect();

  const dev = await requireDeveloper(request);
  if (!dev) {
    return NextResponse.json(
      { error: "Akses ditolak. Khusus developer." },
      { status: 403 }
    );
  }

  const banks = await User.find({ role: { $ne: "developer" } })
    .select(
      "-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry"
    )
    .sort({ createdAt: -1 })
    .lean();

  const [custAgg, txAgg] = await Promise.all([
    Customer.aggregate([
      {
        $group: {
          _id: "$bankSampah",
          count: { $sum: 1 },
          totalBalance: { $sum: "$balance" },
        },
      },
    ]),
    Transaction.aggregate([
      { $group: { _id: "$bankSampah", count: { $sum: 1 } } },
    ]),
  ]);

  const custMap = Object.fromEntries(custAgg.map((c) => [String(c._id), c]));
  const txMap = Object.fromEntries(txAgg.map((t) => [String(t._id), t.count]));

  const data = banks.map((b) => {
    const c = custMap[String(b._id)] || {};
    return {
      ...b,
      customerCount: c.count || 0,
      totalBalance: c.totalBalance || 0,
      transactionCount: txMap[String(b._id)] || 0,
    };
  });
  const activeData = data.filter((b) => b.isDeleted !== true);
  const deletedData = data
    .filter((b) => b.isDeleted === true)
    .sort((a, b) => new Date(b.deletedAt || 0) - new Date(a.deletedAt || 0));

  const overview = {
    totalBanks: activeData.length,
    activeBanks: activeData.filter((b) => b.isActive !== false).length,
    inactiveBanks: activeData.filter((b) => b.isActive === false).length,
    deletedBanks: deletedData.length,
    totalCustomers: activeData.reduce((s, b) => s + b.customerCount, 0),
    totalTransactions: activeData.reduce((s, b) => s + b.transactionCount, 0),
    totalBalance: activeData.reduce((s, b) => s + b.totalBalance, 0),
    totalTrashWeight: activeData.reduce((s, b) => s + (b.totalTrashWeight || 0), 0),
    totalRevenue: activeData.reduce((s, b) => s + (b.revenue || 0), 0),
  };

  return NextResponse.json({
    success: true,
    banks: activeData,
    deletedBanks: deletedData,
    overview,
  });
}
