import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Customer from "@/modules/users/models/customersModel";
import { error } from "console";
import { NextResponse } from "next/server";

export async function PUT(request) {
  await connect();

  try {
    const reqBody = await request.json();
    const { id, ...updateData } = reqBody;

    const updates = {};
    for (const [key, value] of Object.entries(updateData)) {
      if (key !== 'id') {
        updates[key] = value;
      }
    }
    
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    console.log(updatedCustomer);
    return NextResponse.json({
      message: "Customer updated!",
      status: 200,
      updatedCustomer,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

    const customers = await Customer.find({ bankSampah: userId });

    return NextResponse.json({
      message: "Customers details retrieved successfully",
      success: true,
      customers: customers,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
