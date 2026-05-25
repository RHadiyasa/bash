"use client";
import RafiHadiyasa from "@/components/copyright";
import HeaderPage from "@/components/header/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArchiveIcon,
  FilterIcon,
  Loader2,
  MapPinIcon,
  Plus,
  Search,
  ScaleIcon,
  Trash2Icon,
  UserRoundCheckIcon,
  UsersRoundIcon,
  WalletIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import TableListCustomer from "./_components/tableListCustomer";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableDeletedCustomers from "./_components/tableListDeletedCustomer";
import toast from "react-hot-toast";
import { deleteAllInactiveCustomers } from "@/modules/services/user.service";
import LoadingBar from "react-top-loading-bar";
import formatRupiah from "@/lib/helpers/formatRupiah";

const CustomerPage = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [regions, setRegions] = useState([]);
  const [customerMeta, setCustomerMeta] = useState({
    pagination: {
      page: 1,
      limit: 10,
      totalPages: 1,
      totalCustomers: 0,
      filteredCustomers: 0,
    },
    summary: {
      totalBalance: 0,
      totalDeposit: 0,
      totalWithdraw: 0,
      totalWeight: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("active");

  const isFiltered = Boolean(searchTerm.trim()) || regionFilter !== "all";

  useEffect(() => {
    setPage(1);
  }, [searchTerm, regionFilter, limit]);

  const summaryCards = useMemo(
    () => [
      {
        label: isFiltered ? "Hasil Filter" : "Total Nasabah",
        value: customerMeta.pagination.filteredCustomers,
        caption: isFiltered
          ? `Dari ${customerMeta.pagination.totalCustomers} nasabah aktif`
          : "Nasabah aktif tersimpan",
        icon: UserRoundCheckIcon,
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
      },
      {
        label: "Saldo Hasil",
        value: formatRupiah(customerMeta.summary.totalBalance || 0),
        caption: "Akumulasi saldo data terfilter",
        icon: WalletIcon,
        className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-200",
      },
      {
        label: "Total Sampah",
        value: `${Number(customerMeta.summary.totalWeight || 0).toLocaleString(
          "id-ID",
          { maximumFractionDigits: 2 }
        )} Kg`,
        caption: "Akumulasi berat data terfilter",
        icon: ScaleIcon,
        className: "bg-amber-500/10 text-amber-700 dark:text-amber-200",
      },
      {
        label: "RT/RW",
        value: regionFilter === "all" ? `${regions.length} area` : regionFilter,
        caption:
          regionFilter === "all"
            ? "Area terdaftar"
            : "Area yang sedang difilter",
        icon: MapPinIcon,
        className: "bg-violet-500/10 text-violet-700 dark:text-violet-200",
      },
    ],
    [customerMeta, isFiltered, regionFilter, regions.length]
  );

  const onTriggerValue = (newValue) => {
    setValue(newValue);
  };

  const loadingTrigger = () => {
    setLoading(true);
  };

  const handleDeleteAllInactiveCustomers = async () => {
    setLoading(true);
    try {
      await deleteAllInactiveCustomers();
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage loadingProgress={progress} />
      <LoadingBar
        color="#8dCC9E"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <UsersRoundIcon size={14} />
                Data Nasabah
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Nasabah
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Pantau nasabah aktif dan non-aktif, cari rekening dengan cepat,
                lalu buka detail profil untuk transaksi dan histori.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href={"/customers/new"}>
                <Button
                  onClick={loadingTrigger}
                  className="h-10 gap-2 px-4 font-bold"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  <span>Tambah Nasabah</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-border/60 bg-background/55 p-4 shadow-sm backdrop-blur"
                >
                  <div className="flex items-start justify-between gap-3">
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
                  <p className="mt-3 text-xs font-medium text-muted-foreground">
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
              <div className="flex flex-col gap-4 border-b border-border/60 bg-background/35 p-4 lg:flex-row lg:items-center lg:justify-between">
                <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-border/60 bg-muted/50 p-1 sm:w-[380px]">
                  <TabsTrigger
                    className="rounded-md px-3 py-2 text-xs font-bold data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground sm:text-sm"
                    value="active"
                  >
                    Nasabah Aktif
                  </TabsTrigger>
                  <TabsTrigger
                    className="rounded-md px-3 py-2 text-xs font-bold data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground sm:text-sm"
                    value="inactive"
                  >
                    Nasabah Non-Aktif
                  </TabsTrigger>
                </TabsList>

                <div className="grid w-full gap-3 lg:w-auto lg:grid-cols-[280px_180px_140px]">
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      type="search"
                      value={searchTerm}
                      placeholder="Cari nama / rekening"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="glass-input h-10 w-full rounded-md pl-9 pr-10"
                    />
                    {searchTerm ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setSearchTerm("")}
                        aria-label="Bersihkan pencarian nasabah"
                      >
                        <XIcon size={15} />
                      </Button>
                    ) : null}
                  </div>

                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="glass-input h-10 rounded-md">
                      <div className="flex items-center gap-2">
                        <FilterIcon size={15} />
                        <SelectValue placeholder="Filter RT/RW" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="all">Semua RT/RW</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={String(limit)}
                    onValueChange={(nextLimit) => setLimit(Number(nextLimit))}
                  >
                    <SelectTrigger className="glass-input h-10 rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {[10, 25, 50, 100].map((item) => (
                        <SelectItem key={item} value={String(item)}>
                          {item} / page
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-bold">
                    {value === "active"
                      ? "Daftar nasabah aktif"
                      : "Daftar nasabah non-aktif"}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {value === "active"
                      ? `${customerMeta.pagination.filteredCustomers} hasil, halaman ${page} dari ${customerMeta.pagination.totalPages}`
                      : searchTerm
                      ? `Filter: ${searchTerm}`
                      : "Data nasabah bank sampah"}
                  </p>
                </div>

              <TabsContent className="mt-0" value="active">
                <TableListCustomer
                  progress={progress}
                  setProgress={setProgress}
                  router={router}
                  searchTerm={searchTerm}
                  regionFilter={regionFilter}
                  limit={limit}
                  page={page}
                  setPage={setPage}
                  onMetaChange={setCustomerMeta}
                  onRegionsChange={setRegions}
                />
              </TabsContent>
              <TabsContent className="mt-0" value="inactive">
                <TableDeletedCustomers
                  router={router}
                  searchTerm={searchTerm}
                />
                <div className="flex items-center justify-center border-t border-border/60 pt-6">
                  <Button
                    onClick={handleDeleteAllInactiveCustomers}
                    variant="destructive"
                    className="gap-2 font-bold"
                    disabled={loading ? true : false}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Trash2Icon size={16} />
                    )}
                    <span>Hapus Semua Nasabah Non-Aktif</span>
                  </Button>
                </div>
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

export default CustomerPage;
