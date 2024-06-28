import { connect } from "@/config/dbConfig";
import User from "../models/userModel";

export const loginUser = async (email) => {
  await connect();
  return User.findOne({ email });
};

export const createUser = async (payload) => {
  await connect();
  return User.create(payload);
};

export const getUserDetail = async (id) => { 
  await connect();
  return User.findOne({ _id: id });
};

export const updateUser = async (id, payload) => {
  await connect();
  return User.findOneAndUpdate({ _id: id }, { payload });
};

export const deleteUser = async (id) => {
  await connect();
  return User.deleteOne({ _id: id });
};