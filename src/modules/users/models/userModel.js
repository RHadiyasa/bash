import crypto from "crypto";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: [true, "Please provide a phone Number"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    location: [
      {
        province: {
          type: String,
        },
        regency: {
          type: String,
        },
        district: {
          type: String,
        },
        village: {
          type: String,
        },
      },
    ],
    photo: {
      type: String,
    },
    transactionFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    revenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTrashWeight: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.verifyToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.verifyTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
