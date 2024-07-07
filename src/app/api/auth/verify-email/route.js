import { NextResponse } from "next/server";
import User from "@/modules/users/models/userModel";
import crypto from "crypto";
import { connect } from "@/config/dbConfig";

export async function GET(req) {
  await connect();

  const token = req.nextUrl.searchParams.get("token");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      verifyToken: hashedToken,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    const url = new URL("/", req.nextUrl);
    url.searchParams.set("message", "Email verified successfully");
    return NextResponse.redirect(url);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
