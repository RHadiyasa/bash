"use client";

import HeaderPage from "@/components/header/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatNumber from "@/lib/helpers/formatNumber";
import formatRupiah from "@/lib/helpers/formatRupiah";
import axios from "axios";
import {
  BoxesIcon,
  HandCoinsIcon,
  Loader2Icon,
  PackageCheckIcon,
  ScaleIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletCardsIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import SellStockDialog from "./_components/sellStockDialog";

const cleanCopy = (value) =>
  String(value || "")
    .replace(/[^\x20-\x7E]+/g, "-")
    .replace(/-+/g, "-");

const InventoryPage = () => {
  const [stocks, setStocks] = useState([]);
  const [summary, setSummary] = useState({
    currentWeight: 0,
    totalWeightIn: 0,
    totalWeightSold: 0,
    totalShrinkWeight: 0,
    totalCostBasis: 0,
    totalSalesRevenue: 0,
    totalProfit: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/inventory", {
        withCredentials: true,
      });

      if (response.data.success) {
        setStocks(response.data.stocks || []);
        setSummary(response.data.summary || {});
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal memuat stok");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const summaryCards = useMemo(() => {
    const profit = summary.totalProfit || 0;
    return [
      {
        label: "Stok Tersedia",
        value: `${formatNumber(summary.currentWeight || 0)} kg`,
        caption: "Sampah milik bank sampah",
        icon: BoxesIcon,
        className: "bg-primary/10 text-primary",
      },
      {
        label: "Total Masuk",
        value: `${formatNumber(summary.totalWeightIn || 0)} kg`,
        caption: "Akumulasi dari setoran nasabah",
        icon: ScaleIcon,
        className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-200",
      },
      {
        label: "Sudah Dijual",
        value: `${formatNumber(summary.totalWeightSold || 0)} kg`,
        caption: "Timbangan pengepul (basis revenue)",
        icon: PackageCheckIcon,
        className: "bg-amber-500/10 text-amber-700 dark:text-amber-200",
      },
      {
        label: "Total Susut",
        value: `${formatNumber(summary.totalShrinkWeight || 0)} kg`,
        caption: "Selisih stok keluar vs timbangan",
        icon: TrendingDownIcon,
        className: "bg-orange-500/10 text-orange-700 dark:text-orange-200",
      },
      {
        label: "Modal Stok",
        value: formatRupiah(summary.totalCostBasis || 0),
        caption: "Sisa modal stok belum dijual",
        icon: WalletCardsIcon,
        className: "bg-violet-500/10 text-violet-700 dark:text-violet-200",
      },
      {
        label: "Hasil Penjualan",
        value: formatRupiah(summary.totalSalesRevenue || 0),
        caption: "Total uang dari pengepul",
        icon: HandCoinsIcon,
        className: "bg-sky-500/10 text-sky-700 dark:text-sky-200",
      },
      {
        label: profit >= 0 ? "Keuntungan" : "Kerugian",
        value: formatRupiah(profit),
        caption: "Hasil penjualan − modal terjual",
        icon: profit >= 0 ? TrendingUpIcon : TrendingDownIcon,
        className:
          profit >= 0
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
            : "bg-red-500/10 text-red-700 dark:text-red-200",
      },
    ];
  }, [summary]);

  const isInitialLoading = loading && stocks.length === 0;
  const isRefreshing = loading && stocks.length > 0;

  if (isInitialLoading) {
    return (
      <div className="h-screen overflow-hidden bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
        <HeaderPage />
        <main className="mx-auto flex h-[calc(100vh-88px)] w-full max-w-[1500px] items-center px-4 py-4 sm:px-6 lg:px-8">
          <section className="glass-card relative w-full overflow-hidden rounded-lg p-5 sm:p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(360px,1fr)] lg:items-center">
              <div className="grid gap-4">
                <div className="inline-flex w-fit items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  <BoxesIcon size={14} />
                  Stok Bank Sampah
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    Memuat stok sampah
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Data inventory sedang disiapkan. Halaman akan tampil penuh
                    setelah stok dan ringkasan selesai dimuat.
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/55 p-4">
                  <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
                  <div>
                    <p className="text-sm font-black">Mengambil data stok</p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      Mohon tunggu sebentar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden gap-3 sm:grid sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-h-[132px] animate-pulse rounded-lg border border-border/60 bg-background/45 p-4"
                  >
                    <div className="h-3 w-24 rounded bg-muted/70" />
                    <div className="mt-4 h-7 w-32 rounded bg-muted/60" />
                    <div className="mt-6 h-3 w-full rounded bg-muted/50" />
                    <div className="mt-2 h-3 w-2/3 rounded bg-muted/40" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto grid w-full max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <BoxesIcon size={14} />
              Stok Bank Sampah
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Stok Sampah
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Material yang sudah dibeli dari nasabah dan masih menjadi stok
              bank sampah sebelum dijual ke pengepul.
            </p>
            <Link
              href="/sales"
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-primary/25 bg-primary/10 px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
            >
              <HandCoinsIcon size={15} />
              Riwayat Penjualan
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {summaryCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="group min-h-[148px] rounded-lg border border-border/60 bg-background/55 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-background/70"
                >
                  <div className="flex h-full flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words text-xs font-bold uppercase leading-5 tracking-[0.16em] text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="mt-2 break-words text-2xl font-extrabold leading-tight tracking-tight">
                          {item.value}
                        </p>
                      </div>
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${item.className}`}
                      >
                        <Icon size={20} />
                      </span>
                    </div>
                    <p className="text-xs font-medium leading-5 text-muted-foreground">
                      {cleanCopy(item.caption)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Card className="glass-card overflow-hidden rounded-lg">
          <CardContent className="p-0">
            <div className="flex flex-col gap-2 border-b border-border/60 bg-background/35 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Rincian Stok
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  Stok berjalan per jenis sampah, modal, dan aksi penjualan.
                </p>
              </div>
              <Badge
                variant="outline"
                className="w-fit rounded-md border-primary/20 bg-primary/10 px-3 py-1 font-bold text-primary"
              >
                {isRefreshing ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                    Memuat ulang
                  </span>
                ) : (
                  `${stocks.length} material`
                )}
              </Badge>
            </div>
            {loading && stocks.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center">
                <div className="grid justify-items-center gap-3">
                  <Loader2Icon className="animate-spin text-primary" size={28} />
                  <p className="text-sm font-bold text-muted-foreground">
                    Memuat stok sampah
                  </p>
                </div>
              </div>
            ) : stocks.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center p-8 text-center">
                <div>
                  <p className="font-extrabold">Belum ada stok</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Stok akan muncul setelah deposit nasabah dicatat.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto [scrollbar-color:hsl(var(--primary))_transparent] [scrollbar-width:thin]">
                <Table className="min-w-[1080px] text-sm">
                  <TableHeader>
                    <TableRow className="bg-muted/35 hover:bg-muted/35">
                      <TableHead className="w-[280px] font-bold uppercase tracking-[0.12em]">
                        Material
                      </TableHead>
                      <TableHead className="w-[180px] font-bold uppercase tracking-[0.12em]">
                        Stok Tersedia
                      </TableHead>
                      <TableHead className="w-[190px] font-bold uppercase tracking-[0.12em]">
                        Modal Stok
                      </TableHead>
                      <TableHead className="font-bold uppercase tracking-[0.12em]">
                        Pergerakan
                      </TableHead>
                      <TableHead className="w-[132px] text-right font-bold uppercase tracking-[0.12em]">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stocks.map((stock) => {
                      const currentWeight = Number(stock.currentWeight || 0);
                      const shrinkWeight = Number(stock.totalShrinkWeight || 0);

                      return (
                        <TableRow key={stock._id} className="hover:bg-primary/5">
                          <TableCell className="py-4 align-middle">
                            <div className="grid gap-2">
                              <span className="text-base font-extrabold leading-tight">
                                {stock.trash?.trashName ||
                                  stock.trashNameSnapshot ||
                                  "Sampah"}
                              </span>
                              <Badge
                                variant="outline"
                                className="w-fit rounded-md border-border/60 bg-background/45 px-2 py-0.5 text-[11px] font-bold text-muted-foreground"
                              >
                                {stock.trash?.trashCategory?.categoryName ||
                                  "Material"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 align-middle">
                            <div className="grid gap-1">
                              <span className="text-xl font-black leading-none">
                                {formatNumber(currentWeight)} kg
                              </span>
                              <span className="text-xs font-medium text-muted-foreground">
                                {currentWeight > 0 ? "Siap dijual" : "Stok habis"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 align-middle">
                            <div className="grid gap-1">
                              <span className="text-base font-black">
                                {formatRupiah(stock.totalCostBasis || 0)}
                              </span>
                              <span className="text-xs font-medium text-muted-foreground">
                                Modal belum terjual
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 align-middle">
                            <div className="grid gap-2 sm:grid-cols-3">
                              <div className="rounded-md border border-border/60 bg-background/35 p-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                                  Masuk
                                </p>
                                <p className="mt-1 font-bold text-muted-foreground">
                                  {formatNumber(stock.totalWeightIn || 0)} kg
                                </p>
                              </div>
                              <div className="rounded-md border border-border/60 bg-background/35 p-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                                  Terjual
                                </p>
                                <p className="mt-1 font-bold text-muted-foreground">
                                  {formatNumber(stock.totalWeightSold || 0)} kg
                                </p>
                              </div>
                              <div
                                className={`rounded-md border p-2 ${
                                  shrinkWeight > 0
                                    ? "border-orange-400/30 bg-orange-400/10"
                                    : "border-border/60 bg-background/35"
                                }`}
                              >
                                <p
                                  className={`text-[10px] font-black uppercase tracking-[0.12em] ${
                                    shrinkWeight > 0
                                      ? "text-orange-700 dark:text-orange-200"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  Susut
                                </p>
                                <p
                                  className={`mt-1 font-bold ${
                                    shrinkWeight > 0
                                      ? "text-orange-700 dark:text-orange-200"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {shrinkWeight > 0
                                    ? `${formatNumber(shrinkWeight)} kg`
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-right align-middle">
                            <div className="flex justify-end">
                              <SellStockDialog
                                stock={stock}
                                onSold={loadInventory}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InventoryPage;
