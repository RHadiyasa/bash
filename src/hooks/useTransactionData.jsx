import { getAllTransactions } from "@/modules/users/services/transaction.service";
import React, { useEffect, useState } from "react";

const useTransactionData = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionData = await getAllTransactions();

        setTransactions(transactionData);
      } catch (error) {
        console.error("Failed to fetch transaction data", error);
      }
    };

    fetchData();
  }, []);

  return { transactions };
};

export default useTransactionData;
