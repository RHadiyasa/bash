import axios from "axios";
import toast from "react-hot-toast";

export const getCategory = async () => {
  try {
    const response = await axios.get("/api/users/category");

    if (response.data.success) {
      return response.data.categories;
    } else {
      toast.error(error);
    }
  } catch (error) {
    toast.error(error.messsage);
  }
};

export const deleteOneCategory = async (categoryId) => {
  try {
    await axios.delete(`/api/users/category`, {
      data: {
        categoryId,
      },
    });
  } catch (error) {
    toast.error(error.response?.data?.error || "Gagal menghapus kategori");
  }
};
