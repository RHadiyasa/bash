import { connect } from "@/config/dbConfig";
import { getCustomerFromToken } from "@/lib/helpers/getCustomerFromToken";
import Customer from "@/modules/models/customersModel";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  await connect();

  try {
    const decoded = getCustomerFromToken(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Password lama dan password baru wajib diisi" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password baru minimal 6 karakter" },
        { status: 400 }
      );
    }

    const customer = await Customer.findById(decoded.id).select("password username");
    if (!customer) {
      return NextResponse.json(
        { error: "Nasabah tidak ditemukan" },
        { status: 404 }
      );
    }

    // Nasabah yang belum pernah ganti password: password = username
    const storedPassword = customer.password || "";
    const valid = customer.password
      ? await bcrypt.compare(currentPassword, customer.password)
      : currentPassword === customer.username;

    if (!valid) {
      return NextResponse.json(
        { error: "Password lama tidak sesuai" },
        { status: 401 }
      );
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await Customer.updateOne(
      { _id: decoded.id },
      { $set: { password: hash } }
    );

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
