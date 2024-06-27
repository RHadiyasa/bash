import { NextResponse } from "next/server";
import { login } from "@/modules/auth/services/auth.service";

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const payload = await login(email, password);

    const response = NextResponse.json({
      message: "Login success",
      success: true,
      userId: payload.user?._id,
      username: payload.user?.username,
      email: payload.user?.email,
    });

    response.cookies.set("token", payload.token);

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
