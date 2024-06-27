import axios from "axios";
import toast from "react-hot-toast";

export const checkUrl = async (params, router, setData, setUserId) => {
  try {
    const res = await axios.get("/api/users/bash");
    console.log({ res });
    const id = res.data.data?._id;
    if (id !== params) {
      router.push(`/profile/${id}`);
      toast.error("Invalid URL, redirecting...");
    }
    setData(res.data.data.username); // Mengakses data yang diharapkan
    setUserId(res.data.data._id);
  } catch (error) {
    console.error("Error fetching user details:", error);
    toast.error("Failed to fetch user details");
    logout(router); // Panggil logout jika terjadi error
  }
};

export const logout = async router => {
  try {
    await axios.get("/api/users/logout");
    toast.success("Logged out");
    router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error(
      error.response?.data?.message ||
        error.message ||
        "An error occurred during logout"
    );
  }
};
