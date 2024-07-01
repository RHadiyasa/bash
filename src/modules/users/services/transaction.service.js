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
      // const customerTransaction = response.data.transaction;
      // const transactionByCustomerId = customerTransaction.filter(
      //   (custTransaction) => custTransaction.customer.includes(customerId)
      // );

      // console.log(customerTransaction);
      // console.log(customerId);
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
