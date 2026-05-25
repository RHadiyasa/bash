import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Customer from "@/modules/models/customersModel";
import InventoryStock from "@/modules/models/inventoryStockModel";
import Transaction from "@/modules/models/transactionModel";
import Trash from "@/modules/models/trashModel";
import User from "@/modules/models/userModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

export async function POST(request) {
  await connect();

  const userId = getDataFromToken(request);
  if (!userId) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const transactions = Array.isArray(body.transactions)
      ? body.transactions
      : [];
    const batchId = body.batchId || `batch-${Date.now()}`;

    if (transactions.length === 0) {
      return NextResponse.json(
        { error: "Minimal satu transaksi wajib diisi" },
        { status: 400 }
      );
    }

    const bankSampahId = toObjectId(userId);
    const normalized = transactions.map((item, index) => ({
      ...item,
      transactionType: item.transactionType || "deposit",
      transactionStatus: item.transactionStatus || "pending",
      clientRequestId:
        item.clientRequestId || `${batchId}-${item.customer}-${item.trash}-${index}`,
      batchId,
      trashWeight: Number(item.trashWeight),
    }));

    const invalidItem = normalized.find(
      (item) =>
        !item.customer ||
        !item.trash ||
        item.transactionType !== "deposit" ||
        !Number.isFinite(item.trashWeight) ||
        item.trashWeight <= 0
    );

    if (invalidItem) {
      return NextResponse.json(
        {
          error:
            "Data batch tidak valid. Pastikan nasabah, sampah, dan berat sudah diisi.",
        },
        { status: 400 }
      );
    }

    const clientRequestIds = normalized.map((item) => item.clientRequestId);
    const existingTransactions = await Transaction.find({
      bankSampah: bankSampahId,
      clientRequestId: { $in: clientRequestIds },
    });

    if (existingTransactions.length === normalized.length) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        message: "Batch sudah pernah tersimpan",
        transactions: existingTransactions,
        createdCount: 0,
      });
    }

    const newItems = normalized.filter(
      (item) =>
        !existingTransactions.some(
          (transaction) => transaction.clientRequestId === item.clientRequestId
        )
    );

    const customerIds = [...new Set(newItems.map((item) => item.customer))];
    const trashIds = [...new Set(newItems.map((item) => item.trash))];

    const [customers, trashes, bankSampah] = await Promise.all([
      Customer.find({
        _id: { $in: customerIds },
        bankSampah: bankSampahId,
      }),
      Trash.find({
        _id: { $in: trashIds },
        user: bankSampahId,
      }),
      User.findById(bankSampahId).select("transactionFee"),
    ]);

    if (customers.length !== customerIds.length) {
      return NextResponse.json(
        { error: "Ada nasabah yang tidak ditemukan pada bank sampah ini" },
        { status: 404 }
      );
    }

    if (trashes.length !== trashIds.length) {
      return NextResponse.json(
        { error: "Ada data sampah yang tidak ditemukan pada bank sampah ini" },
        { status: 404 }
      );
    }

    const trashMap = new Map(
      trashes.map((trash) => [String(trash._id), trash])
    );
    const session = await mongoose.startSession();
    const createdTransactions = [];

    try {
      await session.withTransaction(async () => {
        for (const item of newItems) {
          const trash = trashMap.get(String(item.trash));
          const grossValue =
            Number(item.transactionAmount) > 0
              ? Number(item.transactionAmount)
              : item.trashWeight * Number(trash?.trashPrice || 0);

          if (!grossValue || grossValue <= 0) {
            throw new Error(
              `Nilai transaksi tidak valid untuk ${trash?.trashName || "sampah"}`
            );
          }

          const transaction = new Transaction({
            customer: item.customer,
            bankSampah: bankSampahId,
            trash: item.trash,
            trashWeight: item.trashWeight,
            transactionAmount: grossValue,
            transactionType: "deposit",
            transactionStatus: item.transactionStatus,
            clientRequestId: item.clientRequestId,
            batchId,
          });

          await transaction.save({ session });
          createdTransactions.push(transaction);

          const fee = grossValue * ((bankSampah?.transactionFee || 0) / 100);
          const costBasis = grossValue - fee;

          await InventoryStock.findOneAndUpdate(
            { bankSampah: bankSampahId, trash: item.trash },
            {
              $set: {
                trashNameSnapshot: trash?.trashName || "",
              },
              $inc: {
                currentWeight: item.trashWeight,
                totalWeightIn: item.trashWeight,
                totalCostBasis: costBasis,
              },
            },
            { upsert: true, new: true, session }
          );
        }
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json({
      success: true,
      message: "Batch transaksi berhasil disimpan",
      batchId,
      createdCount: createdTransactions.length,
      skippedDuplicates: existingTransactions.length,
      transactions: [...existingTransactions, ...createdTransactions],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Gagal menyimpan batch transaksi" },
      { status: 500 }
    );
  }
}
