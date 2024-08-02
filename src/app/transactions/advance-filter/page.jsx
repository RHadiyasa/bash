"use client";
import React, { useEffect, useState } from "react";
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

  const fetchTransactions = async () => {
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
  };

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
  }, [currentPage, statusFilter, typeFilter]);

  return (
    <div className="bg-earth bg-cover bg-fixed bg-center min-h-screen">
      <HeaderPage />
      <div className="pt-6 px-5 md:pt-10 md:px-10 lg:px-16 gap-4">
        <TransactionsBreadcrum page={"Advance Filter"} />
        <div className="text-2xl lg:text-3xl font-bold mt-5">
          Advance Filter
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-5 mt-5">
          <div className="lg:w-2/3">
            <Card className="bg-[#09090B]/30 h-full">
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
                    <SelectStatus onChange={handleStatusChange} />
                    <SelectType onChange={handleTypeChange} />
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
            {
              <TransactionSummary
                setUniqueStatus={setUniqueStatus}
                setUniqueType={setUniqueType}
                transactionsData={transactionsByDate}
                statusFilter={statusFilter}
                typeFilter={typeFilter}
                setTotalWeightPerTrashType={setTotalWeightPerTrashType}
                setUniqueCustomers={setUniqueCustomers}
              />
            }
          </div>
        </div>
        <div>
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
      </div>
    </div>
  );
};

export default TransactionDetails;
