import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import axios from "axios";
import toast from "react-hot-toast";

export const registerUser = async (user) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post("/api/users/register", user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      toast.success("Register success...");
      toast.success("Kami sudah mengirim pesan konfirmasi ke email Anda!");
    } else {
      toast.error("Registrasi gagal...");
    }
  } catch (error) {
    console.error(error);
  }
};

export const getUserDetail = async (req) => {
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

export const updateProfile = async (updatedProfile, id) => {
  try {
    const response = await axios.put(`/api/users/${id}`, updatedProfile, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response;
  } catch (error) {
    console.error("Fauled update profile", error);
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

export const deleteAllInactiveCustomers = async () => {
  try {
    const response = await axios.delete(
      "/api/users/deletedCustomers?isDeleteAll=true",
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (!response.data.deleted) {
      toast.error("Gagal menghapus data");
      return;
    }

    toast.success("Semua Non-Aktif nasabah berhasil dihapus");
  } catch (error) {
    console.error("Failed delete inactive customers", error);
  }
};
