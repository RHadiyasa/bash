import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ArrowUpRight, Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import formatRupiah from "@/lib/helpers/formatRupiah";

const TableTransaksi = ({ transactionData, isLoading }) => {
  // Filter transaksi yang customernya masih ada
  const validTransactions = transactionData.filter(
    (transaction) => transaction.customer
  );

  // Urutkan transaksi berdasarkan createdAt, dari yang terbaru
  const sortedTransactions = validTransactions.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Ambil 10 transaksi terbaru
  const recentTransactions = sortedTransactions.slice(0, 10);

  return (
    <Card className="bg-[#09090B]">
      <CardHeader className="grid md:flex flex-row justify-between gap-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-bold">Transaksi</CardTitle>
          <CardDescription className="font-normal text-sm">
            Daftar transaksi terbaru
          </CardDescription>
        </div>
        <div>
          <Link href={"/transactions"}>
            <Button className="gap-1 md:gap-2 text-[8pt] md:text-sm">
              Liat Seluruh Transaksi
              <ArrowUpRight size={15} />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table className="text-[7pt] md:text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Tanggal</TableHead>
              <TableHead className="font-bold">Nama</TableHead>
              <TableHead className="font-bold hidden md:flex items-center">
                Berat (kg)
              </TableHead>
              <TableHead className="font-bold">Nilai Transaksi</TableHead>
              <TableHead className="font-bold">Jenis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="flex items-center gap-2 font-semibold"
                >
                  <Loader2 className="animate-spin" /> Loading data...
                </TableCell>
              </TableRow>
            ) : recentTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center font-semibold">
                  Tidak ada data transaksi
                </TableCell>
              </TableRow>
            ) : (
              recentTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.customer.fullName}</TableCell>
                  <TableCell className="hidden md:flex items-center">
                    {transaction.transactionType === "deposit"
                      ? `${transaction.trashWeight} kg`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {formatRupiah(transaction.transactionAmount)}
                  </TableCell>
                  <TableCell>{transaction.transactionType}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TableTransaksi;
