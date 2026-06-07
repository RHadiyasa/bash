import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Customer from "@/modules/models/customersModel";
import InventoryStock from "@/modules/models/inventoryStockModel";
import Transaction from "@/modules/models/transactionModel";
import Trash from "@/modules/models/trashModel";
import User from "@/modules/models/userModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const maxDuration = 60;

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const addIncrement = (map, key, increments) => {
  const current = map.get(key) || {};

  Object.entries(increments).forEach(([field, value]) => {
    current[field] = (current[field] || 0) + value;
  });

  map.set(key, current);
};

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
      transactionAmount: Number(item.transactionAmount || 0),
    }));

    const invalidItem = normalized.find(
      (item) =>
        !item.customer ||
        !item.trash ||
        !mongoose.Types.ObjectId.isValid(item.customer) ||
        !mongoose.Types.ObjectId.isValid(item.trash) ||
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
    }).lean();

    if (existingTransactions.length === normalized.length) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        message: "Batch sudah pernah tersimpan",
        transactions: existingTransactions,
        createdCount: 0,
      });
    }

    const existingRequestIds = new Set(
      existingTransactions.map((transaction) => transaction.clientRequestId)
    );
    const newItems = normalized.filter(
      (item) => !existingRequestIds.has(item.clientRequestId)
    );

    const customerIds = [...new Set(newItems.map((item) => item.customer))];
    const trashIds = [...new Set(newItems.map((item) => item.trash))];

    const [customers, trashes, bankSampah] = await Promise.all([
      Customer.find({
        _id: { $in: customerIds },
        bankSampah: bankSampahId,
      })
        .select("_id")
        .lean(),
      Trash.find({
        _id: { $in: trashIds },
        user: bankSampahId,
      })
        .select("_id trashName trashPrice")
        .lean(),
      User.findById(bankSampahId).select("transactionFee").lean(),
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
    const feePercentage = Number(bankSampah?.transactionFee || 0) / 100;
    const transactionDocs = [];
    const customerIncrements = new Map();
    const inventoryIncrements = new Map();
    let totalFee = 0;
    let totalWeight = 0;

    for (const item of newItems) {
      const trash = trashMap.get(String(item.trash));
      const grossValue =
        item.transactionAmount > 0
          ? item.transactionAmount
          : item.trashWeight * Number(trash?.trashPrice || 0);

      if (!Number.isFinite(grossValue) || grossValue <= 0) {
        throw new Error(
          `Nilai transaksi tidak valid untuk ${trash?.trashName || "sampah"}`
        );
      }

      const fee = grossValue * feePercentage;
      const customerValue = grossValue - fee;

      totalFee += fee;
      totalWeight += item.trashWeight;

      transactionDocs.push({
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

      addIncrement(customerIncrements, String(item.customer), {
        balance: customerValue,
        totalDeposit: customerValue,
        totalWeight: item.trashWeight,
      });

      addIncrement(inventoryIncrements, String(item.trash), {
        currentWeight: item.trashWeight,
        totalWeightIn: item.trashWeight,
        totalCostBasis: customerValue,
      });
    }

    const session = await mongoose.startSession();
    const createdTransactions = [];

    try {
      await session.withTransaction(async () => {
        const insertedTransactions = await Transaction.insertMany(
          transactionDocs,
          { session }
        );
        createdTransactions.push(...insertedTransactions);

        const customerBulkOps = [...customerIncrements.entries()].map(
          ([customerId, increments]) => ({
            updateOne: {
              filter: { _id: customerId, bankSampah: bankSampahId },
              update: { $inc: increments },
            },
          })
        );

        if (customerBulkOps.length > 0) {
          await Customer.bulkWrite(customerBulkOps, { session });
        }

        await User.updateOne(
          { _id: bankSampahId },
          {
            $inc: {
              revenue: totalFee,
              totalTrashWeight: totalWeight,
            },
          },
          { session }
        );

        const inventoryBulkOps = [...inventoryIncrements.entries()].map(
          ([trashId, increments]) => {
            const trash = trashMap.get(trashId);

            return {
              updateOne: {
                filter: { bankSampah: bankSampahId, trash: trashId },
                update: {
                  $set: { trashNameSnapshot: trash?.trashName || "" },
                  $inc: increments,
                },
                upsert: true,
              },
            };
          }
        );

        if (inventoryBulkOps.length > 0) {
          await InventoryStock.bulkWrite(inventoryBulkOps, { session });
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
