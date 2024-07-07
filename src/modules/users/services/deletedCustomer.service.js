import axios from "axios";
import toast from "react-hot-toast";

export const getDeletedCustomer = async () => {
  try {
    const response = await axios.get("/api/users/deletedCustomers");
    return response.data.deletedCustomers;
  } catch (error) {
    toast.error(error.message);
  }
};
