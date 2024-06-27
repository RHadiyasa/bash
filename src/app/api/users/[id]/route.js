import { connect } from "@/config/dbConfig";
import User from "@/modules/users/models/userModel";
import mongoose from "mongoose";

export async function GET(req) {
  await connect();
  const { id } = req;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("masuk kah");
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
