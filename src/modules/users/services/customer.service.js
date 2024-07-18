import axios from "axios";
import toast from "react-hot-toast";

export const updateCustomer = async (data, token) => {
  try {
    const response = await axios.put(`/api/users/customer/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    toast.error(error.message);
    console.error(error);
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

    return response.data.data;
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
    toast.error(error.message);
  }
};

export const getCustomerDetails = async (id, token) => {
  try {
    const response = await axios.get(`/api/users/customer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { id },
    });

    if (response.data.success) {
      const customer = response.data.customers;

      const foundCustomer = customer.find((cust) => cust._id === id);
      return foundCustomer;
    } else {
      console.error("Gagal memuat sampah");
    }
  } catch (error) {
    console.error("Failed to fetch user details", error);
    throw error;
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
  accountNumber,
  phoneNumber,
  address,
}) => {

  if (fullName.length === 0) {
    toast.error("Nama Lengkap kosong");
  }

  if (accountNumber.length === 0) {
    toast.error("Rekening kosong");
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
