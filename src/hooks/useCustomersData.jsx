import { getAllCustomers } from "@/modules/users/services/customer.service";
import React, { useEffect, useState } from "react";

const useCustomersData = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await getAllCustomers();
        const formattedCustomers = customersData.map((customer) => ({
          value: customer._id,
          label: `${customer.fullName || "N/A"} - ${
            customer.accountNumber || "N/A"
          }`,
          rekening: customer.accountNumber,
          customerName: customer.fullName,
        }));
        setCustomers(formattedCustomers);
      } catch (error) {
        console.error("Failed to fetch customers data", error);
      }
    };

    fetchData();
  }, []);

  return { customers };
};

export default useCustomersData;
