import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logout berhasil" });
  response.cookies.set("customer-token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return response;
}
