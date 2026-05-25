import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useMemo } from "react";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SummaryDetail from "./summaryDetail";
import formatNumber from "@/lib/helpers/formatNumber";

const TransactionSummary = ({
  transactionsData,
  setTotalWeightPerTrashType,
  setUniqueCustomers,
  setUniqueStatus,
  setUniqueType,
  statusFilter,
  typeFilter,
}) => {
  const filteredTransactions = useMemo(() => {
    return transactionsData.filter((transaction) => {
      const matchesStatus =
        statusFilter === null || statusFilter !== "all"
          ? transaction.transactionStatus === statusFilter
          : true;
      const matchesType =
        typeFilter === null || typeFilter !== "all"
          ? transaction.transactionType === typeFilter
          : true;
      const matchCustomer = transaction.customer ? transaction.customer : false;
      return matchesStatus && matchesType && matchCustomer;
    });
  }, [transactionsData, statusFilter, typeFilter]);

  // Menghitung total transactionAmount
  const totalTransactionAmount = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      return acc + (transaction.transactionAmount || 0);
    }, 0);
  }, [filteredTransactions]);

  // Menghitung total transactionWeight
  const totalTransactioWeight = useMemo(() => {
    return filteredTransactions.reduce((acc, weight) => {
      return acc + (weight.trashWeight || 0);
    }, 0);
  }, [filteredTransactions]);

  // Hitung total berat setiap sampah
  const totalWeightPerTrashType = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      const trashName = transaction.trash?.trashName;
      const trashWeight = transaction.trashWeight || 0;
      if (trashName) {
        if (!acc[trashName]) {
          acc[trashName] = 0;
        }
        acc[trashName] += trashWeight;
      }
      return acc;
    }, {});
  }, [filteredTransactions]);

  // Hitung total nilai transaksi setiap sampah
  const totalAmountPerTrashType = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      const trashName = transaction.trash?.trashName;
      const transactionAmount = transaction.transactionAmount || 0;
      if (trashName) {
        if (!acc[trashName]) {
          acc[trashName] = 0;
        }
        acc[trashName] += transactionAmount;
      }
      return acc;
    }, {});
  }, [filteredTransactions]);

  // Mendapatkan nama nasabah unik
  const uniqueCustomers = useMemo(() => {
    return [
      ...new Set(
        filteredTransactions.map(
          (transaction) => transaction.customer?.fullName
        )
      ),
    ].filter(Boolean);
  }, [filteredTransactions]);

  const uniqueStatus = useMemo(() => {
    return [
      ...new Set(
        filteredTransactions.map((transaction) => transaction.transactionStatus)
      ),
    ].filter(Boolean);
  }, [filteredTransactions]);

  const uniqueType = useMemo(() => {
    return [
      ...new Set(
        filteredTransactions.map((transaction) => transaction.transactionType)
      ),
    ].filter(Boolean);
  }, [filteredTransactions]);

  useEffect(() => {
    setTotalWeightPerTrashType((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(totalWeightPerTrashType)) {
        return totalWeightPerTrashType;
      }
      return prev;
    });
    setUniqueCustomers((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(uniqueCustomers)) {
        return uniqueCustomers;
      }
      return prev;
    });
    setUniqueStatus((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(uniqueStatus)) {
        return uniqueStatus;
      }
      return prev;
    });
    setUniqueType((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(uniqueType)) {
        return uniqueType;
      }
      return prev;
    });
  }, [
    setTotalWeightPerTrashType,
    setUniqueCustomers,
    setUniqueStatus,
    setUniqueType,
    totalWeightPerTrashType,
    uniqueCustomers,
    uniqueStatus,
    uniqueType,
  ]);

  return (
    <Card className="glass-card flex h-full flex-col justify-center rounded-lg">
      <CardHeader className="border-b border-border/60">
        <CardTitle className="text-center text-2xl font-extrabold">
          Summary Transaksi
        </CardTitle>
        <CardDescription className="text-xs text-center">
          Rangkuman summary berdasarkan filter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-background/45 p-4 text-center">
            <div className="text-2xl font-extrabold">
              {filteredTransactions?.length}
            </div>
            <div className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Total Transaksi</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/45 p-4 text-center">
            <div className="text-2xl font-extrabold">
              {formatRupiah(totalTransactionAmount)}
            </div>
            <div className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Nilai Transaksi</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/45 p-4 text-center">
            <div className="text-2xl font-extrabold">
              {formatNumber(totalTransactioWeight)} Kg
            </div>
            <div className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Berat Sampah</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center py-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="px-10 font-bold"
            >
              Summary Lengkap
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card !w-[min(94vw,900px)] rounded-lg text-center">
            <DialogTitle className="grid gap-2 text-2xl font-extrabold">
              Summary Transaksi
              <DialogDescription>Deskripsi Transaksi</DialogDescription>
            </DialogTitle>
            <div>
              <SummaryDetail
                uniqueCustomers={uniqueCustomers}
                totalWeightPerTrashType={totalWeightPerTrashType}
                totalAmountPerTrashType={totalAmountPerTrashType}
                uniqueStatus={uniqueStatus}
                uniqueType={uniqueType}
                totalAmount={totalTransactionAmount}
                totalWeight={totalTransactioWeight}
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default TransactionSummary;
