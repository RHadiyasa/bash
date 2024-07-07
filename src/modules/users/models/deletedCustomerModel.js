import mongoose, { mongo } from "mongoose";

const deletedCustomerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    default: "customer@email.com",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    default: "passwordCustomer",
  },
  username: {
    type: String,
    required: [true, "Please provide an username"],
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
  },
  deletedAt: {
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
});

const DeletedCustomer =
  mongoose.models.DeletedCustomer ||
  mongoose.model("DeletedCustomer", deletedCustomerSchema);
export default DeletedCustomer;
