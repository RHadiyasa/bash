import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import React from "react";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { join } from "path";
import { Separator } from "@/components/ui/separator";

const TransactionSummary = ({ transactions, loading }) => {
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

  return (
    <Card className="bg-[#09090B] mt-5">
      <CardHeader>
        <div className="text-lg font-semibold">Summary Transaksi</div>
        <CardDescription>Rangkuman summary berdasarkan filter</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">Total : {transactions.length} transaksi</div>
        <Separator className="my-2" />
        <div className="text-sm">
          Nilai Transaksi : {formatRupiah(totalTransactionAmount)}
        </div>
        <Separator className="my-2" />
        <div className="text-sm">Nasabah : {uniqueCustomers.join(", ")}</div>
        <Separator className="my-2" />
        <div className="text-sm">
          Sampah:
          <ul>
            {Object.entries(totalWeightPerTrashType).map(
              ([trashName, weight]) => (
                <li key={trashName}>
                  {trashName}: {weight} kg
                </li>
              )
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionSummary;
