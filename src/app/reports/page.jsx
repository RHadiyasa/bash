"use client";

import HeaderPage from "@/components/header/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import formatNumber from "@/lib/helpers/formatNumber";
import formatRupiah from "@/lib/helpers/formatRupiah";
import axios from "axios";
import {
  AlertTriangleIcon,
  BoxesIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  HandCoinsIcon,
  Loader2Icon,
  PackageCheckIcon,
  ScaleIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletCardsIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const formatKg = (value = 0) => `${formatNumber(value)} kg`;

const formatShrinkWeight = (value = 0) => {
  if (!value) return "-";
  const prefix = value < 0 ? "+" : "";
  return `${prefix}${formatNumber(Math.abs(value))} kg`;
};

const getProfitClass = (value = 0) =>
  value >= 0 ? "text-emerald-300" : "text-rose-300";

const getShrinkClass = (value = 0) => {
  if (value > 0) return "text-amber-300";
  if (value < 0) return "text-emerald-300";
  return "text-muted-foreground";
};

export default function ReportsPage() {
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState(null);
  const [invariantOk, setInvariantOk] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users/reports/reconciliation");
      setRows(res.data?.rows || []);
      setTotals(res.data?.totals || null);
      setInvariantOk(Boolean(res.data?.invariantOk));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Gagal memuat laporan rekonsiliasi stok"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const summaryCards = useMemo(() => {
    const data = totals || {};
    return [
      {
        label: "Laba/Rugi Bank",
        value: formatRupiah(data.totalProfit || 0),
        caption: "Revenue dikurangi modal stok terjual",
        icon: TrendingUpIcon,
        tone: "emerald",
        priority: "Prioritas utama",
      },
      {
        label: "Total Susut",
        value: formatShrinkWeight(data.totalShrinkWeight || 0),
        caption: `Rasio ${formatNumber(data.shrinkRatio || 0)}% dari stok keluar`,
        icon: TrendingDownIcon,
        tone: "amber",
        priority: "Pantau selisih timbang",
      },
      {
        label: "Stok Tersisa",
        value: formatKg(data.currentWeight || 0),
        caption: "Belum dijual ke pengepul",
        icon: ClipboardListIcon,
        tone: "emerald",
      },
      {
        label: "Revenue",
        value: formatRupiah(data.totalSalesRevenue || 0),
        caption: "Uang masuk dari pengepul",
        icon: HandCoinsIcon,
        tone: "cyan",
      },
      {
        label: "COGS",
        value: formatRupiah(data.totalCogs || 0),
        caption: "Modal stok yang sudah terjual",
        icon: WalletCardsIcon,
        tone: "violet",
      },
      {
        label: "Total Masuk",
        value: formatKg(data.totalWeightIn || 0),
        caption: "Akumulasi setoran nasabah",
        icon: ScaleIcon,
        tone: "cyan",
      },
      {
        label: "Total Terjual",
        value: formatKg(data.totalWeightSold || 0),
        caption: "Timbangan yang diterima pengepul",
        icon: BoxesIcon,
        tone: "amber",
      },
    ];
  }, [totals]);

  const toneClass = {
    emerald:
      "border-emerald-400/20 bg-emerald-400/5 text-emerald-300 shadow-[0_0_28px_rgba(52,211,153,0.08)]",
    amber:
      "border-amber-300/20 bg-amber-300/5 text-amber-200 shadow-[0_0_28px_rgba(251,191,36,0.08)]",
    cyan: "border-cyan-300/20 bg-cyan-300/5 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.08)]",
    violet:
      "border-violet-300/20 bg-violet-300/5 text-violet-200 shadow-[0_0_28px_rgba(167,139,250,0.08)]",
  };

  return (
    <div className="w-full">
      <HeaderPage />

      <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card overflow-hidden rounded-lg border border-border/70 bg-card/70">
          <div className="h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300" />
          <div className="p-5 sm:p-6">
            <Badge className="border-emerald-400/25 bg-emerald-400/10 px-3 py-1 font-bold uppercase tracking-[0.22em] text-emerald-300">
              <ClipboardListIcon className="mr-2 h-3.5 w-3.5" />
              Laporan Rekonsiliasi
            </Badge>
            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                  Rekonsiliasi Stok
                </h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                  Verifikasi keseimbangan stok per jenis sampah: masuk = stok
                  tersisa + terjual + susut. Panel ringkasan dibuat tetap agar
                  angka penting selalu terlihat ketika tabel discroll.
                </p>
              </div>
              <Badge
                className={
                  invariantOk
                    ? "w-fit border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 font-bold text-emerald-300"
                    : "w-fit border-amber-300/25 bg-amber-300/10 px-3 py-1.5 font-bold text-amber-200"
                }
              >
                {invariantOk ? (
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                ) : (
                  <AlertTriangleIcon className="mr-2 h-4 w-4" />
                )}
                {invariantOk ? "Invarian Seimbang" : "Perlu Dicek"}
              </Badge>
            </div>
          </div>
        </section>

        <Card className="glass-card overflow-hidden rounded-lg border border-border/70 bg-card/75">
          <CardContent className="p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
                  Ringkasan Rekonsiliasi
                </p>
                <h2 className="mt-2 text-xl font-extrabold text-foreground">
                  Angka Utama
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                Card disusun berdasarkan prioritas informasi: laba/rugi, susut,
                stok, lalu metrik pendukung.
              </p>
            </div>

            {loading ? (
              <div className="flex min-h-40 items-center justify-center rounded-lg border border-border/60 bg-background/35 text-muted-foreground">
                <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                Memuat laporan...
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {summaryCards.map((card, index) => {
                  const Icon = card.icon;
                  const isPrimary = index < 2;
                  return (
                    <Card
                      key={card.label}
                      className={`min-h-[150px] rounded-lg border bg-background/35 ${
                        toneClass[card.tone]
                      } ${isPrimary ? "lg:col-span-1 xl:col-span-2" : ""}`}
                    >
                      <CardContent className="flex h-full flex-col justify-between p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                {card.label}
                              </p>
                              {card.priority && (
                                <span className="rounded-full border border-current/20 bg-current/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]">
                                  {card.priority}
                                </span>
                              )}
                            </div>
                            <p
                              className={`mt-3 truncate font-extrabold text-foreground ${
                                isPrimary ? "text-3xl" : "text-2xl"
                              }`}
                            >
                              {card.value}
                            </p>
                          </div>
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-current/15 bg-current/10">
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                        <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {card.caption}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card min-w-0 overflow-hidden rounded-lg border border-border/70 bg-card/75">
            <CardContent className="p-0">
              <div className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                    Per Jenis Sampah
                  </p>
                  <h2 className="mt-2 text-xl font-extrabold text-foreground">
                    Detail Rekonsiliasi
                  </h2>
                </div>
                <Badge
                  className={
                    invariantOk
                      ? "w-fit border-emerald-400/25 bg-emerald-400/10 font-bold text-emerald-300"
                      : "w-fit border-amber-300/25 bg-amber-300/10 font-bold text-amber-200"
                  }
                >
                  {invariantOk ? "Semua Seimbang" : "Ada Selisih"}
                </Badge>
              </div>

              {loading ? (
                <div className="flex min-h-96 items-center justify-center text-muted-foreground">
                  <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                  Memuat tabel...
                </div>
              ) : rows.length === 0 ? (
                <div className="flex min-h-96 flex-col items-center justify-center px-6 text-center">
                  <PackageCheckIcon className="h-10 w-10 text-emerald-300" />
                  <p className="mt-4 text-lg font-extrabold text-foreground">
                    Belum ada data rekonsiliasi
                  </p>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Data akan muncul setelah ada stok masuk atau penjualan yang
                    tercatat.
                  </p>
                </div>
              ) : (
                <div className="max-h-[calc(100vh-15rem)] overflow-auto">
                  <table className="w-full min-w-[1120px] border-collapse text-sm">
                    <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur">
                      <tr className="border-b border-border/70 text-left">
                        <th className="px-4 py-4 font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Sampah
                        </th>
                        <th className="px-4 py-4 font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Masuk
                        </th>
                        <th className="px-4 py-4 font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Stok
                        </th>
                        <th className="px-4 py-4 font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Terjual
                        </th>
                        <th className="px-4 py-4 font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Susut
                        </th>
                        <th className="px-4 py-4 font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Susut %
                        </th>
                        <th className="px-4 py-4 font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Revenue
                        </th>
                        <th className="px-4 py-4 font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          COGS
                        </th>
                        <th className="px-4 py-4 font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Laba/Rugi
                        </th>
                        <th className="px-4 py-4 text-center font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          Cek
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr
                          key={row.trashId || row.trashName}
                          className="border-b border-border/60 transition-colors hover:bg-emerald-400/5"
                        >
                          <td className="px-4 py-4 font-extrabold text-foreground">
                            {row.trashName}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {formatKg(row.totalWeightIn)}
                          </td>
                          <td className="px-4 py-4 font-bold text-foreground">
                            {formatKg(row.currentWeight)}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {formatKg(row.totalWeightSold)}
                          </td>
                          <td
                            className={`px-4 py-4 font-bold ${getShrinkClass(
                              row.totalShrinkWeight
                            )}`}
                          >
                            {formatShrinkWeight(row.totalShrinkWeight)}
                          </td>
                          <td
                            className={`px-4 py-4 font-bold ${getShrinkClass(
                              row.totalShrinkWeight
                            )}`}
                          >
                            {row.totalShrinkWeight
                              ? `${formatNumber(row.shrinkRatio || 0)}%`
                              : "-"}
                          </td>
                          <td className="px-4 py-4 font-bold text-foreground">
                            {formatRupiah(row.totalSalesRevenue || 0)}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {formatRupiah(row.totalCogs || 0)}
                          </td>
                          <td
                            className={`px-4 py-4 font-extrabold ${getProfitClass(
                              row.totalProfit
                            )}`}
                          >
                            {formatRupiah(row.totalProfit || 0)}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {row.balanced ? (
                              <CheckCircle2Icon className="mx-auto h-4 w-4 text-emerald-300" />
                            ) : (
                              <AlertTriangleIcon className="mx-auto h-4 w-4 text-amber-300" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="sticky bottom-0 z-10 bg-card/95 backdrop-blur">
                      <tr className="border-t border-emerald-400/30 text-foreground">
                        <td className="px-4 py-4 font-extrabold uppercase">
                          Total
                        </td>
                        <td className="px-4 py-4 font-extrabold">
                          {formatKg(totals?.totalWeightIn || 0)}
                        </td>
                        <td className="px-4 py-4 font-extrabold">
                          {formatKg(totals?.currentWeight || 0)}
                        </td>
                        <td className="px-4 py-4 font-extrabold">
                          {formatKg(totals?.totalWeightSold || 0)}
                        </td>
                        <td
                          className={`px-4 py-4 font-extrabold ${getShrinkClass(
                            totals?.totalShrinkWeight
                          )}`}
                        >
                          {formatShrinkWeight(totals?.totalShrinkWeight || 0)}
                        </td>
                        <td
                          className={`px-4 py-4 font-extrabold ${getShrinkClass(
                            totals?.totalShrinkWeight
                          )}`}
                        >
                          {formatNumber(totals?.shrinkRatio || 0)}%
                        </td>
                        <td className="px-4 py-4 font-extrabold">
                          {formatRupiah(totals?.totalSalesRevenue || 0)}
                        </td>
                        <td className="px-4 py-4 font-extrabold text-muted-foreground">
                          {formatRupiah(totals?.totalCogs || 0)}
                        </td>
                        <td
                          className={`px-4 py-4 font-extrabold ${getProfitClass(
                            totals?.totalProfit
                          )}`}
                        >
                          {formatRupiah(totals?.totalProfit || 0)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {invariantOk ? (
                            <CheckCircle2Icon className="mx-auto h-4 w-4 text-emerald-300" />
                          ) : (
                            <AlertTriangleIcon className="mx-auto h-4 w-4 text-amber-300" />
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
      </main>
    </div>
  );
}
