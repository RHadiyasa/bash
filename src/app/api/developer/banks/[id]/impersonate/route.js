import { connect } from "@/config/dbConfig";
import { requireDeveloper } from "@/lib/helpers/requireDeveloper";
import { generateToken } from "@/modules/auth/services/auth.service";
import User from "@/modules/models/userModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function POST(request, { params }) {
  await connect();

  const dev = await requireDeveloper(request);
  if (!dev) {
    return NextResponse.json(
      { error: "Akses ditolak. Khusus developer." },
      { status: 403 }
    );
  }

  const { id } = params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const bank = await User.findById(id).select(
    "_id username email role isActive isDeleted name"
  );

  if (!bank) {
    return NextResponse.json(
      { error: "Bank sampah tidak ditemukan" },
      { status: 404 }
    );
  }

  if (bank.role === "developer") {
    return NextResponse.json(
      { error: "Tidak bisa login sebagai akun developer lain" },
      { status: 400 }
    );
  }

  if (bank.isActive === false) {
    return NextResponse.json(
      { error: "Bank sampah nonaktif tidak bisa diakses" },
      { status: 403 }
    );
  }

  if (bank.isDeleted === true) {
    return NextResponse.json(
      { error: "Bank sampah sedang berada di temporary delete. Pulihkan dulu." },
      { status: 403 }
    );
  }

  const token = await generateToken({
    id: bank._id,
    username: bank.username,
    email: bank.email,
    role: bank.role || "user",
    impersonatedBy: dev._id,
  });

  const response = NextResponse.json({
    success: true,
    message: `Login sebagai ${bank.name}`,
    userId: bank._id,
    role: bank.role || "user",
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 2,
  });

  return response;
}
