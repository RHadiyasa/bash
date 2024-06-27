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
      require: [true, "Please provide an username"],
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
      type: String,
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
    transactions: {
      type: Number,
    },
    balance: {
      type: Number,
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
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ username: 1 }, { unique: true });

const Customer =
  mongoose.model.Customer || mongoose.model("Customer", customerSchema);
export default Customer;
