import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      default: "customer@email.com",
      // harus unique nanti
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      default: "passwordCustomer",
      // harus unique nanti
    },
    username: {
      // username hanya boleh ada 1 seluruh bank sampah
      type: String,
      required: [true, "Please provide an username"],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, "Please provide a name"],
    },
    accountNumber: {
      type: String,
      required: [true, "Please provide an account"],
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

customerSchema.index({ username: 1, bankSampah: 1 }, { unique: true });

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);
export default Customer;
