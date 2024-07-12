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

export async function PATCH(request, { params }) {
  await connect();

  try {
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const transactionId = params.id;
    const { status } = await request.json();

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: transactionId,
        bankSampah: userId,
      },
      { transactionStatus: status },
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { error: "Transation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Transaction status updated successfully",
      success: true,
      transaction,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
