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
import RafiHadiyasa from "@/components/copyright";
import toast from "react-hot-toast";
import { addTransaction } from "@/modules/users/services/transaction.service";
import { Loader2 } from "lucide-react";

const NewTransaction = () => {
  const { customers } = useCustomersData();
  const { trashes } = useTrashesData();
  const { bankSampahProfile } = useBankSampahData();
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

  const handleSubmitTransaction = (totals, customerForms) => {
    setSubmitButton(true);
    setTotals(totals);
    setCustomerForms(customerForms);
  };

  // console.log(totals);

  const saveTransaction = async () => {
    try {
      setLoading(true);
      for (const form of customerForms) {
        // Iterasi melalui customerForms
        for (const trashForm of form.trashForms) {
          const transactionData = {
            customer: form.customer,
            bankSampah: form.bankSampah,
            trash: trashForm.trash,
            trashWeight: trashForm.weight,
            transactionAmount: trashForm.transactionAmount,
            transactionType: "deposit", // Asumsikan ini selalu deposit; modifikasi jika diperlukan
            trasnscationStatus: "pending",
          };

          console.log(transactionData);

          try {
            if (transactionData.transactionAmount <= 0) {
              toast.error("Transaksi tidak valid");
              return;
            }

            await addTransaction(transactionData);
            toast.success("Transaksi berhasil dibuat");
          } catch (error) {
            toast.error(error.message);
          }
        }
      }
    } catch (error) {
      toast.error("Gagal menyimpan transaksi");
      console.error(error);
    } finally {
      setLoading(false);
      window.location.reload();
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
              />
            </div>
            {submitButton ? (
              <div className="bg-[#09090B] rounded-xl p-5 lg:p-10 mt-10">
                <Summary totals={totals} />
                <div className="mt-10">
                  <Button
                    onClick={saveTransaction}
                    className="w-full hover:bg-white/40 hover:text-white hover:scale-[98%] hover:animate-in"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <div>Submit Transaction</div>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              ""
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
