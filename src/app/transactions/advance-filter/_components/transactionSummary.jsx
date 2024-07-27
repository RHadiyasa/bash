import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import React, { useEffect } from "react";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { Separator } from "@/components/ui/separator";
import formatNumber from "@/lib/helpers/formatNumber";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TransactionSummary = ({
  transactions,
  setTotalWeightPerTrashType,
  setUniqueCustomers,
}) => {
  // Menghitung total transactionAmount
  const totalTransactionAmount = transactions.reduce((acc, transaction) => {
    return acc + (transaction.transactionAmount || 0);
  }, 0);

  // Hitung total berat setiap sampah
  const totalWeightPerTrashType = transactions.reduce((acc, transaction) => {
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

  // Mendapatkan nama nasabah unik
  const uniqueCustomers = [
    ...new Set(
      transactions.map((transaction) => transaction.customer?.fullName)
    ),
  ].filter(Boolean);

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
  }, [transactions, totalWeightPerTrashType, uniqueCustomers]);

  return (
    <Card className="bg-[#09090B]/30 h-full">
      <CardHeader>
        <div className="text-lg font-semibold">Summary Transaksi</div>
        <CardDescription>Rangkuman summary berdasarkan filter</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          Total Transaksi: {transactions.length} transaksi
        </div>
        <Separator className="my-2" />
        <div className="text-sm">
          Nilai Transaksi : {formatRupiah(totalTransactionAmount)}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionSummary;
