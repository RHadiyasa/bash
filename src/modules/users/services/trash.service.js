import axios from "axios";
import toast from "react-hot-toast";

export const getAllTrashes = async () => {
  try {
    const response = await axios.get("/api/users/trash");

    if (response.data.success) {
      return response.data.trashes;
    } else {
      toast.error(error);
    }
  } catch (error) {
    toast.error(error.messsage);
  }
};
