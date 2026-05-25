import axios from "axios";
import toast from "react-hot-toast";

export const fetchHeader = async (router, setData, setUserId) => {
  try {
    const res = await axios.get("/api/users/bash");
    const { name, _id } = res.data.data;
    setData(name);
    setUserId(_id);
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      return;
    }
    toast.error(error.response?.data?.message || "Terjadi kesalahan");
  }
};
