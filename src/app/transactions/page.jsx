"use client";
import React, { useCallback, useEffect, useState } from "react";
import TransactionTable from "./_components/transactionTable";
import { getAllTransactions } from "@/modules/services/transaction.service";
import toast from "react-hot-toast";
import LoadingPage from "@/components/loadingPage";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowDownUpIcon,
  ChevronDownIcon,
  Clock3Icon,
  HandCoinsIcon,
  ListFilterIcon,
  Loader2,
  ReceiptTextIcon,
  Search,
  SettingsIcon,
  SlidersHorizontalIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import HeaderPage from "@/components/header/header";
import { MdAddCircleOutline, MdReport } from "react-icons/md";
import Pagination from "./_components/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import RafiHadiyasa from "@/components/copyright";
import formatRupiah from "@/lib/helpers/formatRupiah";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TransactionPage = () => {
  const router = useRouter();
  const [value, setValue] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [type, setType] = useState("all");
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    depositAmount: 0,
    withdrawAmount: 0,
    pendingCount: 0,
    completedCount: 0,
    failedCount: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);

  const statusTabs = [
    { value: "all", label: "Semua" },
    {
      value: "pending",
      label: type === "deposit" ? "Belum Dijual" : "Pending",
    },
    {
      value: "completed",
      label: type === "deposit" ? "Sudah Dijual" : "Selesai",
    },
    { value: "failed", label: "Dibatalkan" },
  ];

  const typeTabs = [
    { value: "all", label: "Semua" },
    { value: "deposit", label: "Deposit" },
    { value: "withdraw", label: "Tarik Tunai" },
  ];

  const statusLabel =
    statusTabs.find((item) => item.value === value)?.label || "Semua";
  const typeLabel =
    {
      all: "Semua jenis",
      deposit: "Deposit",
      withdraw: "Tarik tunai",
    }[type] || "Semua jenis";
  const pendingSummaryLabel = type === "deposit" ? "Belum Dijual" : "Pending";
  const completedSummaryLabel =
    type === "deposit" ? "sudah dijual" : "selesai";

  const summaryCards = [
    {
      label: "Total Filter",
      value: loading ? "..." : formatRupiah(summary.totalAmount),
      caption: `${totalTransactions} transaksi cocok`,
      icon: ReceiptTextIcon,
      className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
    },
    {
      label: "Deposit",
      value: loading ? "..." : formatRupiah(summary.depositAmount),
      caption: "Nilai setor sesuai filter",
      icon: TrendingUpIcon,
      className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-200",
    },
    {
      label: "Tarik Tunai",
      value: loading ? "..." : formatRupiah(summary.withdrawAmount),
      caption: "Nilai tarik sesuai filter",
      icon: TrendingDownIcon,
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-200",
    },
    {
      label: pendingSummaryLabel,
      value: loading ? "..." : summary.pendingCount,
      caption: `${summary.completedCount} ${completedSummaryLabel} / ${summary.failedCount} dibatalkan`,
      icon: Clock3Icon,
      className: "bg-violet-500/10 text-violet-700 dark:text-violet-200",
    },
  ];

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllTransactions({
        page: currentPage,
        limit,
        searchTerm: activeSearchTerm,
        status: value,
        type,
      });

      if (response.success) {
        setTransactions(response.transactions);
        setTotalPages(response.totalPages);
        setTotalTransactions(response.totalTransactions || 0);
        setSummary({
          totalAmount: response.summary?.totalAmount || 0,
          depositAmount: response.summary?.depositAmount || 0,
          withdrawAmount: response.summary?.withdrawAmount || 0,
          pendingCount: response.summary?.pendingCount || 0,
          completedCount: response.summary?.completedCount || 0,
          failedCount: response.summary?.failedCount || 0,
        });
      } else {
        toast.error(response.message || "Failed to fetch transactions");
      }
    } catch (error) {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, [activeSearchTerm, currentPage, limit, type, value]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const onTriggerValue = (value) => {
    setValue(value);
    setCurrentPage(1);
  };

  const onSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = (event) => {
    event?.preventDefault();
    setCurrentPage(1);
    setActiveSearchTerm(searchTerm.trim());
  };

  const clearSearch = () => {
    setSearchTerm("");
    setActiveSearchTerm("");
    setCurrentPage(1);
  };

  const onTypeChange = (nextType) => {
    setType(nextType);
    setValue("all");
    setCurrentPage(1);
  };

  const onLimitChange = (nextLimit) => {
    setLimit(Number(nextLimit));
    setCurrentPage(1);
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

  const withdrawTransactionHandleClick = () => {
    setLoadingPage(true);
    router.push("/transactions/withdraw");
  };

  if (loadingPage) {
    return <LoadingPage message={"Loading data transaksi..."} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto grid w-full max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <ArrowDownUpIcon size={14} />
                Ledger Transaksi
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Transaksi Nasabah
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Pantau deposit, tarik tunai, nilai transaksi, dan status yang
                perlu ditindaklanjuti dari satu layar kerja.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={newTransactionHandleClick}
                className="h-10 gap-2 px-4 font-bold"
              >
                {!loadingPage ? (
                  <MdAddCircleOutline size={18} />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>Deposit Baru</span>
              </Button>
              <Button
                onClick={withdrawTransactionHandleClick}
                variant="outline"
                className="h-10 gap-2 border-amber-400/30 bg-amber-400/10 px-4 font-bold text-amber-700 hover:bg-amber-400/15 dark:text-amber-200"
              >
                {!loadingPage ? (
                  <HandCoinsIcon size={17} />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>Tarik Saldo</span>
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 gap-2 border-border/70 bg-background/60 px-4 font-bold shadow-sm hover:bg-accent"
                  >
                    <SettingsIcon size={16} />
                    <span>Tools</span>
                    <ChevronDownIcon size={15} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="glass-card grid !w-[min(92vw,320px)] gap-2 rounded-lg p-3"
                >
                  <Button
                    variant="ghost"
                    onClick={searchTransactionHandleClick}
                    className="h-10 justify-start gap-2 font-bold"
                  >
                    {loadingPage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search size={16} />
                    )}
                    <span>Cari Transaksi</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={advanceFilterHandleClick}
                    className="h-10 justify-start gap-2 font-bold"
                  >
                    {loadingPage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MdReport size={17} />
                    )}
                    <span>Advance Filter</span>
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-border/60 bg-background/55 p-4 shadow-sm backdrop-blur"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-2 truncate text-xl font-extrabold">
                        {item.value}
                      </p>
                    </div>
                    <span className={`rounded-md p-2 ${item.className}`}>
                      <Icon size={20} />
                    </span>
                  </div>
                  <p className="mt-3 truncate text-xs font-medium text-muted-foreground">
                    {item.caption}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <Card className="glass-card overflow-hidden rounded-lg">
          <CardContent className="p-0">
            <Tabs value={value} onValueChange={onTriggerValue}>
              <div className="border-b border-border/60 bg-background/35 p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
                  <ListFilterIcon size={15} />
                  Filter Transaksi
                </div>
                <div className="grid gap-3">
                  <div className="grid gap-3 xl:grid-cols-[minmax(0,420px)_minmax(0,520px)]">
                    <div className="grid gap-2">
                      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                        Jenis Transaksi
                      </div>
                      <Tabs value={type} onValueChange={onTypeChange}>
                        <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-lg border border-border/60 bg-muted/50 p-1">
                          {typeTabs.map((tab) => (
                            <TabsTrigger
                              key={tab.value}
                              className="rounded-md px-3 py-2 text-xs font-bold data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground sm:text-sm"
                              value={tab.value}
                            >
                              {tab.label}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    </div>

                    <div className="grid gap-2">
                      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                        Status
                      </div>
                      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-border/60 bg-muted/50 p-1 sm:grid-cols-4">
                        {statusTabs.map((tab) => (
                          <TabsTrigger
                            key={tab.value}
                            className="rounded-md px-3 py-2 text-xs font-bold data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground sm:text-sm"
                            value={tab.value}
                          >
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSearchClick}
                    className="grid gap-2 lg:grid-cols-[minmax(240px,360px)_128px_auto]"
                  >
                    <div className="relative">
                      <Search
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={16}
                      />
                      <Input
                        type="search"
                        value={searchTerm}
                        placeholder="Cari nama / rekening"
                        onChange={onSearchTermChange}
                        className="glass-input h-10 w-full rounded-md pl-9 pr-10"
                      />
                      {searchTerm ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
                          onClick={clearSearch}
                          aria-label="Bersihkan pencarian transaksi"
                        >
                          <XIcon size={15} />
                        </Button>
                      ) : null}
                    </div>

                    <Select
                      value={String(limit)}
                      onValueChange={onLimitChange}
                    >
                      <SelectTrigger className="glass-input h-10 rounded-md">
                        <SelectValue placeholder="Limit" />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        <SelectItem value="10">10 / page</SelectItem>
                        <SelectItem value="25">25 / page</SelectItem>
                        <SelectItem value="50">50 / page</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      type="submit"
                      variant="outline"
                      className="h-10 gap-2 border-border/70 bg-background/60 px-4 font-bold"
                    >
                      <SlidersHorizontalIcon size={16} />
                      <span>Terapkan</span>
                    </Button>
                  </form>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold">
                      Daftar transaksi {statusLabel.toLowerCase()}
                    </p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      Menampilkan {transactions.length} dari{" "}
                      {totalTransactions} transaksi cocok
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                    <span>{typeLabel}</span>
                    <span className="text-border">/</span>
                    <span>Halaman {currentPage} dari {totalPages}</span>
                    {activeSearchTerm ? (
                      <>
                        <span className="text-border">/</span>
                        <span className="inline-flex items-center gap-1">
                          <XCircleIcon size={13} />
                          {activeSearchTerm}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                <TabsContent className="mt-0" value={value}>
                  <TransactionTable
                    transactionData={transactions}
                    router={router}
                    searchTerm={activeSearchTerm}
                    value={value}
                    type={type}
                    loading={loading}
                  />
                  <Pagination
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalTransactions}
                    pageSize={limit}
                    setLoading={setLoading}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
        <RafiHadiyasa />
      </main>
    </div>
  );
};

export default TransactionPage;
