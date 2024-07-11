import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import User from "@/modules/users/models/userModel";
import { connect } from "@/config/dbConfig";

export async function PUT(request) {
  await connect();

  try {
    const userId = getDataFromToken(request);
    const reqBody = await request.json();
    const { transactionFee } = reqBody;

    // check user
    const userFound = await User.findOne({
      _id: userId,
    });

    if (!userFound) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const updatedUser = await User.updateOne(
      { _id: userId },
      { transactionFee }
    );

    return NextResponse.json({
      messae: "Transaction Fee Updated",
      status: 200,
      updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request) {
  await connect();
  try {
    // Check userId
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: "Not logged in" }, { status: 403 });
    }

    // Check user
    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User Found", data: user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
