import { connect } from "@/config/dbConfig";
import User from "@/modules/users/models/userModel";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(request) {
  await connect();

  try {
    const { email, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Password reset successful" },
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
