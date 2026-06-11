import { connect } from "@/config/dbConfig";
import { requireDeveloper } from "@/lib/helpers/requireDeveloper";
import Transaction from "@/modules/models/transactionModel";
import User from "@/modules/models/userModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function DELETE(request, { params }) {
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

  const bank = await User.findById(id).select("role name");
  if (!bank) {
    return NextResponse.json(
      { error: "Bank sampah tidak ditemukan" },
      { status: 404 }
    );
  }

  if (bank.role === "developer") {
    return NextResponse.json(
      { error: "Tidak bisa menghapus transaksi akun developer" },
      { status: 400 }
    );
  }

  const deleted = await Transaction.deleteMany({ bankSampah: id });

  return NextResponse.json({
    success: true,
    message: `Seluruh transaksi ${bank.name} berhasil dihapus`,
    deletedTransactions: deleted.deletedCount,
  });
}
