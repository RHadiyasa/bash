import { NextResponse } from "next/server";
import { login } from "@/modules/auth/services/auth.service";
import { connect } from "@/config/dbConfig";
import { rateLimit } from "@/lib/utils/rateLimit";

export async function POST(request) {
  const { allowed, retryAfter } = rateLimit(request, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json(
      { error: `Terlalu banyak percobaan. Coba lagi dalam ${retryAfter} detik.` },
      { status: 429 }
    );
  }

  await connect();
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const responseLogin = await login(email, password);

    if (responseLogin?.status >= 400) {
      return responseLogin;
    }

    const { user, token } = responseLogin;

    const response = NextResponse.json({
      message: "Login success",
      success: true,
      userId: user?._id,
      username: user?.username,
      email: user?.email,
      role: user?.role || "user",
      token,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 2,
    });

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
