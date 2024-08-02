import axios from "axios";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

export const getAllTrashes = async (page = 1, limit = 10) => {
  try {
    const token = getCookie("token");
    const response = await axios.get(
      `/api/users/trash?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      return {
        trashes: response.data.trashes,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      };
    } else {
      toast.error(error);
      return {
        trashes: [],
        totalPages: 1,
        currentPage: 1,
      };
    }
  } catch (error) {
    toast.error(error.messsage);
    return {
      trashes: [],
      totalPages: 1,
      currentPage: 1,
    };
  }
};

export const deleteOneTrash = async (trashId) => {
  try {
    await axios.delete(`/api/users/trash`, {
      data: {
        trashId,
      },
    });
    toast.success("Sampah berhasil dihapus");
  } catch (error) {
    toast.error(error.response?.data?.error || "Gagal menghapus sampah");
  }
};
