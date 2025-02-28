"use client";
import React, { useEffect, useState } from "react";
import TransactionTable from "./_components/transactionTable";
import { getAllTransactions } from "@/modules/services/transaction.service";
import toast from "react-hot-toast";
import LoadingPage from "@/components/loadingPage";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Indicator from "./_components/indicator";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  LucideFilter,
  Search,
  SettingsIcon,
  TerminalSquareIcon,
} from "lucide-react";
import HeaderPage from "@/components/header/header";
import { MdAddCircleOutline, MdReport } from "react-icons/md";
import Pagination from "./_components/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TransactionPage = () => {
  const router = useRouter();
  const [value, setValue] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await getAllTransactions({
        page: currentPage,
        limit: 10,
        searchTerm: searchClicked ? searchTerm : "",
        status: value,
      });

      if (response.success) {
        setTransactions(response.transactions);
        setTotalPages(response.totalPages);
      } else {
        toast.error(response.message || "Failed to fetch transactions");
      }
    } catch (error) {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [currentPage, value, searchClicked]);

  const onTriggerValue = (value) => {
    setValue(value);
    setCurrentPage(1); // Reset halaman ke 1
  };

  const onSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    // setCurrentPage(1); // Reset halaman ke 1
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    setSearchClicked(!searchClicked); // Toggle searchClicked to trigger useEffect
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

  const advanceFilterHandleClick = () => {
    setLoadingPage(true);
    router.push("/transactions/advance-filter");
  };

  const searchTransactionHandleClick = () => {
    setLoadingPage(true);
    router.push("/transactions/search-transaction");
  };

  const newTransactionHandleClick = () => {
    setLoadingPage(true);
    router.push("/transactions/new-transaction");
  };

  if (loadingPage) {
    return <LoadingPage message={"Loading data transaksi..."} />;
  }

  return (
    <div className="bg-earth bg-cover bg-fixed bg-center min-h-screen">
      <HeaderPage />
      <div className="pt-6 md:pt-10 px-0 md:px-10 lg:px-16 grid gap-4">
        <div className="grid justify-center text-center md:justify-start md:text-left gap-2">
          <div className="text-2xl font-bold">Transaksi Nasabah</div>
          <div className="text-sm">
            Seluruh transaksi nasabah pada Bank Sampah
          </div>
        </div>
        <div>
          {/* <Indicator
            onSearchTermChange={onSearchTermChange}
            searchTerm={searchTerm}
            loading={loadingPage}
            handleSearchClick={handleSearchClick}
          /> */}
        </div>
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
                  {!loadingPage ? (
                    <div>Deposit Baru</div>
                  ) : (
                    <Loader2 className="animate-spin w-16" size={18} />
                  )}
                  <MdAddCircleOutline size={"18"} />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="gap-2">
                      <div>Tools</div>
                      <SettingsIcon size={18} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="bottom"
                    className="bg-black/40 backdrop-blur-sm grid w-auto md:gap-1 border md:border-none"
                  >
                    <div className="grid gap-3 mt-3">
                      <Button
                        onClick={searchTransactionHandleClick}
                        className="flex items-center gap-2 h-9 lg:h-auto text-sm"
                      >
                        {!loadingPage ? (
                          <div>Cari Transaksi</div>
                        ) : (
                          <Loader2 className="animate-spin w-16" size={18} />
                        )}
                        <Search size={18} />
                      </Button>
                      <Button
                        onClick={advanceFilterHandleClick}
                        className="flex items-center gap-2 h-9 lg:h-auto text-sm"
                      >
                        {!loadingPage ? (
                          <div>Advance Filter</div>
                        ) : (
                          <Loader2 className="animate-spin w-16" size={18} />
                        )}
                        <MdReport size={18} />
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <TabsContent className="mt-5" value={value}>
              <TransactionTable
                transactionData={transactions}
                router={router}
                searchTerm={searchTerm}
                value={value}
                setTotalPages={setTotalPages}
                loading={loading}
              />
              <Pagination
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                currentPage={currentPage}
                totalPages={totalPages}
                setLoading={setLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
