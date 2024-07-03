import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import User from "@/modules/users/models/userModel";
import { connect } from "@/config/dbConfig";

export async function GET(request) {
  await connect();
  try {
    // Check userId
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { message: "Not logged in"},
        { status: 403 }
      );
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
