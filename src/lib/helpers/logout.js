import axios from "axios";
import toast from "react-hot-toast";

export const logout = async (router) => {
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
