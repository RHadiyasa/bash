"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/datePicker";
import { getTransactionInRange } from "@/modules/users/services/transaction.service";
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

const TransactionDetails = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: startOfToday(),
    endDate: null,
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchTransactions = async () => {
    const { startDate, endDate } = dateRange;
    setLoading(true);

    if (!startDate) {
      toast.error("Pilih tanggal");
      return;
    }

    const finalEndDate = endDate
      ? endOfDay(new Date(endDate))
      : endOfDay(new Date(startDate));

    try {
      const response = await getTransactionInRange(
        startDate.toISOString(),
        finalEndDate.toISOString()
      );

      if (response) {
        setTransactions(response);
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (range) => {
    setDateRange({
      startDate: range.from,
      endDate: range.to,
    });
  };

  const handleSearchClick = () => {
    fetchTransactions();
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus = statusFilter
      ? transaction.transactionStatus === statusFilter
      : true;
    const matchesType = typeFilter
      ? transaction.transactionType === typeFilter
      : true;
    return matchesStatus && matchesType;
  });

  return (
    <div className="bg-custom-pattern bg-cover bg-center min-h-screen">
      <HeaderPage />
      <div className="pt-6 px-5 md:pt-10 md:px-10 lg:px-16 gap-4">
        <TransactionsBreadcrum page={"Advance Filter"} />
        <div className="text-2xl lg:text-3xl font-bold mt-5">
          Advance Filter
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-5">
          <div className="w-full">
            <Card className="bg-[#09090B]/30 mt-5">
              <CardHeader>
                <div className="text-lg font-semibold">
                  Filter Transaksi Nasabah
                </div>
                <CardDescription>
                  Filter transaksi nasabah sesuai kebutuhan pelaporan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5">
                  <div className="grid grid-cols-2 gap-5">
                    <SelectStatus onChange={setStatusFilter} />
                    <SelectType onChange={setTypeFilter} />
                  </div>
                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <Title title={"Pilih tanggal transaksi"} />
                      <DatePickerWithRange onChange={handleDateChange} />
                    </div>
                    <Button
                      className="w-full items-center justify-center font-semibold"
                      onClick={handleSearchClick}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <div>Search</div>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full">
            <TransactionSummary
              transactions={filteredTransactions}
              loading={loading}
            />
          </div>
        </div>
        <div>
          <FilteredTransactions transactions={filteredTransactions} />
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
