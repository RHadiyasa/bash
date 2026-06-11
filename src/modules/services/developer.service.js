import axios from "axios";
import toast from "react-hot-toast";

export const getDeveloperBanks = async () => {
  try {
    const res = await axios.get("/api/developer/banks", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Gagal memuat data");
    return null;
  }
};

export const getDeveloperBankDetail = async (id) => {
  try {
    const res = await axios.get(`/api/developer/banks/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Gagal memuat detail");
    return null;
  }
};

export const manageBank = async (id, payload) => {
  try {
    const res = await axios.patch(`/api/developer/banks/${id}`, payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Aksi gagal");
    return null;
  }
};

export const deleteBank = async (id, payload = {}) => {
  try {
    const res = await axios.delete(`/api/developer/banks/${id}`, {
      withCredentials: true,
      data: payload,
    });
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Gagal menghapus");
    return null;
  }
};

export const restoreBank = async (id) => {
  try {
    const res = await axios.patch(
      `/api/developer/banks/${id}`,
      { action: "restore" },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Gagal memulihkan bank");
    return null;
  }
};

export const deleteBankTransactions = async (id) => {
  try {
    const res = await axios.delete(`/api/developer/banks/${id}/transactions`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Gagal menghapus transaksi");
    return null;
  }
};

export const impersonateBank = async (id) => {
  try {
    const res = await axios.post(
      `/api/developer/banks/${id}/impersonate`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Gagal login sebagai bank");
    return null;
  }
};
