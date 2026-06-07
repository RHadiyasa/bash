import { logout } from "@/lib/helpers";
import axios from "axios";
import toast from "react-hot-toast";

export const updateCustomer = async (data, token) => {
  try {
    const response = await axios.put(`/api/users/customer/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.error || error.message);
    console.error(error);
    return null;
  }
};

export const addCustomer = async (customerData) => {
  try {
    const response = await axios.post("/api/users/customer", customerData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ini penting untuk mengirim cookies
    });

    return response.data.customer;
  } catch (error) {
    console.error("Failed to add customer", error);
    throw error;
  }
};

export const getAllCustomers = async () => {
  try {
    const response = await axios.get("/api/users/customer");
    return response.data.customers;
  } catch (error) {
    toast.error(error.response?.data?.error || error.message);
    return [];
  }
};

export const getCustomerOptions = async () => {
  try {
    const response = await axios.get("/api/users/customer", {
      params: { mode: "options" },
      withCredentials: true,
    });
    return response.data.customers || [];
  } catch (error) {
    toast.error(error.response?.data?.error || error.message);
    return [];
  }
};

export const getCustomerDetails = async (id, token, router) => {
  try {
    const response = await axios.get(`/api/users/customer/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      params: { id },
      withCredentials: true,
    });

    if (response.data.success) {
      const customers = response.data.customers || [];
      return customers.find((cust) => cust._id === id) || customers[0] || null;
    } else {
      console.error("Gagal memuat detail customer");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch user details", error);
    if (router) {
      logout(router);
    }
    throw error;
  }
};

export const getCustomersPage = async ({
  page = 1,
  limit = 10,
  search = "",
  region = "all",
} = {}) => {
  try {
    const response = await axios.get("/api/users/customer", {
      params: { page, limit, search, region },
      withCredentials: true,
    });

    return {
      customers: response.data.customers || [],
      pagination: response.data.pagination || {
        page,
        limit,
        totalPages: 1,
        totalCustomers: 0,
        filteredCustomers: 0,
      },
      summary: response.data.summary || {
        totalBalance: 0,
        totalDeposit: 0,
        totalWithdraw: 0,
        totalWeight: 0,
      },
      regions: response.data.filters?.regions || [],
    };
  } catch (error) {
    toast.error(error.response?.data?.error || error.message);
    return {
      customers: [],
      pagination: {
        page,
        limit,
        totalPages: 1,
        totalCustomers: 0,
        filteredCustomers: 0,
      },
      summary: {
        totalBalance: 0,
        totalDeposit: 0,
        totalWithdraw: 0,
        totalWeight: 0,
      },
      regions: [],
    };
  }
};

export const deleteCustomer = async (id) => {
  try {
    await axios.delete("/api/users/customer", {
      data: {
        customerId: id,
      },
    });
  } catch (error) {
    toast.error("Error deleting customer", error);
  }
};

export const validateCustomerInput = ({
  fullName,
  nik,
  phoneNumber,
  address,
}) => {
  if (fullName.length === 0) {
    toast.error("Nama Lengkap kosong");
  }

  if (nik.length !== 16) {
    toast.error("NIK tidak valid");
  }

  if (phoneNumber.length === 0) {
    toast.error("Aku boleh minta WA kamu ga?");
  }

  if (address.street.length === 0) {
    toast.error("Nama Jalan Kosong");
  }
  if (address.region.length === 0) {
    toast.error("Shareloc dong manies");
  }
  if (!address.city.length) {
    toast.error("Askot mana?");
  }

  if (!address.postalCode.length || address.postalCode.length < 5) {
    toast.error("Kodepos tidak valid");
  }

  if (!address.province.length) {
    toast.error("Provinsi kosong");
  }
};
