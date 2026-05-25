import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import "@/modules/models/trashModel";
import Transaction from "@/modules/models/transactionModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
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
    const customerId = searchParams.get("customerId") || params?.id;
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const type = searchParams.get("type") || "all";

    if (!customerId) {
      return NextResponse.json(
        { error: "customerID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return NextResponse.json(
        { error: "customerID tidak valid" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const filter = {
      bankSampah: userId,
      customer: customerId,
    };

    if (type !== "all") {
      filter.transactionType = type;
    }

    const customerTransaction = await Transaction.find(filter)
      .populate("trash")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTransactions = await Transaction.countDocuments(filter);

    return NextResponse.json({
      message: "Customer transaction retrieved successfully",
      success: true,
      transactions: customerTransaction,
      totalTransactions,
      totalPages: Math.max(Math.ceil(totalTransactions / limit), 1),
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
    const allowedStatuses = ["pending", "completed", "failed"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status transaksi tidak valid" },
        { status: 400 }
      );
    }

    const existingTransaction = await Transaction.findOne({
      _id: transactionId,
      bankSampah: userId,
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transation not found" },
        { status: 404 }
      );
    }

    if (
      existingTransaction.transactionStatus !== "pending" &&
      existingTransaction.transactionStatus !== status
    ) {
      return NextResponse.json(
        { error: "Status final tidak bisa diubah dari panel transaksi" },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: transactionId,
        bankSampah: userId,
      },
      { transactionStatus: status },
      { new: true }
    );

    return NextResponse.json({
      message: "Transaction status updated successfully",
      success: true,
      transaction,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
