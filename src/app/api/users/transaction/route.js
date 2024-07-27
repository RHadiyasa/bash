import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Transaction from "@/modules/users/models/transactionModel";
import Trash from "@/modules/users/models/trashModel";
import Customer from "@/modules/users/models/customersModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connect();

  try {
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        {
          error: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const filter = { bankSampah: userId };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(filter)
      .populate("customer")
      .populate("trash"); // update

    return NextResponse.json({
      message: "Transaction retrived succesfully",
      success: true,
      transactions,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connect();

  try {
    const reqBody = await request.json();
    const {
      customer,
      trash,
      trashWeight,
      transactionAmount,
      transactionType,
      transactionStatus,
    } = reqBody;

    const userId = getDataFromToken(request);

    // Sengaja Error START
    // if (trashWeight < 1) throw new Error("trash weight can not less than 1");
    // Sengaja Error END

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const newTransaction = new Transaction({
      customer,
      bankSampah: userId,
      trash,
      trashWeight,
      transactionAmount,
      transactionType,
      transactionStatus,
    });

    await newTransaction.save();

    return NextResponse.json({
      message: "Transaction created successfully",
      success: true,
      transaction: newTransaction,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  await connect();

  try {
    const userId = await getDataFromToken(request);

    const deleted = await Transaction.deleteMany({ bankSampah: userId });

    return NextResponse.json({
      message: "All transaction deleted",
      status: 200,
      deleted,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
