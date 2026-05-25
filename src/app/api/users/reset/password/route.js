import { connect } from "@/config/dbConfig";
import User from "@/modules/models/userModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function PUT(request) {
  await connect();

  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token dan password wajib diisi" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password minimal 8 karakter" },
        { status: 400 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token tidak valid atau sudah kadaluarsa" },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password berhasil direset" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to reset password", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
