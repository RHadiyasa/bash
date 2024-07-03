import crypto from "crypto";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide an username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
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
});

userSchema.methods.generateVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.verifyToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  this.verifyTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
