import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Transaction from "@/modules/users/models/transactionModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connect();

  try {
    const reqBody = await request.json();
    const {
      customer,
      bankSampah,
      trash,
      trashWeight,
      transactionAmount,
      transactionType,
    //   status,
    } = reqBody;

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
    //   status,
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
