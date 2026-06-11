"use client";
import HeaderPage from "@/components/header/header";
import React, { useState } from "react";
import TransactionsBreadcrum from "../advance-filter/_components/breadcrumb";
import { Button } from "@/components/ui/button";
import useCustomersData from "@/hooks/useCustomersData";
import useTrashesData from "@/hooks/useTrashesData";
import useBankSampahData from "@/hooks/useBankSampahData";
import TransactionForm from "./_components/TransactionForm";
import RafiHadiyasa from "@/components/copyright";
import toast from "react-hot-toast";
import { addTransactionsBatch } from "@/modules/services/transaction.service";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { ArrowLeftIcon, ClipboardListIcon, RotateCcwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NewTransaction = () => {
  const router = useRouter();
  const { customers } = useCustomersData();
  const { trashes } = useTrashesData();
  const { bankSampahProfile } = useBankSampahData();
  const [loading, setLoading] = useState(false);
  const [failedTransactions, setFailedTransactions] = useState([]);
  const [successfulTrashFormIds] = useState(new Set());

  const handleSubmitTransaction = () => {};

  const buildTransactionPayload = (forms, batchId) =>
    forms.flatMap((form, formIndex) =>
      form.trashForms.map((trashForm, trashIndex) => ({
        customer: form.customer,
        customerName: form.customerName,
        bankSampah: form.bankSampah,
        trash: trashForm.trash,
        trashName: trashForm.trashName,
        trashWeight: Number(trashForm.weight),
        transactionAmount: trashForm.transactionAmount,
        transactionType: "deposit",
        transactionStatus: "pending",
        clientRequestId: `${batchId}-${form.customer}-${trashForm.trash}-${formIndex}-${trashIndex}`,
      }))
    );

  const saveTransaction = async (_totals, customerForms) => {
    void _totals;
    const batchId = `deposit-${Date.now()}`;
    const transactionsPayload = buildTransactionPayload(customerForms, batchId);

    try {
      setLoading(true);

      const invalidTransaction = transactionsPayload.find(
        (transaction) =>
          !transaction.customer ||
          !transaction.trash ||
          !transaction.trashWeight ||
          transaction.trashWeight <= 0
      );

      if (invalidTransaction) {
        toast.error("Ada data deposit yang belum lengkap");
        return;
      }

      const result = await addTransactionsBatch({
        batchId,
        transactions: transactionsPayload,
      });

      toast.success(
        `${result.createdCount || transactionsPayload.length} transaksi deposit berhasil disimpan`
      );
      setFailedTransactions([]);
      router.push("/transactions");
    } catch (error) {
      setFailedTransactions(transactionsPayload);
      toast.error(error.message || "Gagal menyimpan batch transaksi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const retryFailedTransactions = async () => {
    const batchId = `retry-deposit-${Date.now()}`;

    try {
      setLoading(true);

      const retryPayload = failedTransactions.map((transaction, index) => ({
        ...transaction,
        clientRequestId:
          transaction.clientRequestId ||
          `${batchId}-${transaction.customer}-${transaction.trash}-${index}`,
      }));

      const result = await addTransactionsBatch({
        batchId,
        transactions: retryPayload,
      });

      toast.success(
        `${result.createdCount || retryPayload.length} transaksi berhasil disimpan`
      );
      setFailedTransactions([]);
      router.push("/transactions");
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan transaksi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
          <TransactionsBreadcrum page={"Transaksi Baru"} />
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <ClipboardListIcon size={14} />
                Deposit Baru
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Tambah Transaksi Deposit
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Input beberapa nasabah dan beberapa jenis sampah dalam satu
                batch transaksi.
              </p>
            </div>
            <Link href="/transactions">
              <Button
                variant="outline"
                className="h-10 gap-2 border-border/70 bg-background/60 font-bold"
              >
                <ArrowLeftIcon size={16} />
                Kembali
              </Button>
            </Link>
          </div>
        </section>

        <div className="grid gap-5">
          <div className="glass-card grid gap-5 rounded-lg p-5 lg:p-6">
              <div>
                <div className="text-xl font-extrabold">
                Formulir Deposit
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pilih nasabah, material, berat, lalu submit transaksi.
                </p>
              </div>
              <TransactionForm
                bankSampahProfile={bankSampahProfile}
                customers={customers}
                trashes={trashes}
                onTotals={() => {}}
                onSubmitTransaction={handleSubmitTransaction}
                saveTransaction={saveTransaction}
                loading={loading}
                successfulTrashFormIds={successfulTrashFormIds}
              />
            </div>
            {failedTransactions.length > 0 && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-5 text-red-700 dark:text-red-200">
                <h2 className="text-lg font-extrabold">Transaksi yang Gagal</h2>
                <ul className="mt-3 list-disc list-inside text-sm">
                  {failedTransactions.map((transaction, index) => (
                    <li key={index}>
                      Nama Nasabah:{" "}
                      <span className="font-semibold underline">
                        {transaction.customerName}
                      </span>
                      , Sampah:{" "}
                      <span className="font-semibold underline">
                        {transaction.trashName}
                      </span>
                      , Berat:{" "}
                      <span className="font-semibold underline">
                        {transaction.trashWeight}
                      </span>
                      , Nilai Transaksi:{" "}
                      <span className="font-semibold underline">
                        {formatRupiah(transaction.transactionAmount)}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-4 gap-2 font-bold"
                  variant="destructive"
                  onClick={retryFailedTransactions}
                >
                  <RotateCcwIcon size={16} />
                  Coba Unggah Ulang Transaksi yang Gagal
                </Button>
              </div>
            )}
            <div className="py-10 flex items-center justify-center">
              <RafiHadiyasa />
            </div>
        </div>
      </main>
    </div>
  );
};

export default NewTransaction;
