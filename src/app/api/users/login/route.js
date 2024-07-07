import { NextResponse } from "next/server";
import { login } from "@/modules/auth/services/auth.service";
import { connect } from "@/config/dbConfig";

export async function POST(request) {
  await connect();
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const responseLogin = await login(email, password);

    if (responseLogin.status === 400) {
      return responseLogin;
    }
  
    const { user, token } = responseLogin;

    const response = NextResponse.json({
      message: "Login success",
      success: true,
      userId: user?._id,
      username: user?.username,
      email: user?.email,
      token,
    });

    response.cookies.set("token", token);

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
