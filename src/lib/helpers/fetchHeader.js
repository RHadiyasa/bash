import axios from "axios";
import toast from "react-hot-toast";

export const fetchHeader = async (router, setData, setUserId) => {
  try {
    const res = await axios.get("/api/users/bash");
    const { username, _id } = res.data.data;
    setData(username); // Mengakses data yang diharapkan
    setUserId(_id);
  } catch (error) {
    toast.error(error.response.data.message);
    router.push("/");
  }
};
