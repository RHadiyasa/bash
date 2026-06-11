import { connect } from "@/config/dbConfig";
import { requireDeveloper } from "@/lib/helpers/requireDeveloper";
import User from "@/modules/models/userModel";
import Customer from "@/modules/models/customersModel";
import Transaction from "@/modules/models/transactionModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const RETENTION_DAYS = 14;

export async function GET(request, { params }) {
  await connect();
  const dev = await requireDeveloper(request);
  if (!dev) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const { id } = params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const bank = await User.findById(id)
    .select(
      "-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry"
    )
    .lean();

  if (!bank) {
    return NextResponse.json({ error: "Bank sampah tidak ditemukan" }, { status: 404 });
  }

  const [customers, transactionCount, recentTransactions] = await Promise.all([
    Customer.find({ bankSampah: id }).select("-password").lean(),
    Transaction.countDocuments({ bankSampah: id }),
    Transaction.find({ bankSampah: id })
      .populate("customer", "fullName accountNumber")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const totalBalance = customers.reduce((s, c) => s + (c.balance || 0), 0);

  return NextResponse.json({
    success: true,
    bank,
    stats: {
      customerCount: customers.length,
      transactionCount,
      totalBalance,
    },
    customers,
    recentTransactions,
  });
}

export async function PATCH(request, { params }) {
  await connect();
  const dev = await requireDeveloper(request);
  if (!dev) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const { id } = params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const bank = await User.findById(id);
  if (!bank) {
    return NextResponse.json({ error: "Bank sampah tidak ditemukan" }, { status: 404 });
  }
  if (bank.role === "developer") {
    return NextResponse.json(
      { error: "Tidak bisa mengubah akun developer" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { action } = body;

  if (action === "toggleActive") {
    if (bank.isDeleted === true) {
      return NextResponse.json(
        { error: "Bank sampah sedang di temporary delete. Pulihkan dulu." },
        { status: 400 }
      );
    }

    bank.isActive = !bank.isActive;
    await bank.save();
    return NextResponse.json({
      success: true,
      message: bank.isActive ? "Bank sampah diaktifkan" : "Bank sampah dinonaktifkan",
      isActive: bank.isActive,
    });
  }

  if (action === "resetPassword") {
    if (bank.isDeleted === true) {
      return NextResponse.json(
        { error: "Bank sampah sedang di temporary delete. Pulihkan dulu." },
        { status: 400 }
      );
    }

    const tempPassword =
      body.newPassword && body.newPassword.length >= 8
        ? body.newPassword
        : crypto.randomBytes(6).toString("base64url");
    bank.password = await bcrypt.hash(tempPassword, 10);
    await bank.save();
    return NextResponse.json({
      success: true,
      message: "Password berhasil direset",
      tempPassword,
    });
  }

  if (action === "restore") {
    if (bank.isDeleted !== true) {
      return NextResponse.json(
        { error: "Bank sampah tidak sedang di temporary delete" },
        { status: 400 }
      );
    }

    bank.isDeleted = false;
    bank.isActive = true;
    bank.deletedAt = undefined;
    bank.deleteExpiresAt = undefined;
    bank.deletedBy = undefined;
    bank.deletionReason = undefined;
    await bank.save();

    return NextResponse.json({
      success: true,
      message: "Bank sampah berhasil dipulihkan",
      isActive: bank.isActive,
    });
  }

  return NextResponse.json({ error: "Aksi tidak dikenal" }, { status: 400 });
}

export async function DELETE(request, { params }) {
  await connect();
  const dev = await requireDeveloper(request);
  if (!dev) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const { id } = params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const bank = await User.findById(id);
  if (!bank) {
    return NextResponse.json({ error: "Bank sampah tidak ditemukan" }, { status: 404 });
  }
  if (bank.role === "developer") {
    return NextResponse.json(
      { error: "Tidak bisa menghapus akun developer" },
      { status: 400 }
    );
  }

  if (bank.isDeleted === true) {
    return NextResponse.json(
      { error: "Bank sampah sudah berada di temporary delete" },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const confirmationText = String(body.confirmationText || "").trim();
  const developerPassword = String(body.developerPassword || "");
  const expectedText = String(bank.name || "").trim();

  if (confirmationText !== expectedText) {
    return NextResponse.json(
      { error: `Ketik "${expectedText}" untuk konfirmasi delete.` },
      { status: 400 }
    );
  }

  if (!developerPassword) {
    return NextResponse.json(
      { error: "Password developer wajib diisi untuk konfirmasi delete." },
      { status: 400 }
    );
  }

  const developer = await User.findById(dev._id).select("password role");
  const passwordValid =
    developer?.role === "developer" &&
    developer?.password &&
    (await bcrypt.compare(developerPassword, developer.password));

  if (!passwordValid) {
    return NextResponse.json(
      { error: "Password developer tidak sesuai." },
      { status: 403 }
    );
  }

  const [customerCount, transactionCount] = await Promise.all([
    Customer.countDocuments({ bankSampah: id }),
    Transaction.countDocuments({ bankSampah: id }),
  ]);

  const now = new Date();
  bank.isDeleted = true;
  bank.isActive = false;
  bank.deletedAt = now;
  bank.deleteExpiresAt = new Date(
    now.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000
  );
  bank.deletedBy = dev._id;
  bank.deletionReason = body.reason || "Developer temporary delete";
  await bank.save();

  return NextResponse.json({
    success: true,
    message:
      "Bank sampah dipindahkan ke temporary delete. Data bisa dipulihkan dalam 14 hari.",
    deletedCustomers: customerCount,
    deletedTransactions: transactionCount,
    deleteExpiresAt: bank.deleteExpiresAt,
  });
}
