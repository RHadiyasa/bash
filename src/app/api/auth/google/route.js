import { NextResponse } from "next/server";
import { google } from "googleapis";
import oauth2Client from "@/lib/googleAuth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });
    return NextResponse.redirect(url);
  } else {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      
      const response = NextResponse.redirect("/");
      response.cookies.set("google_oauth_token", tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: tokens.expiry_date
          ? Math.floor((tokens.expiry_date - Date.now()) / 1000)
          : 3600,
        path: "/",
        sameSite: "Lax", // Ensures the cookie is sent with cross-site requests
      });

      return response;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  }
}
