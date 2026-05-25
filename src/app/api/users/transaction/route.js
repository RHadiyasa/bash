import Customer from "@/modules/models/customersModel";
import Trash from "@/modules/models/trashModel";
import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import InventoryStock from "@/modules/models/inventoryStockModel";
import Transaction from "@/modules/models/transactionModel";
import User from "@/modules/models/userModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function GET(request) {
  await connect();

  try {
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        {
          error: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const searchTerm = searchParams.get("searchTerm")?.trim();
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const bankSampahId = new mongoose.Types.ObjectId(userId);
    const filter = { bankSampah: bankSampahId };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (status && status !== "all") {
      filter.transactionStatus = status;
    }

    if (type && type !== "all") {
      filter.transactionType = type;
    }

    if (searchTerm) {
      const keyword = escapeRegex(searchTerm);
      const matchingCustomers = await Customer.find({
        bankSampah: userId,
        $or: [
          { fullName: { $regex: keyword, $options: "i" } },
          { accountNumber: { $regex: keyword, $options: "i" } },
          { username: { $regex: keyword, $options: "i" } },
        ],
      })
        .select("_id")
        .lean();

      filter.customer = { $in: matchingCustomers.map((customer) => customer._id) };
    }

    const skip = (page - 1) * limit;

    const [transactions, totalTransactions, summary] = await Promise.all([
      Transaction.find(filter)
        .populate("trash")
        .populate("customer")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter),
      Transaction.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$transactionAmount" },
            depositAmount: {
              $sum: {
                $cond: [
                  { $eq: ["$transactionType", "deposit"] },
                  "$transactionAmount",
                  0,
                ],
              },
            },
            withdrawAmount: {
              $sum: {
                $cond: [
                  { $eq: ["$transactionType", "withdraw"] },
                  "$transactionAmount",
                  0,
                ],
              },
            },
            pendingCount: {
              $sum: {
                $cond: [{ $eq: ["$transactionStatus", "pending"] }, 1, 0],
              },
            },
            completedCount: {
              $sum: {
                $cond: [{ $eq: ["$transactionStatus", "completed"] }, 1, 0],
              },
            },
            failedCount: {
              $sum: {
                $cond: [{ $eq: ["$transactionStatus", "failed"] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);
    const totalPages = Math.ceil(totalTransactions / limit);
    const summaryData = summary[0] || {};

    return NextResponse.json({
      message: "Transactions retrieved successfully",
      success: true,
      transactions,
      totalPages: Math.max(totalPages, 1),
      currentPage: page,
      totalTransactions,
      summary: {
        totalAmount: summaryData.totalAmount || 0,
        depositAmount: summaryData.depositAmount || 0,
        withdrawAmount: summaryData.withdrawAmount || 0,
        pendingCount: summaryData.pendingCount || 0,
        completedCount: summaryData.completedCount || 0,
        failedCount: summaryData.failedCount || 0,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connect();

  try {
    const reqBody = await request.json();
    const {
      customer,
      trash,
      trashWeight,
      transactionAmount,
      transactionType,
      transactionStatus,
      clientRequestId,
      batchId,
    } = reqBody;

    const userId = getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!customer || !transactionType) {
      return NextResponse.json(
        { error: "Customer dan tipe transaksi wajib diisi" },
        { status: 400 }
      );
    }

    const bankSampahId = new mongoose.Types.ObjectId(userId);

    if (clientRequestId) {
      const existingTransaction = await Transaction.findOne({
        bankSampah: bankSampahId,
        clientRequestId,
      });

      if (existingTransaction) {
        return NextResponse.json({
          message: "Transaction already recorded",
          success: true,
          transaction: existingTransaction,
          duplicate: true,
        });
      }
    }

    const customerData = await Customer.findOne({
      _id: customer,
      bankSampah: bankSampahId,
    });

    if (!customerData) {
      return NextResponse.json(
        { error: "Nasabah tidak ditemukan pada bank sampah ini" },
        { status: 404 }
      );
    }

    let computedTransactionAmount = Number(transactionAmount || 0);
    let selectedTrash = null;

    if (transactionType === "deposit") {
      selectedTrash = trash
        ? await Trash.findOne({ _id: trash, user: bankSampahId })
        : null;

      if (!selectedTrash) {
        return NextResponse.json(
          { error: "Data sampah wajib diisi untuk transaksi deposit" },
          { status: 400 }
        );
      }
      if (!trashWeight || trashWeight <= 0) {
        return NextResponse.json(
          { error: "Berat sampah harus lebih dari 0" },
          { status: 400 }
        );
      }

      computedTransactionAmount = Number(trashWeight) * Number(selectedTrash.trashPrice || 0);

      if (!computedTransactionAmount || computedTransactionAmount <= 0) {
        return NextResponse.json(
          { error: "Nilai transaksi deposit tidak valid" },
          { status: 400 }
        );
      }
    }

    if (transactionType === "withdraw") {
      if (!computedTransactionAmount || computedTransactionAmount <= 0) {
        return NextResponse.json(
          { error: "Jumlah penarikan harus lebih dari 0" },
          { status: 400 }
        );
      }

      if (Number(customerData.balance || 0) < computedTransactionAmount) {
        return NextResponse.json(
          { error: "Saldo nasabah tidak mencukupi" },
          { status: 400 }
        );
      }
    }

    const newTransaction = new Transaction({
      customer,
      bankSampah: userId,
      trash,
      trashWeight: transactionType === "withdraw" ? 0 : trashWeight,
      transactionAmount: computedTransactionAmount,
      transactionType,
      transactionStatus:
        transactionStatus ||
        (transactionType === "withdraw" ? "completed" : "pending"),
      clientRequestId,
      batchId,
    });

    await newTransaction.save();

    if (transactionType === "deposit") {
      const [trashData, bankSampah] = await Promise.all([
        selectedTrash || Trash.findOne({ _id: trash, user: bankSampahId }),
        User.findById(bankSampahId).select("transactionFee"),
      ]);
      const transactionValue = newTransaction.transactionAmount;
      const fee = transactionValue * ((bankSampah?.transactionFee || 0) / 100);
      const costBasis = transactionValue - fee;

      await InventoryStock.findOneAndUpdate(
        { bankSampah: bankSampahId, trash },
        {
          $set: {
            trashNameSnapshot: trashData?.trashName || "",
          },
          $inc: {
            currentWeight: Number(trashWeight),
            totalWeightIn: Number(trashWeight),
            totalCostBasis: costBasis,
          },
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({
      message: "Transaction created successfully",
      success: true,
      transaction: newTransaction,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  return NextResponse.json(
    {
      error:
        "Akses ditolak. Penghapusan seluruh transaksi hanya tersedia melalui panel developer.",
    },
    { status: 403 }
  );
}
