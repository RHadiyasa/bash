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