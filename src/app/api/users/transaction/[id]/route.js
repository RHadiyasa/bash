import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Transaction from "@/modules/users/models/transactionModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connect();

  try {
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    console.log("searchParams: ", searchParams.toString());
    console.log("customerID: ", customerId);

    if (!customerId) {
      return NextResponse.json(
        { error: "customerID is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const customerTransaction = await Transaction.find({
      bankSampah: userId,
      customer: customerId,
    })
      .populate("trash")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTransactions = await Transaction.countDocuments({
      bankSampah: userId,
      customer: customerId,
    });

    return NextResponse.json({
      message: "Customer transaction retrieved successfully",
      success: true,
      transactions: customerTransaction,
      totalTransactions,
      totalPages: Math.ceil(totalTransactions / limit),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
