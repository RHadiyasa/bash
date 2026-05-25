import React from "react";

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
    <Card className="w-full overflow-hidden">
      <CardHeader className="grid gap-3 border-b border-border/60 md:flex md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-black tracking-normal">
            10 Transaksi Terbaru
          </CardTitle>
          <CardDescription className="font-normal text-sm">
            Daftar transaksi terbaru
          </CardDescription>
        </div>
        <div>
          <Link href={"/transactions"}>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 md:gap-2 text-[8pt] md:text-xs"
            >
              Lihat Seluruh Transaksi
              <ArrowUpRight size={15} />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <ScrollArea className="h-96">
            <Table className="w-full text-[7pt] md:text-sm">
              <TableHeader className="sticky top-0 z-10 bg-card/80 backdrop-blur">
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
                      className="flex items-center gap-2 p-6 font-semibold text-muted-foreground"
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
                    <TableRow key={transaction._id} className="hover:bg-primary/5">
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {transaction.customer?.fullName || "Nasabah tidak tersedia"}
                      </TableCell>
                      <TableCell className="hidden md:flex items-center">
                        {transaction.transactionType === "deposit"
                          ? `${transaction.trashWeight} kg`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {formatRupiah(transaction.transactionAmount)}
                      </TableCell>
                      <TableCell>
                        <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                          {transaction.transactionType}
                        </span>
                      </TableCell>
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
