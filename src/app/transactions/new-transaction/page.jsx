"use client";
import HeaderPage from "@/components/header/header";
import React, { useState } from "react";
import TransactionsBreadcrum from "../advance-filter/_components/breadcrumb";
import { Button } from "@/components/ui/button";
import useCustomersData from "@/hooks/useCustomersData";
import useTrashesData from "@/hooks/useTrashesData";
import useBankSampahData from "@/hooks/useBankSampahData";
import Summary from "./_components/Summary";
import TransactionForm from "./_components/TransactionForm";

const NewTransaction = () => {
  const { customers } = useCustomersData();
  const { trashes } = useTrashesData();
  const { bankSampahProfile } = useBankSampahData();
  const [submitButton, setSubmitButton] = useState(false);
  const [totals, setTotals] = useState({
    totalWeight: 0,
    totalPrice: 0,
    totalTransactions: 0,
    customerTotals: {},
    trashTotals: {},
  });

  const handleSubmitTransaction = (totals) => {
    setSubmitButton(true);
    setTotals(totals);
  };

  return (
    <div className="bg-[#151518] min-h-screen">
      <HeaderPage />
      <div className="pt-6 px-0 md:pt-10 md:px-10 lg:px-16 gap-4">
        <TransactionsBreadcrum page={"Transaksi Baru"} />
        <div className="text-xl lg:text-3xl text-center sm:text-left font-bold mt-10">
          Tambah Transaksi Deposit Baru
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-5">
          <div className="grid gap-5 w-full">
            <div className="bg-[#09090B] rounded-xl md:mt-10 p-5 grid gap-2 lg:p-10 scale-90 md:scale-100">
              <div className="text-2xl lg:text-2xl font-bold text-center">
                Formulir Deposit
              </div>
              <TransactionForm
                bankSampahProfile={bankSampahProfile}
                customers={customers}
                trashes={trashes}
                onTotals={setTotals}
                onSubmitTransaction={handleSubmitTransaction}
              />
            </div>
            {submitButton ? (
              <div className="bg-[#09090B] rounded-xl p-5 lg:p-10 mt-10">
                <Summary totals={totals} />
                <div className="mt-5">
                  <Button className="w-full">Submit Transaction</Button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTransaction;
