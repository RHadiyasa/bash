import React, { useEffect, useState } from "react";
import formatRupiah from "@/lib/helpers/formatRupiah";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import {
  ArrowRightIcon,
  ClockIcon,
  Loader2,
  ReceiptTextIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

const CustomerHistoryDetails = ({
  customerData,
  transactionHistoryData,
  loading: loadingData = false,
  onShowAllTransactions,
  featured = false,
}) => {
  const [transactionHistories, setTransactionHistories] = useState([]);

  useEffect(() => {
    setTransactionHistories(transactionHistoryData || []);
  }, [transactionHistoryData]);

  const sortedTransactions = [...transactionHistories].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="glass-card overflow-hidden rounded-lg">
      <div className="border-b border-border/60 bg-background/30 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ReceiptTextIcon size={20} />
            </span>
            <div>
              <div
                className={
                  featured
                    ? "text-2xl font-black tracking-tight"
                    : "font-extrabold"
                }
              >
                Transaksi Terakhir
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {customerData?.fullName || "Nasabah"}
              </p>
              <p className="mt-1 text-xs font-semibold text-primary">
                Transaksi terbaru ditampilkan paling atas.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onShowAllTransactions}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            Semua transaksi <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        {loadingData ? (
          <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-6 text-sm font-bold">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
            Memuat transaksi
          </div>
        ) : sortedTransactions.length > 0 ? (
          <div
            className={
              featured
                ? "max-h-[380px] overflow-y-auto pr-2 [scrollbar-color:hsl(var(--primary))_transparent] [scrollbar-width:thin]"
                : "max-h-72 overflow-y-auto pr-2 [scrollbar-color:hsl(var(--primary))_transparent] [scrollbar-width:thin]"
            }
          >
            <div className="relative grid gap-4">
              <div className="absolute bottom-4 left-5 top-4 w-px bg-border/70" />
              {sortedTransactions.map((trans) => {
                const isDeposit = trans.transactionType === "deposit";
                const TypeIcon = isDeposit ? TrendingUpIcon : TrendingDownIcon;

                return (
                  <div
                    key={trans._id}
                    className="relative grid grid-cols-[42px_minmax(0,1fr)] gap-3"
                  >
                    <div className="z-10 flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-background text-primary shadow-sm">
                      <ClockIcon size={17} />
                    </div>
                    <div
                      className={`rounded-lg border border-border/60 bg-background/45 p-4 shadow-sm backdrop-blur ${
                        trans.transactionStatus === "failed" ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm font-black">
                          {formatDateToIndonesian(trans.createdAt)}
                        </div>
                        <span
                          className={
                            isDeposit
                              ? "inline-flex w-fit items-center gap-2 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-black text-emerald-700 dark:text-emerald-200"
                              : "inline-flex w-fit items-center gap-2 rounded-md border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-black text-amber-700 dark:text-amber-200"
                          }
                        >
                          <TypeIcon size={14} />
                          {trans.transactionType}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <div className="rounded-md border border-border/60 bg-background/55 px-3 py-2">
                          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            Nominal
                          </div>
                          <div className="mt-1 text-sm font-extrabold">
                            {formatRupiah(trans.transactionAmount)}
                          </div>
                        </div>
                        <div className="rounded-md border border-border/60 bg-background/55 px-3 py-2">
                          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            Sampah
                          </div>
                          <div className="mt-1 text-sm font-extrabold">
                            {trans.trash?.trashName || "-"}
                          </div>
                        </div>
                        <div className="rounded-md border border-border/60 bg-background/55 px-3 py-2">
                          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            Status
                          </div>
                          <div className="mt-1 text-sm font-extrabold">
                            {trans.transactionStatus || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/70 bg-muted/25 p-6 text-center text-sm font-bold">
            Belum ada transaksi
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHistoryDetails;
