import { NextResponse } from "next/server";

export const ok = (data, message = "Success") =>
  NextResponse.json({ success: true, message, data });

export const created = (data, message = "Created") =>
  NextResponse.json({ success: true, message, data }, { status: 201 });

export const err = (message = "Bad Request", status = 400) =>
  NextResponse.json({ success: false, error: message }, { status });

export const unauthorized = (message = "Unauthorized") =>
  NextResponse.json({ success: false, error: message }, { status: 401 });

export const forbidden = (message = "Forbidden") =>
  NextResponse.json({ success: false, error: message }, { status: 403 });

export const notFound = (message = "Not Found") =>
  NextResponse.json({ success: false, error: message }, { status: 404 });

export const serverError = (message = "Internal Server Error") =>
  NextResponse.json({ success: false, error: message }, { status: 500 });
