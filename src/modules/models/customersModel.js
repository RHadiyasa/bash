import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    username: {
      type: String,
      required: [true, "Please provide an username"],
      unique: true, // global unique — satu username hanya boleh ada 1 di seluruh sistem
    },
    nik: {
      type: String,
    },
    fullName: {
      type: String,
      required: [true, "Please provide a name"],
    },
    accountNumber: {
      type: String,
      required: [true, "Please provide an account"],
      unique: true, // global unique — satu nomor rekening hanya boleh ada 1 di seluruh sistem
    },
    phone: {
      type: Number,
      required: [true, "Please provide a phone number"],
    },
    address: [
      {
        street: {
          type: String,
        },
        region: {
          type: String,
        },
        city: {
          type: String,
        },
        postalCode: {
          type: String,
        },
        province: {
          type: String,
          default: "Indonesia",
        },
      },
    ],
    photo: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    bankSampah: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalDeposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWithdraw: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWeight: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// username unik global — compound index dihapus, cukup field-level unique: true
customerSchema.index({ nik: 1, bankSampah: 1 }, { unique: true, sparse: true });
customerSchema.index({ bankSampah: 1 });
customerSchema.index({ bankSampah: 1, fullName: 1 });

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);
export default Customer;
