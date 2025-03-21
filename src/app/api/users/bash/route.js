import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import User from "@/modules/users/models/userModel";
import { connect } from "@/config/dbConfig";

export async function GET(request) {
  await connect();
  try {
    const userId = await getDataFromToken(request);
    if (!userId)
      return NextResponse.json({ message: "user not found" }, { status: 403 });
    console.log({ userId });
    const user = await User.findOne({ _id: userId }).select("-password");
    console.log({ user });

    return NextResponse.json({ message: "User Found", data: user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
