// import { connect } from "@/config/dbConfig";
// import User from "../models/userModel";

// export const loginUser = async (email) => {
//   await connect();
// return User.findOne({ email });
// };

// export const createUser = async (payload) => {
//   await connect();
//   return User.create(payload);
// };

// export const updateUser = async (id, payload) => {
//   await connect();
//   return User.findOneAndUpdate({ _id: id }, { payload });
// };

// export const deleteUser = async (id) => {
//   await connect();
//   return User.deleteOne({ _id: id });
// };

import axios from "axios";
import toast from "react-hot-toast";

export const getUserDetail = async () => {
  try {
    const response = await axios.get("/api/users/bash", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ini penting untuk mengirim cookies
    });

    return response.data.data;
  } catch (error) {
    // console.error("Failed to fetch user details", error);
    throw error;
  }
};

export const updateTransactionFee = async (transactionFee) => {
  try {
    await axios.put("/api/users/bash", transactionFee, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  } catch (error) {
    console.error("Failed update transaction fee", error);
  }
};

export const deleteAllTransactions = async () => {
  try {
    const response = await axios.delete("/api/users/transaction", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    if (!response.data.deleted) {
      toast.error("Gagal menghapus data");
      return;
    }

    toast.success("Data transaksi berhasil dihapus");
  } catch (error) {
    console.error("Failed delete transactions", error);
  }
};
