import { connect } from "@/config/dbConfig";
import { generateToken } from "@/modules/auth/services/auth.service";
import Customer from "@/modules/models/customersModel";
import { rateLimit } from "@/lib/utils/rateLimit";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { allowed, retryAfter } = rateLimit(request, {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: `Terlalu banyak percobaan. Coba lagi dalam ${retryAfter} detik.` },
      { status: 429 }
    );
  }

  await connect();

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const customer = await Customer.findOne({ username }).select(
      "+password fullName accountNumber balance bankSampah username"
    );

    if (!customer) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    // Nasabah lama yang belum punya password: password default = username
    const storedPassword = customer.password || "";
    const fallbackMatch =
      !customer.password && password === customer.username;
    const bcryptMatch =
      customer.password && (await bcrypt.compare(password, customer.password));

    if (!fallbackMatch && !bcryptMatch) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    // Jika nasabah lama (belum punya hash), simpan hash sekarang
    if (!customer.password) {
      const hash = await bcrypt.hash(password, 10);
      await Customer.updateOne({ _id: customer._id }, { $set: { password: hash } });
    }

    const payload = {
      id: customer._id,
      username: customer.username,
      bankSampah: customer.bankSampah,
      role: "customer",
    };

    const token = await generateToken(payload);

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      customerId: customer._id,
      username: customer.username,
      fullName: customer.fullName,
    });

    response.cookies.set("customer-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Gagal login" },
      { status: 500 }
    );
  }
}
