import { connect } from "@/config/dbConfig";
import { requireDeveloper } from "@/lib/helpers/requireDeveloper";
import Customer from "@/modules/models/customersModel";
import { NextResponse } from "next/server";

// Helper: cari duplikat untuk satu field
async function findDuplicates(field) {
  return Customer.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

// Helper: rename duplikat pada satu field
// Terlama tetap, yang lebih baru dapat suffix angka (2, 3, ...)
async function deduplicateField(field) {
  const groups = await findDuplicates(field);
  const renamed = [];

  for (const group of groups) {
    const value = group._id;

    const customers = await Customer.find({ [field]: value })
      .sort({ createdAt: 1 })
      .select(`_id ${field} fullName bankSampah createdAt`);

    for (let i = 1; i < customers.length; i++) {
      const customer = customers[i];
      let suffix = i + 1;
      let newValue = `${value}${suffix}`;

      while (await Customer.exists({ [field]: newValue })) {
        suffix++;
        newValue = `${value}${suffix}`;
      }

      await Customer.updateOne(
        { _id: customer._id },
        { $set: { [field]: newValue } }
      );

      renamed.push({
        customerId: customer._id,
        fullName: customer.fullName,
        field,
        oldValue: value,
        newValue,
      });
    }
  }

  return renamed;
}

// GET: preview duplikat tanpa mengubah data
export async function GET(request) {
  await connect();

  const dev = await requireDeveloper(request);
  if (!dev) {
    return NextResponse.json({ error: "Akses ditolak. Khusus developer." }, { status: 403 });
  }

  const [usernameDups, accountDups] = await Promise.all([
    findDuplicates("username"),
    findDuplicates("accountNumber"),
  ]);

  const totalAffected =
    usernameDups.reduce((s, d) => s + d.count - 1, 0) +
    accountDups.reduce((s, d) => s + d.count - 1, 0);

  return NextResponse.json({
    success: true,
    totalAffected,
    username: {
      duplicateGroups: usernameDups.length,
      affected: usernameDups.reduce((s, d) => s + d.count - 1, 0),
      duplicates: usernameDups.map((d) => ({ value: d._id, count: d.count })),
    },
    accountNumber: {
      duplicateGroups: accountDups.length,
      affected: accountDups.reduce((s, d) => s + d.count - 1, 0),
      duplicates: accountDups.map((d) => ({ value: d._id, count: d.count })),
    },
  });
}

// POST: jalankan migrasi untuk username dan accountNumber
export async function POST(request) {
  await connect();

  const dev = await requireDeveloper(request);
  if (!dev) {
    return NextResponse.json({ error: "Akses ditolak. Khusus developer." }, { status: 403 });
  }

  // Jalankan username dulu, baru accountNumber
  const [usernameRenamed, accountRenamed] = await Promise.all([
    deduplicateField("username"),
    deduplicateField("accountNumber"),
  ]);

  const renamed = [...usernameRenamed, ...accountRenamed];
  const total = renamed.length;

  return NextResponse.json({
    success: true,
    message:
      total === 0
        ? "Tidak ada duplikat ditemukan."
        : `${total} data berhasil diperbaiki (${usernameRenamed.length} username, ${accountRenamed.length} rekening).`,
    renamed,
    summary: {
      username: usernameRenamed.length,
      accountNumber: accountRenamed.length,
    },
  });
}
