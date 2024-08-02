import { connect } from "@/config/dbConfig";
import User from "@/modules/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connect();

  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User found" }, { status: 200 });
  } catch (error) {
    console.error("Failed to check email", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
