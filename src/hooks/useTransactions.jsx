import { getTransactions } from "@/modules/services/transaction.service";
import { useEffect, useState } from "react";

const useTransactions = () => {
  const [transactionsData, setTransactionsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionData = await getTransactions();

        setTransactionsData(transactionData);
      } catch (error) {
        console.error("Failed to fetch transaction data", error);
      }
    };

    fetchData();
  }, []);

  return { transactionsData };
};

export default useTransactions;
