import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Customer from "@/modules/models/customersModel";
import DeletedCustomer from "@/modules/models/deletedCustomerModel";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createUsernameBase = (fullName = "") => {
  const normalized = String(fullName)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  return normalized || "nasabah";
};

const generateUniqueUsername = async (fullName) => {
  const base = createUsernameBase(fullName);
  let candidate = base;
  let suffix = 1;

  while (await Customer.exists({ username: candidate })) {
    suffix += 1;
    candidate = `${base}${suffix}`;

    if (suffix > 9999) {
      throw new Error("Gagal membuat username unik. Coba nama lain.");
    }
  }

  return candidate;
};

const generateUniqueAccountNumber = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = String(randomInt(0, 10_000_000_000)).padStart(10, "0");
    const exists = await Customer.exists({ accountNumber: candidate });

    if (!exists) {
      return candidate;
    }
  }

  throw new Error("Gagal membuat nomor rekening unik. Coba lagi.");
};

export async function POST(request) {
  await connect();

  try {
    const reqBody = await request.json();
    const {
      fullName,
      nik,
      phoneNumber,
      balance,
      totalWeight,
      address,
    } = reqBody;
    const userId = getDataFromToken(request);

    // check userId
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!String(fullName || "").trim()) {
      return NextResponse.json(
        { error: "Nama nasabah wajib diisi" },
        { status: 400 }
      );
    }

    const generatedUsername = await generateUniqueUsername(fullName);
    const generatedAccountNumber = await generateUniqueAccountNumber();

    // Password default = username (di-hash)
    const hashedPassword = await bcrypt.hash(generatedUsername, 10);
    const initialBalance = Math.max(Number(balance || 0), 0);
    const initialWeight = Math.max(Number(totalWeight || 0), 0);

    // Create new Customer
    const newCustomer = new Customer({
      username: generatedUsername,
      fullName: String(fullName).trim(),
      nik,
      accountNumber: generatedAccountNumber,
      phone: phoneNumber,
      balance: initialBalance,
      totalDeposit: initialBalance,
      totalWeight: initialWeight,
      address,
      bankSampah: userId,
      password: hashedPassword,
    });

    await newCustomer.save();

    return NextResponse.json({
      message: "Customer created successfully",
      success: true,
      customer: newCustomer,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
    const mode = searchParams.get("mode");

    if (mode === "options") {
      const customers = await Customer.find({ bankSampah: userId })
        .select("fullName accountNumber username balance")
        .sort({ fullName: 1 })
        .lean();

      return NextResponse.json({
        message: "Customer options retrieved successfully",
        success: true,
        customers,
      });
    }

    const hasPaginationParams =
      searchParams.has("page") ||
      searchParams.has("limit") ||
      searchParams.has("search") ||
      searchParams.has("region");

    if (!hasPaginationParams) {
      const customers = await Customer.find({ bankSampah: userId });
      return NextResponse.json({
        message: "Customers retrieved successfully",
        success: true,
        customers: customers,
      });
    }

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10", 10), 5),
      100
    );
    const search = searchParams.get("search")?.trim() || "";
    const region = searchParams.get("region")?.trim() || "";
    const skip = (page - 1) * limit;

    const query = { bankSampah: userId };

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      query.$or = [
        { fullName: searchRegex },
        { accountNumber: searchRegex },
        { username: searchRegex },
        { "address.region": searchRegex },
      ];
    }

    if (region && region !== "all") {
      query["address.region"] = region;
    }

    const aggregateQuery = {
      ...query,
      bankSampah: new mongoose.Types.ObjectId(userId),
    };

    const [customers, totalCustomers, filteredCustomers, summary, regions] =
      await Promise.all([
        Customer.find(query).sort({ fullName: 1 }).skip(skip).limit(limit),
        Customer.countDocuments({ bankSampah: userId }),
        Customer.countDocuments(query),
        Customer.aggregate([
          { $match: aggregateQuery },
          {
            $group: {
              _id: null,
              totalBalance: { $sum: { $ifNull: ["$balance", 0] } },
              totalDeposit: { $sum: { $ifNull: ["$totalDeposit", 0] } },
              totalWithdraw: { $sum: { $ifNull: ["$totalWithdraw", 0] } },
              totalWeight: { $sum: { $ifNull: ["$totalWeight", 0] } },
            },
          },
        ]),
        Customer.distinct("address.region", { bankSampah: userId }),
      ]);

    const summaryData = summary[0] || {
      totalBalance: 0,
      totalDeposit: 0,
      totalWithdraw: 0,
      totalWeight: 0,
    };

    return NextResponse.json({
      message: "Customers retrieved successfully",
      success: true,
      customers: customers,
      pagination: {
        page,
        limit,
        totalPages: Math.max(Math.ceil(filteredCustomers / limit), 1),
        totalCustomers,
        filteredCustomers,
      },
      summary: summaryData,
      filters: {
        regions: regions.filter(Boolean).sort(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  await connect();

  try {
    const userId = getDataFromToken(request);
    const { customerId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    const customer = await Customer.findOne({
      _id: customerId,
      bankSampah: userId,
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const deletedCustomer = new DeletedCustomer({
      email: customer.email,
      password: customer.password,
      username: customer.username,
      fullName: customer.fullName,
      accountNumber: customer.accountNumber,
      phone: customer.phone,
      address: customer.address,
      balance: customer.balance,
      joinDate: customer.joinDate,
      bankSampah: customer.bankSampah,
      totalDeposit: customer.totalDeposit,
      totalWithdraw: customer.totalWithdraw,
    });

    await deletedCustomer.save();

    await Customer.deleteOne({ _id: customerId, bankSampah: userId });
    return NextResponse.json({
      message: "Customers deleted successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
