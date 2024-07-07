import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import DeletedCustomer from "@/modules/users/models/deletedCustomerModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connect();

  try {
    const userId = getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const deletedCustomers = await DeletedCustomer.find({ bankSampah: userId });
    return NextResponse.json({
      message: "Deleted customers retrived successfully",
      success: true,
      deletedCustomers,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
