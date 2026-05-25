"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BadgeCheckIcon,
  Loader2,
  ReceiptTextIcon,
  UserRoundIcon,
} from "lucide-react";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { updateTransactionStatus } from "@/modules/services/transaction.service";
import RafiHadiyasa from "@/components/copyright";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusStyles = {
  pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-200",
  completed:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
  failed: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200",
};

const statusLabels = {
  pending: "Belum Dijual",
  completed: "Sudah Dijual",
  failed: "Dibatalkan",
};

const typeLabels = {
  deposit: "Deposit",
  withdraw: "Tarik Tunai",
};

const DrawerTransaction = ({ transactionData, onUpdateTransaction }) => {
  const [transactionStatus, setTransactionStatus] = useState(
    transactionData.transactionStatus
  );
  const [loading, setLoading] = useState(false);

  const handleChangeStatus = async (newStatus) => {
    setLoading(true);
    try {
      await updateTransactionStatus(transactionData._id, newStatus);
      setTransactionStatus(newStatus);
      onUpdateTransaction({ ...transactionData, transactionStatus: newStatus });
    } catch (error) {
      console.error("Failed to update transaction status", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 border-border/70 bg-background/60 px-3 font-bold"
        >
          <ArrowUpRightIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Detail</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="glass-card mx-auto max-h-[90vh] max-w-3xl overflow-y-auto rounded-t-lg">
        <DrawerHeader className="border-b border-border/60 text-left">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                <ReceiptTextIcon size={14} />
                Detail Transaksi
              </div>
              <DrawerTitle className="break-words text-2xl font-black">
                {transactionData.customer?.fullName || "Nasabah dihapus"}
              </DrawerTitle>
              <DrawerDescription className="mt-2">
                {transactionData.customer?.accountNumber || "Rekening tidak tersedia"} /{" "}
                {formatDateToIndonesian(transactionData.createdAt)}
              </DrawerDescription>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Nilai Transaksi
              </p>
              <p className="mt-1 text-2xl font-black">
                {formatRupiah(transactionData.transactionAmount)}
              </p>
            </div>
          </div>
        </DrawerHeader>
        <div className="px-5 py-4 sm:px-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-background/35 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-black">
                <UserRoundIcon size={16} />
                Nasabah
              </div>
              <div className="grid gap-2 text-sm">
                <p className="font-bold">
                  {transactionData.customer?.fullName || "Nasabah dihapus"}
                </p>
                <p className="text-muted-foreground">
                  {transactionData.customer?.accountNumber || "-"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-background/35 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-black">
                {transactionData.transactionType === "deposit" ? (
                  <ArrowDownLeftIcon size={16} />
                ) : (
                  <ArrowUpRightIcon size={16} />
                )}
                Arus Transaksi
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-md border-primary/20 bg-primary/10 px-2 py-1 text-xs font-bold text-primary"
                >
                  {typeLabels[transactionData.transactionType] ||
                    transactionData.transactionType}
                </Badge>
                <Badge
                  variant="outline"
                  className={`rounded-md px-2 py-1 text-xs font-bold ${
                    statusStyles[transactionStatus] || statusStyles.pending
                  }`}
                >
                  {statusLabels[transactionStatus] || transactionStatus}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-background/35 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-black">
                <ReceiptTextIcon size={16} />
                Detail Setoran
              </div>
              <div className="grid gap-2 text-sm">
                <p className="font-bold">
                  {transactionData.transactionType === "deposit"
                    ? transactionData.trash?.trashName || "-"
                    : "Penarikan saldo"}
                </p>
                <p className="text-muted-foreground">
                  {transactionData.transactionType === "deposit"
                    ? `${transactionData.trashWeight || 0} kg`
                    : "Tidak memakai data sampah"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-background/35 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-black">
                <BadgeCheckIcon size={16} />
                Ubah Status
              </div>
              {loading ? (
                <Loader2 className="animate-spin text-primary" size={20} />
              ) : (
                <select
                  value={transactionStatus}
                  onChange={(e) => handleChangeStatus(e.target.value)}
                  disabled={transactionStatus !== "pending"}
                  className="glass-input h-10 w-full rounded-md px-3 text-sm font-bold text-foreground"
                >
                  <option value="pending">Belum Dijual</option>
                  <option value="completed">Sudah Dijual</option>
                  <option value="failed">Dibatalkan</option>
                </select>
              )}
              {transactionStatus !== "pending" ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Status final tidak bisa diubah dari panel ini.
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <DrawerFooter className="items-center border-t border-border/60">
          <RafiHadiyasa />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerTransaction;
