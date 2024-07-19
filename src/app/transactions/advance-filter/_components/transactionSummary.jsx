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
import formatNumber from "@/lib/helpers/formatNumber";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <Card className="bg-[#09090B]/30 mt-5">
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
        <div className="text-center font-semibold">List Nasabah</div>
        <div className="text-sm">{uniqueCustomers.join(", ")}</div>
        <Separator className="my-2" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sampah</TableHead>
              <TableHead>Berat (kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(totalWeightPerTrashType).map(
              ([trashName, weight]) => (
                <TableRow key={trashName}>
                  <TableCell>{trashName}</TableCell>
                  <TableCell>{formatNumber(weight)} kg</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionSummary;
