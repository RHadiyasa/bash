"use client"
import HeaderPage from "@/components/header/header";
import React from "react";
import TransactionsBreadcrum from "../advance-filter/_components/breadcrumb";
import useTransactions from "@/hooks/useTransactions";

const SearchTransactionPage = () => {
  const { transactionsData } = useTransactions();

  console.log(transactionsData);

  return (
    <div className="bg-earth bg-cover bg-fixed bg-center min-h-screen">
      <HeaderPage />
      <div className="pt-6 px-5 md:pt-10 md:px-10 lg:px-16 gap-4">
        <TransactionsBreadcrum page={"Search Transaction"} />
      </div>
    </div>
  );
};

export default SearchTransactionPage;
