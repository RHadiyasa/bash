import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Please provide an username"],
    },
    customerName: {
      type: String,
      required: [true, "Please provide a name"],
    },
    customerAccount: {
      type: String,
      required: [true, "Please provide an account"],
    },
    customerPhone: {
      type: String,
      required: [true, "Please provide a phone number"],
    },
    customerAddress: [
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
        province: {
          type: String,
          default: "Indonesia",
        },
      },
    ],
    customerImage: {
      type: String,
    },
    customerTransaction: {
      type: Number,
      min: 0,
    },
    customerBalance: {
      type: Number,
      min: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ username: 1, user: 1 }, { unique: true });

const Customer = mongoose.model.Customer || mongoose.model("Customer", customerSchema);
export default Customer;