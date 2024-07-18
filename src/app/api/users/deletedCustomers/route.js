import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import DeletedCustomer from "@/modules/users/models/deletedCustomerModel";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";

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

export async function DELETE(request) {
  await connect();
  const { searchParams } = new URL(request.url);
  const isDeleteAll = searchParams.get("isDeleteAll") === "true";
  const userId = await getDataFromToken(request);

  if (!userId) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  try {
    if (isDeleteAll) {
      const deleted = await DeletedCustomer.deleteMany({ bankSampah: userId });

      return NextResponse.json({
        message: "All inactive customers deleted",
        status: 200,
        deleted,
      });
    } else {
      toast.error("Failed delete all transaction");
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
