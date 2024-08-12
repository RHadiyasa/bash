import axios from "axios";
import toast from "react-hot-toast";

export const getCustomerAsPublic = async (username, accountNumber) => {
  try {
    const response = await axios.get("/api/public/balance", {
      params: { username, accountNumber },
    });

    return response.data.customer;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};
