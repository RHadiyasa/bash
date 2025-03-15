import jwt from "jsonwebtoken";
import bycript from "bcryptjs";
import User from "@/modules/models/userModel";
import { NextResponse } from "next/server";

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("invalid login");

  const checkPassword = await bycript.compare(password, user.password);
  if (!checkPassword) throw new Error("invalid login");

  // Check if user is verified
  if (!user.isVerified) {
    return NextResponse.json({ error: "Please verify your email first" }, { status: 400 });
  }

  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  const token = await generateToken(payload);

  delete user.password;

  return { user, token };
};

export const generateToken = async payload => {
  return jwt.sign(payload, process.env.PRIVATE_TOKEN_SECRET, { 
    expiresIn: "8h",
    algorithm: "RS256",
  });
};
