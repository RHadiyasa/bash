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

    if (response.data.success) {
      return response.data.transaction;
    } else {
      throw new Error(response.data.message || "Unknown error occurred");
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
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

export const getTransactions = async () => {
  try {
    const response = await axios.get("/api/users/transaction/all");
    return response.data.transactions;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getAllTransactions = async ({
  page = 1,
  limit = 10,
  searchTerm = "",
  status = "all",
}) => {
  try {
    const response = await axios.get("/api/users/transaction", {
      params: { page, limit, searchTerm, status },
    });

    if (response.data.success) {
      return {
        success: true,
        transactions: response.data.transactions,
        totalPages: response.data.totalPages,
      };
    } else {
      throw new Error(response.data.message || "Failed to fetch transactions");
    }
  } catch (error) {
    toast.error(error.message || "Failed to fetch transactions");
    return { transactions: [], totalPages: 1 };
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

export const getTransactionInRange = async ({
  startDate,
  endDate,
  page,
  limit,
  status,
  type,
}) => {
  try {
    const response = await axios.get("/api/users/transaction", {
      params: {
        startDate,
        endDate,
        page,
        limit,
        status,
        type,
      },
    });

    return {
      transactions: response.data.transactions,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching transactions", error);
    throw error;
  }
};

export const getTransactionByDate = async ({startDate, endDate}) => {
  try {
    const response = await axios.get("/api/users/transaction/all", {
      params: {
        startDate,
        endDate,
      },
    });
    return response.data.transactions;
  } catch (error) {
    console.error("Error fetching transactions", error);
    throw error;
  }
};