import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import User from "@/modules/users/models/userModel";
import { error } from "console";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();
  const { id } = req;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ id });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await connect();

  try {
    const userId = getDataFromToken(request);
    const reqBody = await request.json();
    const { name, phoneNumber, email, password } = reqBody;

    // check user
    const userFound = await User.findOne({
      _id: userId,
    });

    if (!userFound) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    const updateUser = await User.updateOne(
      { _id: userId },
      { name, email, phoneNumber, password }
    );

    return NextResponse.json({
      message: "User Updated",
      status: 200,
      updateUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
