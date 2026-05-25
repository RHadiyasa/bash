"use client";
import HeaderPage from "@/components/header/header";
import React, { useMemo, useState } from "react";
import TransactionsBreadcrum from "../advance-filter/_components/breadcrumb";
import useTransactions from "@/hooks/useTransactions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import formatRupiah from "@/lib/helpers/formatRupiah";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RafiHadiyasa from "@/components/copyright";

const SearchTransactionPage = () => {
  const { transactionsData } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return transactionsData || [];

    return (transactionsData || []).filter((transaction) =>
      [
        transaction.customer?.fullName,
        transaction.customer?.accountNumber,
        transaction.transactionType,
        transaction.transactionStatus,
        transaction.trash?.trashName,
        transaction.transactionAmount,
      ]
        .filter(Boolean)
        .some((item) => String(item).toLowerCase().includes(normalizedSearch))
    );
  }, [searchTerm, transactionsData]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
          <TransactionsBreadcrum page={"Search Transaction"} />
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <SearchIcon size={14} />
                Pencarian
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Cari Transaksi
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Cari transaksi berdasarkan nasabah, rekening, status, jenis
                transaksi, sampah, atau nominal.
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

        <Card className="glass-card overflow-hidden rounded-lg">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 border-b border-border/60 bg-background/35 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm font-extrabold">Hasil Pencarian</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Menampilkan {filteredTransactions.length} dari{" "}
                  {(transactionsData || []).length} transaksi
                </p>
              </div>
              <div className="relative w-full lg:w-96">
                <SearchIcon
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari transaksi"
                  className="glass-input h-10 w-full rounded-md pl-9 pr-10"
                />
                {searchTerm ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setSearchTerm("")}
                    aria-label="Bersihkan pencarian"
                  >
                    <XIcon size={15} />
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="p-4">
              <Table className="min-w-[860px] text-xs lg:text-sm">
                <TableHeader>
                  <TableRow className="border-y bg-muted/35 hover:bg-muted/35">
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Nasabah</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Sampah</TableHead>
                    <TableHead>Nominal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction._id} className="hover:bg-primary/5">
                        <TableCell className="text-muted-foreground">
                          {formatDateToIndonesian(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="grid gap-1">
                            <span className="font-bold">
                              {transaction.customer?.fullName || "Deleted"}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {transaction.customer?.accountNumber || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="rounded-md border-primary/20 bg-primary/10 px-2 py-1 text-xs font-bold text-primary"
                          >
                            {transaction.transactionType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.transactionType === "deposit"
                            ? transaction.trash?.trashName || "-"
                            : "Tarik Tunai"}
                        </TableCell>
                        <TableCell className="font-extrabold">
                          {formatRupiah(transaction.transactionAmount)}
                        </TableCell>
                        <TableCell>{transaction.transactionStatus}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center text-sm font-bold">
                          Tidak ada transaksi
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <RafiHadiyasa />
      </main>
    </div>
  );
};

export default SearchTransactionPage;
