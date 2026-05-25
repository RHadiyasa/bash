import { connect } from "@/config/dbConfig";
import User from "@/modules/models/userModel";
import { NextResponse } from "next/server";
import crypto from "crypto";
import sendResetPasswordEmail from "@/lib/utils/sendResetPasswordEmail";
import { rateLimit } from "@/lib/utils/rateLimit";

export async function POST(request) {
  const { allowed, retryAfter } = rateLimit(request, { limit: 3, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json(
      { error: `Terlalu banyak percobaan. Coba lagi dalam ${retryAfter} detik.` },
      { status: 429 }
    );
  }

  await connect();

  try {
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      // Pesan generik agar tidak bisa enumerate user
      return NextResponse.json(
        { message: "Jika email terdaftar, link reset akan dikirim." },
        { status: 200 }
      );
    }

    // Generate token reset (berlaku 15 menit)
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.forgotPasswordTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendResetPasswordEmail(user, resetToken);

    return NextResponse.json(
      { message: "Jika email terdaftar, link reset akan dikirim." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send reset email", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
