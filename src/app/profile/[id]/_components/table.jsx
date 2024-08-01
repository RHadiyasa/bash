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
import { ScrollArea } from "@/components/ui/scroll-area";

const TableTransaksi = ({ transactionData, isLoading }) => {
  // Filter transaksi yang customernya masih ada
  const validTransactions = transactionData?.filter(
    (transaction) =>
      (transaction.customer && transaction.transactionStatus === "completed") ||
      transaction.transactionStatus === "pending"
  );

  // Urutkan transaksi berdasarkan createdAt, dari yang terbaru
  const sortedTransactions = validTransactions?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Ambil 10 transaksi terbaru
  const recentTransactions = sortedTransactions?.slice(0, 10);

  return (
    <Card className="bg-black/30 backdrop-blur-sm w-full lg:w-3/4">
      <CardHeader className="grid md:flex flex-row justify-between gap-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-bold">10 Transaksi Terbaru</CardTitle>
          <CardDescription className="font-normal text-sm">
            Daftar transaksi terbaru
          </CardDescription>
        </div>
        <div>
          <Link href={"/transactions"}>
            <Button size="sm" className="gap-1 md:gap-2 text-[8pt] md:text-xs">
              Liat Seluruh Transaksi
              <ArrowUpRight size={15} />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ScrollArea className="h-96">
            <Table className="text-[7pt] md:text-sm w-full">
              <TableHeader className="sticky top-0 z-10">
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
                ) : recentTransactions?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center font-semibold"
                    >
                      Tidak ada data transaksi
                    </TableCell>
                  </TableRow>
                ) : (
                  recentTransactions?.map((transaction) => (
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
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableTransaksi;
