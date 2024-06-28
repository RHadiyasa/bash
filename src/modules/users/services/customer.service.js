import axios from "axios";
import toast from "react-hot-toast";

export const getUserDetailCustomer = async () => {
  try {
    const response = await axios.get("/api/users/bash", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ini penting untuk mengirim cookies
    });

    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch user details", error);
    throw error;
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

export const getCustomers = async () => {
  try {
    const response = await axios.get("/api/users/customer");

    return response.data.customers;
  } catch (error) {
    toast.error("Error fetching customers: ", error);
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
  username,
  fullName,
  accountNumber,
  phoneNumber,
  address,
}) => {
  if (username.includes(" ") || username.trim().length === 0) {
    toast.error(
      "Username tidak boleh kosong, dan tidak boleh mengandung spasi"
    );
  }

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
    toast.error("Askot mana?")
  }

  if (!address.postalCode.length) {
    toast.error("Kode pos? aku mau kirim paket")
  }

  if (!address.province.length) {
    toast.error("Provinsi kosong")
  }
};
