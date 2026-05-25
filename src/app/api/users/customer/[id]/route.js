import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Customer from "@/modules/models/customersModel";
import { NextResponse } from "next/server";

export async function PUT(request) {
  await connect();

  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const reqBody = await request.json();
    const { id, ...updateData } = reqBody;

    const existing = await Customer.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    if (existing.bankSampah.toString() !== userId.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({
      message: "Customer updated!",
      success: true,
      updatedCustomer,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  await connect();

  try {
    const userId = await getDataFromToken(request);
    const { id } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const customers = await Customer.find({ bankSampah: userId, _id: id });

    return NextResponse.json({
      message: "Customers details retrieved successfully",
      success: true,
      customers: customers,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
