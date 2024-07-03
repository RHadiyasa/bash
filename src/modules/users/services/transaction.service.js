import axios from "axios";
import toast from "react-hot-toast";

export const addTransaction = async (transactionData) => {
  try {
    const response = await axios.post(
      "/api/users/transaction",
      transactionData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Kirim cookies
      }
    );

    console.log(response);
    if (response.data.success) {
      return response.data.transaction;
    } else {
      toast.error(error);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

export const getTransactionHistoryByCustomerId = async (customerId, token) => {
  try {
    const response = await axios.get(`/api/users/transaction/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { customerId },
    });

    if (response.data.success) {
      return {
        transactions: response.data.transactions,
      };
    } else {
      console.error("Gagal memuat transaksi user");
    }
  } catch (error) {
    console.error("Failed to fetch customer transaction", error);
    throw error;
  }
};

export const getTransactionByCustomerId = async (
  customerId,
  token,
  page = 1,
  limit
) => {
  try {
    const response = await axios.get(`/api/users/transaction/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { customerId, page, limit },
    });

    if (response.data.success) {
      return {
        transactions: response.data.transactions,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      };
    } else {
      console.error("Gagal memuat transaksi user");
    }
  } catch (error) {
    console.error("Failed to fetch customer transaction", error);
    throw error;
  }
};

export const getAllTransactions = async () => {
  try {
    const response = await axios.get("/api/users/transaction");
    return response.data.transactions;
  } catch (error) {
    toast.error(error.message);
  }
};

export const updateTransactionStatus = async (transactionId, status) => {
  try {
    const response = await axios.patch(
      `/api/users/transaction/${transactionId}`,
      {
        status,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating transaction status", error);
    throw error;
  }
};
