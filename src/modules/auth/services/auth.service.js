import jwt from "jsonwebtoken";
import { loginUser } from "@/modules/users/services/user.service";
import bycript from "bcryptjs";
import User from "@/modules/users/models/userModel";

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("invalid login");

  const checkPassword = await bycript.compare(password, user.password);
  if (!checkPassword) throw new Error("invalid login");

  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  const token = await generateToken(payload);

  delete user.password;

  return { user, payload, token };
};

export const generateToken = async payload => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "2h" });
};
