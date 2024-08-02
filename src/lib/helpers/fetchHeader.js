import axios from "axios";
import toast from "react-hot-toast";

export const fetchHeader = async (router, setData, setUserId) => {
  try {
    const res = await axios.get("/api/users/bash");
    const { name, _id } = res.data.data;
    setData(name);
    setUserId(_id);
  } catch (error) {
    router.push("/");
    setTimeout(() => {
      toast(error.response?.data?.message);
    }, 2000);
  }
};
