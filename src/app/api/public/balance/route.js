import { connect } from "@/config/dbConfig";
import Customer from "@/modules/models/customersModel";
import User from "@/modules/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connect();

  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const accountNumber = searchParams.get("accountNumber");

  console.log(username);
  console.log(accountNumber);

  if (!username || !accountNumber) {
    return NextResponse.json(
      { error: "Username and account number are required" },
      { status: 400 }
    );
  }

  try {
    const customer = await Customer.findOne(
      { username, accountNumber },
      "username accountNumber balance bankSampah fullName totalDeposit totalWeight totalWithdraw _id"
    ).populate("bankSampah","name");

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Success", customer });
  } catch (error) {
    console.error("Error fetching customers: ", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
