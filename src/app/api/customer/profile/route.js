import { connect } from "@/config/dbConfig";
import { getCustomerFromToken } from "@/lib/helpers/getCustomerFromToken";
import Customer from "@/modules/models/customersModel";
import User from "@/modules/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connect();

  try {
    const decoded = getCustomerFromToken(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await Customer.findById(decoded.id)
      .select("-password")
      .lean();

    if (!customer) {
      return NextResponse.json(
        { error: "Nasabah tidak ditemukan" },
        { status: 404 }
      );
    }

    const bank = await User.findById(customer.bankSampah)
      .select("name username")
      .lean();

    return NextResponse.json({
      success: true,
      customer: {
        ...customer,
        bankSampahName: bank?.name || bank?.username || "-",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Hanya fullName, phone, address yang boleh diupdate oleh nasabah sendiri.
// accountNumber dan bankSampah tidak boleh diubah.
export async function PATCH(request) {
  await connect();

  try {
    const decoded = getCustomerFromToken(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, address } = body;

    const update = {};

    if (fullName !== undefined) {
      if (!String(fullName).trim()) {
        return NextResponse.json(
          { error: "Nama lengkap tidak boleh kosong" },
          { status: 400 }
        );
      }
      update.fullName = String(fullName).trim();
    }

    if (phone !== undefined) {
      update.phone = Number(phone);
    }

    if (address !== undefined) {
      // address adalah array; terima seluruh array baru
      update.address = address;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data yang diubah" },
        { status: 400 }
      );
    }

    const updated = await Customer.findByIdAndUpdate(
      decoded.id,
      { $set: update },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui",
      customer: updated,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
