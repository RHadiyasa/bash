"use client";
import HeaderPage from "@/components/header/header";
import React, { useEffect, useState } from "react";
import TransactionsBreadcrum from "../advance-filter/_components/breadcrumb";
import { Button } from "@/components/ui/button";
import useCustomersData from "@/hooks/useCustomersData";
import useTrashesData from "@/hooks/useTrashesData";
import useBankSampahData from "@/hooks/useBankSampahData";
import Summary from "./_components/Summary";
import TransactionForm from "./_components/TransactionForm";
import RafiHadiyasa from "@/components/copyright";
import toast from "react-hot-toast";
import { addTransaction } from "@/modules/users/services/transaction.service";
import { Loader2 } from "lucide-react";

const NewTransaction = () => {
  const { customers } = useCustomersData();
  const { trashes } = useTrashesData();
  const { bankSampahProfile } = useBankSampahData();
  const [initial, setInitial] = useState([]);
  const [submitButton, setSubmitButton] = useState(false);
  const [customerForms, setCustomerForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    totalWeight: 0,
    totalPrice: 0,
    totalTransactions: 0,
    customerTotals: {},
    trashTotals: {},
  });
  const [failedTransactions, setFailedTransactions] = useState([]);

  const handleSubmitTransaction = (totals, customerForms) => {
    setSubmitButton(true);
    setTotals(totals);
    setCustomerForms(customerForms);
  };

  // console.log(totals);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const saveTransaction = async (totals, customerForms) => {
    try {
      setLoading(true);
      const failedTransactionsTemp = [];

      for (const form of customerForms) {
        for (const trashForm of form.trashForms) {
          const transactionData = {
            customer: form.customer,
            bankSampah: form.bankSampah,
            trash: trashForm.trash,
            trashWeight: trashForm.weight,
            transactionAmount: trashForm.transactionAmount,
            transactionType: "deposit",
            transactionStatus: "pending",
          };

          let success = false;
          let attempts = 0;
          const maxAttempts = 3;

          while (!success && attempts < maxAttempts) {
            try {
              if (transactionData.transactionAmount <= 0) {
                toast.error("Transaksi tidak valid");
                return;
              }

              await addTransaction(transactionData);
              await delay(500);
              toast.success("Transaksi berhasil dibuat");
              success = true;
            } catch (error) {
              attempts++;
              if (attempts >= maxAttempts) {
                toast.error(
                  "Gagal menyimpan transaksi setelah beberapa kali mencoba"
                );
                failedTransactionsTemp.push(transactionData);
              } else {
                toast.error(`Percobaan ${attempts} gagal, mencoba lagi...`);
              }
              console.error(error);
            }
          }
        }
      }

      setFailedTransactions(failedTransactionsTemp);
      if (failedTransactionsTemp.length > 0) {
        toast.error(
          `Gagal menyimpan ${failedTransactionsTemp.length} transaksi`
        );
      }
    } catch (error) {
      toast.error("Gagal menyimpan transaksi");
      console.error(error);
    } finally {
      setLoading(false);
      if (failedTransactions.length === 0) {
        window.location.reload();
      }
    }
  };

  const retryFailedTransactions = async () => {
    try {
      setLoading(true);
      const stillFailedTransactions = [];

      for (const transactionData of failedTransactions) {
        let success = false;
        let attempts = 0;
        const maxAttempts = 3;

        while (!success && attempts < maxAttempts) {
          try {
            if (transactionData.transactionAmount <= 0) {
              toast.error("Transaksi tidak valid");
              return;
            }

            await addTransaction(transactionData);
            await delay(500);
            toast.success("Transaksi berhasil dibuat");
            success = true;
          } catch (error) {
            attempts++;
            if (attempts >= maxAttempts) {
              toast.error(
                "Gagal menyimpan transaksi setelah beberapa kali mencoba"
              );
              stillFailedTransactions.push(transactionData);
            } else {
              toast.error(`Percobaan ${attempts} gagal, mencoba lagi...`);
            }
            console.error(error);
          }
        }
      }

      setFailedTransactions(stillFailedTransactions);
      if (stillFailedTransactions.length > 0) {
        toast.error(
          `Masih gagal menyimpan ${stillFailedTransactions.length} transaksi`
        );
      } else {
        toast.success("Semua transaksi yang gagal berhasil diunggah ulang");
      }
    } catch (error) {
      toast.error("Gagal menyimpan transaksi");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
                onTotals={(totals) => setTotals(totals)}
                onSubmitTransaction={handleSubmitTransaction}
                saveTransaction={saveTransaction}
                loading={loading}
              />
            </div>

            {failedTransactions.length > 0 && (
              <div className="bg-red-200 text-red-800 rounded-lg p-5 mt-5">
                <h2 className="text-lg font-bold">Transaksi yang Gagal</h2>
                <ul className="list-disc list-inside">
                  {failedTransactions.map((transaction, index) => (
                    <li key={index}>
                      Customer: {transaction.customer}, Trash:{" "}
                      {transaction.trash}, Weight: {transaction.trashWeight},
                      Amount: {transaction.transactionAmount}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-3 bg-red-500 text-white"
                  onClick={retryFailedTransactions}
                >
                  Coba Unggah Ulang Transaksi yang Gagal
                </Button>
              </div>
            )}

            <div className="py-10 flex items-center justify-center">
              <RafiHadiyasa />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTransaction;
