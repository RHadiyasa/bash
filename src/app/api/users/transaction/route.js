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

    const transactions = await Transaction.find({
      bankSampah: userId,
    })
      .populate("customer")
      .populate("trash");

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
    const { customer, trash, trashWeight, transactionAmount, transactionType } =
      reqBody;

    const userId = getDataFromToken(request);

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