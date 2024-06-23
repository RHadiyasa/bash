import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const fetchHeader = async (setData, setUserId) => {
  try {
    const res = await axios.get("/api/users/bash");
    const { username, _id } = res.data.data;
    setData(username); // Mengakses data yang diharapkan
    setUserId(_id);
  } catch (error) {
    console.error("Error fetching user details:", error);
    toast.error("Failed to fetch user details");
  }
};

