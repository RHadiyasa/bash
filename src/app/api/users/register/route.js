import { connect } from "@/config/dbConfig";
import User from "@/modules/users/models/userModel";
import { NextResponse } from "next/server";
import bycript from "bcryptjs";
import sendVerificationEmail from "@/lib/utils/sendEmailVerification";

export async function POST(request) {
  await connect();
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Check user
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // const salty = await bycript.salt(10);
    const hashPassword = await bycript.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    const verificationToken = newUser.generateVerificationToken();
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(newUser, verificationToken);

    return NextResponse.json({
      message: "User created successfully. Please check your email to verify your account.",
      success: true,
      newUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
