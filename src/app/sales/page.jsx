"use client";

import HeaderPage from "@/components/header/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import formatNumber from "@/lib/helpers/formatNumber";
import formatRupiah from "@/lib/helpers/formatRupiah";
import axios from "axios";
import {
  HandCoinsIcon,
  Loader2Icon,
  PackageCheckIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletCardsIcon,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const SHRINK_LABELS = {
  natural: "Kadar air",
  scale: "Timbangan",
  process: "Proses",
  loss: "Hilang",
};

const CancelPopover = ({ saleId, loading, onConfirm }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-red-500/30 bg-red-500/5 text-xs font-bold text-red-600 hover:bg-red-500/15 dark:text-red-400"
          disabled={loading}
        >
          {loading ? (
            <Loader2Icon size={13} className="animate-spin" />
          ) : (
            <XCircleIcon size={13} />
          )}
          Batalkan
        </Button>
      </PopoverTrigger>
      <PopoverContent className="glass-card w-64 p-4" align="end">
        <p className="text-sm font-bold">Batalkan penjualan ini?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Stok akan dikembalikan. Tanda "Sudah Dijual" pada deposit tidak ikut
          di-reset.
        </p>
        <div className="mt-3 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setOpen(false)}
          >
            Tidak
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 text-xs font-bold"
            disabled={loading}
            onClick={async () => {
              setOpen(false);
              await onConfirm(saleId);
            }}
          >
            Ya, Batalkan
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState({
    totalSoldWeight: 0,
    totalStockOutWeight: 0,
    totalShrinkWeight: 0,
    totalRevenue: 0,
    totalCogs: 0,
    totalProfit: 0,
    salesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const loadSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/sales", {
        withCredentials: true,
      });

      if (response.data.success) {
        setSales(response.data.sales || []);
        setSummary(response.data.summary || {});
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal memuat penjualan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (saleId) => {
    setCancellingId(saleId);
    try {
      await axios.patch(`/api/users/sales/${saleId}`, {}, { withCredentials: true });
      toast.success("Penjualan berhasil dibatalkan");
      await loadSales();
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal membatalkan penjualan");
    } finally {
      setCancellingId(null);
    }
  };

  const summaryCards = useMemo(() => {
    const profit = summary.totalProfit || 0;
    return [
      {
        label: "Total Terjual",
        value: `${formatNumber(summary.totalSoldWeight || 0)} kg`,
        caption: "Ditimbang pengepul",
        icon: PackageCheckIcon,
        className: "bg-amber-500/10 text-amber-700 dark:text-amber-200",
      },
      {
        label: "Hasil Penjualan",
        value: formatRupiah(summary.totalRevenue || 0),
        caption: "Total uang dari pengepul",
        icon: HandCoinsIcon,
        className: "bg-sky-500/10 text-sky-700 dark:text-sky-200",
      },
      {
        label: "Total Susut",
        value: `${formatNumber(summary.totalShrinkWeight || 0)} kg`,
        caption: "Selisih stok vs timbangan",
        icon: TrendingDownIcon,
        className: "bg-orange-500/10 text-orange-700 dark:text-orange-200",
      },
      {
        label: "Modal Terjual",
        value: formatRupiah(summary.totalCogs || 0),
        caption: "Modal (COGS) stok terjual",
        icon: WalletCardsIcon,
        className: "bg-violet-500/10 text-violet-700 dark:text-violet-200",
      },
      {
        label: profit >= 0 ? "Keuntungan" : "Kerugian",
        value: formatRupiah(profit),
        caption: "Hasil penjualan − modal",
        icon: profit >= 0 ? TrendingUpIcon : TrendingDownIcon,
        className:
          profit >= 0
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
            : "bg-red-500/10 text-red-700 dark:text-red-200",
      },
    ];
  }, [summary]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto grid w-full max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-400 to-amber-400" />
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <HandCoinsIcon size={14} />
              Penjualan ke Pengepul
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Riwayat Penjualan
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Catatan penjualan stok sampah dari bank sampah ke pengepul beserta
              susut dan keuntungan/kerugian.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
            <div className="border-b border-border/60 bg-background/35 p-4">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-muted-foreground">
                Rincian Penjualan
              </p>
            </div>
            {loading ? (
              <div className="flex min-h-64 items-center justify-center">
                <div className="grid justify-items-center gap-3">
                  <Loader2Icon className="animate-spin text-primary" size={28} />
                  <p className="text-sm font-bold text-muted-foreground">
                    Memuat penjualan
                  </p>
                </div>
              </div>
            ) : sales.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center p-8 text-center">
                <div>
                  <p className="font-extrabold">Belum ada penjualan</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Catat penjualan dari halaman Stok Sampah.
                  </p>
                </div>
              </div>
            ) : (
              <Table className="min-w-[1140px] text-sm">
                <TableHeader>
                  <TableRow className="bg-muted/35 hover:bg-muted/35">
                    <TableHead className="font-bold uppercase tracking-[0.12em]">
                      Tanggal
                    </TableHead>
                    <TableHead className="font-bold uppercase tracking-[0.12em]">
                      Sampah
                    </TableHead>
                    <TableHead className="text-right font-bold uppercase tracking-[0.12em]">
                      Keluar
                    </TableHead>
                    <TableHead className="text-right font-bold uppercase tracking-[0.12em]">
                      Ditimbang
                    </TableHead>
                    <TableHead className="text-right font-bold uppercase tracking-[0.12em]">
                      Susut
                    </TableHead>
                    <TableHead className="text-right font-bold uppercase tracking-[0.12em]">
                      Harga/kg
                    </TableHead>
                    <TableHead className="text-right font-bold uppercase tracking-[0.12em]">
                      Nilai Jual
                    </TableHead>
                    <TableHead className="text-right font-bold uppercase tracking-[0.12em]">
                      Modal
                    </TableHead>
                    <TableHead className="text-right font-bold uppercase tracking-[0.12em]">
                      Laba/Rugi
                    </TableHead>
                    <TableHead className="font-bold uppercase tracking-[0.12em]">
                      Pengepul
                    </TableHead>
                    <TableHead className="font-bold uppercase tracking-[0.12em]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => {
                    const shrink = sale.shrinkWeight || 0;
                    const isCancelled = sale.status === "cancelled";
                    return (
                      <TableRow
                        key={sale._id}
                        className={`hover:bg-primary/5 ${
                          isCancelled ? "opacity-50" : ""
                        }`}
                      >
                        <TableCell className="text-muted-foreground">
                          {sale.createdAt
                            ? formatDateToIndonesian(sale.createdAt)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="grid gap-1">
                            <span className="font-extrabold">
                              {sale.trash?.trashName ||
                                sale.trashNameSnapshot ||
                                "Sampah"}
                            </span>
                            {isCancelled ? (
                              <Badge
                                variant="outline"
                                className="w-fit rounded-md border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-300"
                              >
                                Dibatalkan
                              </Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatNumber(sale.stockOutWeight || 0)} kg
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatNumber(sale.soldWeight || 0)} kg
                        </TableCell>
                        <TableCell className="text-right">
                          {shrink === 0 ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            <span
                              className={
                                shrink > 0
                                  ? "font-semibold text-amber-600 dark:text-amber-300"
                                  : "font-semibold text-emerald-600 dark:text-emerald-300"
                              }
                            >
                              {shrink > 0 ? "" : "+"}
                              {formatNumber(Math.abs(shrink))}
                              {" kg"}
                              {shrink > 0 && sale.shrinkReason
                                ? ` · ${SHRINK_LABELS[sale.shrinkReason] || ""}`
                                : ""}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatRupiah(sale.sellPricePerKg || 0)}
                          {sale.priceChanged ? (
                            <span
                              title="Harga beda dari master"
                              className="ml-1 text-amber-600 dark:text-amber-300"
                            >
                              *
                            </span>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatRupiah(sale.revenue || 0)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatRupiah(sale.cogs || 0)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-extrabold ${
                            (sale.profit || 0) >= 0
                              ? "text-emerald-600 dark:text-emerald-300"
                              : "text-red-600 dark:text-red-300"
                          }`}
                        >
                          {formatRupiah(sale.profit || 0)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {sale.buyer || "-"}
                        </TableCell>
                        <TableCell>
                          {!isCancelled ? (
                            <CancelPopover
                              saleId={sale._id}
                              loading={cancellingId === sale._id}
                              onConfirm={handleCancel}
                            />
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SalesPage;
