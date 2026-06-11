import { Separator } from "@/components/ui/separator";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { ArchiveIcon, BanknoteIcon, ScaleIcon, WalletIcon } from "lucide-react";
import React from "react";

const CustomerTransactionOverview = ({ customerData, totalTransactions }) => {
  const totalWeight = Number(customerData?.totalWeight || 0);
  const balance = Number(customerData?.balance || 0);
  const totalDeposit = Number(customerData?.totalDeposit || 0);
  const totalWithdraw = Number(customerData?.totalWithdraw || 0);

  const metrics = [
    {
      label: "Total Transaksi",
      value: `${totalTransactions} Transaksi`,
      icon: ArchiveIcon,
      className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-200",
    },
    {
      label: "Total Sampah",
      value: `${totalWeight.toFixed(2)} Kg`,
      icon: ScaleIcon,
      className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
    },
    {
      label: "Total Setor",
      value: formatRupiah(totalDeposit),
      icon: BanknoteIcon,
      className: "bg-blue-500/10 text-blue-700 dark:text-blue-200",
    },
    {
      label: "Total Tarik",
      value: formatRupiah(totalWithdraw),
      icon: WalletIcon,
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-200",
    },
  ];

  return (
    <div className="glass-card rounded-lg p-5">
      <div>
        <div className="text-sm font-bold text-muted-foreground">
          Saldo Nasabah
        </div>
        <div className="mt-2 text-3xl font-extrabold">
          {formatRupiah(balance)}
        </div>
      </div>
      <Separator className="my-5" />
      <div className="grid gap-3 sm:grid-cols-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-lg border border-border/60 bg-background/45 p-3"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {metric.label}
                </div>
                <span className={`rounded-md p-2 ${metric.className}`}>
                  <Icon size={16} />
                </span>
              </div>
              <div className="text-sm font-extrabold">{metric.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerTransactionOverview;
