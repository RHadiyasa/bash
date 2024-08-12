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
  }, [totalWeightPerTrashType, uniqueCustomers, uniqueStatus, uniqueType]);

  return (
    <Card className="bg-[#09090B]/30 h-full flex flex-col justify-center">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Summary Transaksi
        </CardTitle>
        <CardDescription className="text-xs text-center">
          Rangkuman summary berdasarkan filter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:flex gap-10 items-center justify-evenly">
          <div className="grid gap-2">
            <div className="font-bold text-3xl text-center">
              {filteredTransactions?.length}
            </div>
            <div className="text-sm font-bold text-center">Total Transaksi</div>
          </div>
          <div className="grid gap-2">
            <div className="font-bold text-3xl text-center">
              {formatRupiah(totalTransactionAmount)}
            </div>
            <div className="text-sm font-bold text-center">Nilai Transaksi</div>
          </div>
          <div className="grid gap-2">
            <div className="font-bold text-3xl text-center">
              {formatNumber(totalTransactioWeight)} Kg
            </div>
            <div className="text-sm font-bold text-center">Berat Sampah</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center py-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="px-20 bg-black/10 hover:bg-black/50 hover:scale-105 text-white border"
            >
              Summary Lengkap
            </Button>
          </DialogTrigger>
          <DialogContent className="text-center bg-black/10 backdrop-blur-md px-16">
            <DialogTitle className="grid gap-2 text-3xl">
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
