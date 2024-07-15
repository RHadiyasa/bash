"use client";
import React, { useEffect, useState } from "react";
import TransactionTable from "./_components/transactionTable";
import { getAllTransactions } from "@/modules/users/services/transaction.service";
import toast from "react-hot-toast";
import LoadingPage from "@/components/loadingPage";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Indicator from "./_components/indicator";
import { Button } from "@/components/ui/button";
import { Loader2, LucideFilter } from "lucide-react";
import HeaderPage from "@/components/header/header";
import { MdAddCircleOutline } from "react-icons/md";

const TransactionPage = () => {
  const router = useRouter();
  const [value, setValue] = useState("all");
  const [onlyActiveCustomers, setOnlyActiveCustomers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllTransaction = async () => {
    try {
      setLoading(true);
      const getCustomerTransactions = await getAllTransactions();

      if (!getCustomerTransactions) {
        toast.error("Tidak ada transaksi");
        return;
      }
      setTransactions(getCustomerTransactions);
    } catch (error) {
      toast.error("Gagal mengambil transaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransaction();
  }, [value]);

  if (!transactions || loading) {
    return <LoadingPage message={"Loading data transaksi..."} />;
  }

  const onTriggerValue = (value) => {
    setValue(value);
  };

  const onSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const statusMatch =
      value === "all" || transaction.transactionStatus === value;
    const customerMatch =
      !onlyActiveCustomers || transaction.customer?.fullName !== null;
    const searchMatch = transaction.customer?.fullName
      ?.toLowerCase()
      .includes(searchTerm?.toLowerCase());

    return statusMatch && customerMatch && searchMatch;
  });

  const advanceFilterHandleClick = () => {
    setLoading(true);
    router.push("/transactions/advance-filter");
  };

  const newTransactionHandleClick = () => {
    setLoading(true);
    router.push("/transactions/new-transaction");
  };

  return (
    <div className="bg-[#151518] min-h-screen">
      <HeaderPage />
      <div className="pt-6 md:pt-10 px-0 md:px-10 lg:px-16 grid gap-4">
        <div className="grid justify-center text-center md:justify-start md:text-left gap-2">
          <div className="text-2xl font-bold">Transaksi Nasabah</div>
          <div className="text-sm">
            Seluruh transaksi nasabah pada Bank Sampah
          </div>
        </div>
        <Indicator
          onSearchTermChange={onSearchTermChange}
          searchTerm={searchTerm}
        />
        <div>
          <Tabs defaultValue={value} onValueChange={onTriggerValue}>
            <div className="grid lg:flex justify-center items-center gap-5 md:justify-between">
              <div className="flex items-center justify-center">
                <TabsList className="bg-[#151518] border items-center">
                  <TabsTrigger
                    onClick={() => onTriggerValue("all")}
                    className="text-[9pt] md:text-sm md:w-24"
                    value="all"
                  >
                    Semua
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => onTriggerValue("pending")}
                    className="text-[9pt] md:text-sm md:w-24"
                    value="pending"
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => onTriggerValue("completed")}
                    className="text-[9pt] md:text-sm md:w-24"
                    value="completed"
                  >
                    Selesai
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => onTriggerValue("failed")}
                    className="text-[9pt] md:text-sm md:w-24"
                    value="failed"
                  >
                    Gagal
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={newTransactionHandleClick}
                  className="flex items-center gap-2 h-9 lg:h-auto text-sm"
                >
                  {!loading ? (
                    <div>Deposit Baru</div>
                  ) : (
                    <Loader2 className="animate-spin w-16" size={18} />
                  )}
                  <MdAddCircleOutline size={"18"} />
                </Button>
                <Button
                  onClick={advanceFilterHandleClick}
                  className="flex items-center gap-2 h-9 lg:h-auto text-sm"
                >
                  {!loading ? (
                    <div>Advance Filter</div>
                  ) : (
                    <Loader2 className="animate-spin w-16" size={18} />
                  )}
                  <LucideFilter size={18} />
                </Button>
              </div>
            </div>

            <TabsContent className="mt-5" value={value}>
              <TransactionTable
                transactionData={filteredTransactions}
                router={router}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
