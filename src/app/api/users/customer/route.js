import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Customer from "@/modules/users/models/customersModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connect();

  try {
    const reqBody = await request.json();
    const { username, fullName, accountNumber, phoneNumber, address, bankSampah } = reqBody;
    const userId = getDataFromToken(request);

    // check userId
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Check customer
    const customer = await Customer.findOne({ username, bankSampah });
    if (customer) {
      return NextResponse.json(
        { error: "Customer already exists" },
        { status: 400 }
      );
    }

    // Create new Customer
    const newCustomer = new Customer({
      username,
      fullName,
      accountNumber,
      phone: phoneNumber,
      address,
      bankSampah: userId,
    });

    await newCustomer.save();

    return NextResponse.json({
      message: "Customer created successfully",
      success: true,
      customer: newCustomer,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

    const customers = await Customer.find({ bankSampah: userId });
    return NextResponse.json({
      message: "Customers retrieved successfully",
      success: true,
      customers: customers,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  await connect();

  try {
    const userId = getDataFromToken(request);
    const { customerId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    await Customer.deleteOne({ _id: customerId, bankSampah: userId });
    return NextResponse.json({
      message: "Customers retrieved successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
