"use client";
import HeaderPage from "@/components/header";
import React, { useEffect, useState } from "react";
import TransactionTable from "./_components/transactionTable";
import { getAllTransactions } from "@/modules/users/services/transaction.service";
import toast from "react-hot-toast";
import LoadingPage from "@/components/loadingPage";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Indicator from "./_components/indicator";

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

  if (!transactions) {
    return <LoadingPage message={"Loading data transaksi..."} />;
  }

  const onTriggerValue = (value) => {
    setValue(value);
  };

  const onActiveCustomerToggle = () => {
    setOnlyActiveCustomers(!onlyActiveCustomers);
  };

  const onSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const statusMatch =
      value === "all" || transaction.transactionStatus === value;
    const customerMatch =
      !onlyActiveCustomers ||
      (transaction.customer?.fullName &&
        transaction.customer?.fullName !== null);
    const searchMatch = transaction.customer?.fullName
      .toLowerCase()
      .includes(searchTerm?.toLowerCase());
    return statusMatch && customerMatch && searchMatch; // searchMath matiin feature show deleted customer, karena initial statenya tidak null.
  });

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
        <Indicator onSearchTermChange={onSearchTermChange} searchTerm={searchTerm}/>
        <div>
          <Tabs defaultValue={value} onValueChange={onTriggerValue}>
            <div className="grid md:flex justify-center items-center gap-3 md:justify-between">
              <div>
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
              <div className="flex items-center justify-center gap-1">
                <Label htmlFor="only-active-customer" className="text-[8pt] md:text-xs">
                  Hanya tampilkan nasabah aktif
                </Label>
                <Switch
                  id="only-active-customer"
                  checked={onlyActiveCustomers}
                  onCheckedChange={onActiveCustomerToggle}
                  className="scale-75 md:scale-90"
                />
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
