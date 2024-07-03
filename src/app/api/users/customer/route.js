import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Customer from "@/modules/users/models/customersModel";
import DeletedCustomer from "@/modules/users/models/deletedCustomerModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connect();

  try {
    const reqBody = await request.json();
    const {
      username,
      fullName,
      accountNumber,
      phoneNumber,
      address,
      bankSampah,
    } = reqBody;
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

    const customer = await Customer.findOne({
      _id: customerId,
      bankSampah: userId,
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const deletedCustomer = new DeletedCustomer({
      email: customer.email,
      password: customer.password,
      username: customer.username,
      fullName: customer.fullName,
      accountNumber: customer.accountNumber,
      phone: customer.phone,
      address: customer.address,
      balance: customer.balance,
      joinDate: customer.joinDate,
      bankSampah: customer.bankSampah,
      totalDeposit: customer.totalDeposit,
      totalWithdraw: customer.totalWithdraw,
    });

    await deletedCustomer.save();

    await Customer.deleteOne({ _id: customerId, bankSampah: userId });
    return NextResponse.json({
      message: "Customers deleted successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
