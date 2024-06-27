import User from "@/modules/users/models/userModel";
import { NextResponse } from "next/server";
import bycript from "bcryptjs";
import jwt from "jsonwebtoken";

const { connect } = require("@/config/dbConfig");

await connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(reqBody);

    // check
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist!" },
        { status: 400 }
      );
    }

    // Check password
    const checkPassword = await bycript.compare(password, user.password);
    if (!checkPassword) {
      return NextResponse.json({ error: "Invalid login" }, { status: 400 });
    }

    // Create tokenData
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // Create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "2h",
    });

    const response = NextResponse.json({
      message: "Login success",
      success: true,
      userId: user._id,
      username: user.username,
      email: user.email,
    });

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
