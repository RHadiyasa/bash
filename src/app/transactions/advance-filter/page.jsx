"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/datePicker";
import {
  getTransactionByDate,
  getTransactionInRange,
} from "@/modules/services/transaction.service";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { endOfDay, startOfToday } from "date-fns";
import FilteredTransactions from "./_components/filteredTransactions";
import { Loader2 } from "lucide-react";
import HeaderPage from "@/components/header/header";
import TransactionsBreadcrum from "./_components/breadcrumb";
import SelectStatus from "./_components/selecStatus";
import SelectType from "./_components/selectType";
import Title from "./_components/title";
import TransactionSummary from "./_components/transactionSummary";
import Pagination from "../_components/pagination";
import RafiHadiyasa from "@/components/copyright";
import useTransactions from "@/hooks/useTransactions";
import { ArrowLeftIcon, FilterIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

const TransactionDetails = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionsByDate, setTransactionsByDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: startOfToday(),
    endDate: null,
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [uniqueType, setUniqueType] = useState([]);
  const [uniqueStatus, setUniqueStatus] = useState([]);
  const [uniqueCustomers, setUniqueCustomers] = useState([]);
  const [totalWeightPerTrashType, setTotalWeightPerTrashType] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = useCallback(async () => {
    const { startDate, endDate } = dateRange;
    setLoading(true);

    if (!startDate) {
      toast.error("Pilih tanggal");
      setLoading(false);
      return;
    }

    const finalEndDate = endDate
      ? endOfDay(new Date(endDate))
      : endOfDay(new Date(startDate));

    try {
      const response = await getTransactionInRange({
        startDate: startDate.toISOString(),
        endDate: finalEndDate.toISOString(),
        page: currentPage,
        limit: 5,
        status: statusFilter,
        type: typeFilter,
      });

      if (response) {
        const transactionByDate = await getTransactionByDate({
          startDate: startDate.toISOString(),
          endDate: finalEndDate.toISOString(),
        });

        if (transactionByDate) {
          setTransactionsByDate(transactionByDate);
        }

        setTransactions(response.transactions);
        setTotalPages(response.totalPages);
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, dateRange, statusFilter, typeFilter]);

  const handleStatusChange = (value) => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
    setStatusFilter(value);
  };

  const handleTypeChange = (value) => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
    setTypeFilter(value);
  };

  const handleDateChange = (range) => {
    setDateRange({
      startDate: range.from,
      endDate: range.to,
    });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setLoading(true);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setLoading(true);
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearchClick = () => {
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
          <TransactionsBreadcrum page={"Advance Filter"} />
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <FilterIcon size={14} />
                Filter Laporan
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Advance Filter
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Susun laporan transaksi berdasarkan tanggal, status, dan jenis
                transaksi.
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

        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <Card className="glass-card h-full rounded-lg">
              <CardHeader className="border-b border-border/60">
                <div className="text-lg font-extrabold">
                  Filter Transaksi Nasabah
                </div>
                <CardDescription>
                  Filter transaksi nasabah sesuai kebutuhan pelaporan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <SelectStatus onChange={handleStatusChange} />
                    <SelectType onChange={handleTypeChange} />
                  </div>
                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <Title title={"Pilih tanggal transaksi"} />
                      <DatePickerWithRange onChange={handleDateChange} />
                    </div>
                    <Button
                      className="h-10 w-full items-center justify-center gap-2 font-bold"
                      onClick={handleSearchClick}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <SearchIcon size={16} />
                      )}
                      <span>Search</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full">
            <TransactionSummary
              setUniqueStatus={setUniqueStatus}
              setUniqueType={setUniqueType}
              transactionsData={transactionsByDate}
              statusFilter={statusFilter}
              typeFilter={typeFilter}
              setTotalWeightPerTrashType={setTotalWeightPerTrashType}
              setUniqueCustomers={setUniqueCustomers}
            />
          </div>
        </div>
        <div className="glass-card rounded-lg p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
          />
          <FilteredTransactions transactions={transactions} />
        </div>
        <div className="pb-32">
          <RafiHadiyasa />
        </div>
      </main>
    </div>
  );
};

export default TransactionDetails;
