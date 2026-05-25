import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactionByCustomerId } from "@/modules/services/transaction.service";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import formatRupiah from "@/lib/helpers/formatRupiah";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusStyles = {
  pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-200",
  completed:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
  failed: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200",
};

const statusLabels = {
  deposit: {
    pending: "Belum Dijual",
    completed: "Sudah Dijual",
    failed: "Dibatalkan",
  },
  withdraw: {
    pending: "Pending",
    completed: "Selesai",
    failed: "Dibatalkan",
  },
};

const typeLabels = {
  deposit: "Deposit",
  withdraw: "Tarik Tunai",
};

const CustomerTransactions = ({ customer }) => {
  const [customerTransaction, setCustomerTransaction] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("all");
  const isDepositView = type === "deposit";
  const isWithdrawView = type === "withdraw";
  const columnCount = isWithdrawView ? 4 : 5;

  const typeTabs = [
    { value: "all", label: "Semua" },
    { value: "deposit", label: "Deposit" },
    { value: "withdraw", label: "Tarik Tunai" },
  ];

  const typeLabel =
    typeTabs.find((item) => item.value === type)?.label || "Semua";

  const loadCustomerTransaction = useCallback(async () => {
    setLoading(true);
    try {
      const token = process.env.TOKEN_SECRET;
      const { transactions, totalPages, currentPage } =
        await getTransactionByCustomerId(customer._id, token, page, 5, type);

      if (!transactions) {
        toast.error("Transaksi tidak ditemukan");
      } else {
        setTotalPages(totalPages);
        setPage(currentPage);
        setCustomerTransaction(transactions);
      }
    } finally {
      setLoading(false);
    }
  }, [customer._id, page, type]);

  useEffect(() => {
    if (customer && customer._id) {
      loadCustomerTransaction();
    }
  }, [customer, loadCustomerTransaction]);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleTypeChange = (nextType) => {
    setType(nextType);
    setPage(1);
  };

  const getStatusLabel = (transaction) => {
    const labels = statusLabels[transaction.transactionType] || {};

    return (
      labels[transaction.transactionStatus] || transaction.transactionStatus
    );
  };

  const renderHeader = () => {
    if (isDepositView) {
      return (
        <TableRow className="border-y bg-muted/35 hover:bg-muted/35">
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Tanggal Setor
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Sampah
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Berat
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Status Jual
          </TableHead>
          <TableHead className="text-right font-bold uppercase tracking-[0.12em]">
            Nilai Setor
          </TableHead>
        </TableRow>
      );
    }

    if (isWithdrawView) {
      return (
        <TableRow className="border-y bg-muted/35 hover:bg-muted/35">
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Tanggal Tarik
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Status Tarik
          </TableHead>
          <TableHead className="text-right font-bold uppercase tracking-[0.12em]">
            Nominal Tarik
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Keterangan
          </TableHead>
        </TableRow>
      );
    }

    return (
      <TableRow className="border-y bg-muted/35 hover:bg-muted/35">
        <TableHead className="font-bold uppercase tracking-[0.12em]">
          Tanggal
        </TableHead>
        <TableHead className="font-bold uppercase tracking-[0.12em]">
          Jenis
        </TableHead>
        <TableHead className="font-bold uppercase tracking-[0.12em]">
          Status
        </TableHead>
        <TableHead className="font-bold uppercase tracking-[0.12em]">
          Detail
        </TableHead>
        <TableHead className="text-right font-bold uppercase tracking-[0.12em]">
          Nilai
        </TableHead>
      </TableRow>
    );
  };

  const renderStatusBadge = (transaction) => (
    <Badge
      variant="outline"
      className={`rounded-md px-2 py-1 text-xs font-bold ${
        statusStyles[transaction.transactionStatus] || statusStyles.pending
      }`}
    >
      {getStatusLabel(transaction)}
    </Badge>
  );

  const renderTransactionRow = (trans) => {
    if (isDepositView) {
      return (
        <TableRow key={trans._id} className="hover:bg-primary/5">
          <TableCell className="whitespace-nowrap text-muted-foreground">
            {formatDateToIndonesian(trans.createdAt)}
          </TableCell>
          <TableCell className="max-w-[240px] truncate font-semibold">
            {trans.trash?.trashName || "-"}
          </TableCell>
          <TableCell className="whitespace-nowrap font-semibold">
            {trans.trashWeight || 0} kg
          </TableCell>
          <TableCell>{renderStatusBadge(trans)}</TableCell>
          <TableCell className="whitespace-nowrap text-right font-extrabold">
            {formatRupiah(trans.transactionAmount)}
          </TableCell>
        </TableRow>
      );
    }

    if (isWithdrawView) {
      return (
        <TableRow key={trans._id} className="hover:bg-primary/5">
          <TableCell className="whitespace-nowrap text-muted-foreground">
            {formatDateToIndonesian(trans.createdAt)}
          </TableCell>
          <TableCell>{renderStatusBadge(trans)}</TableCell>
          <TableCell className="whitespace-nowrap text-right font-extrabold text-amber-700 dark:text-amber-200">
            {formatRupiah(trans.transactionAmount)}
          </TableCell>
          <TableCell>
            <div className="grid gap-1">
              <span className="font-semibold">Penarikan saldo</span>
              <span className="text-[11px] text-muted-foreground">
                Dana keluar dari saldo aktif nasabah
              </span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow key={trans._id} className="hover:bg-primary/5">
        <TableCell className="whitespace-nowrap text-muted-foreground">
          {formatDateToIndonesian(trans.createdAt)}
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className="rounded-md border-primary/20 bg-primary/10 px-2 py-1 text-xs font-bold text-primary"
          >
            {typeLabels[trans.transactionType] || trans.transactionType}
          </Badge>
        </TableCell>
        <TableCell>{renderStatusBadge(trans)}</TableCell>
        <TableCell className="max-w-[260px]">
          <div className="grid gap-1">
            <span className="truncate font-semibold">
              {trans.transactionType === "deposit"
                ? trans.trash?.trashName || "-"
                : "Penarikan saldo"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {trans.transactionType === "deposit"
                ? `${trans.trashWeight || 0} kg`
                : "Tarik tunai"}
            </span>
          </div>
        </TableCell>
        <TableCell className="whitespace-nowrap text-right font-extrabold">
          {formatRupiah(trans.transactionAmount)}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div>
      <div className="mb-4 grid gap-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-extrabold">Riwayat Transaksi</div>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Menampilkan transaksi {typeLabel.toLowerCase()} nasabah
            </p>
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            Halaman {page} dari {totalPages}
          </div>
        </div>
        <Tabs value={type} onValueChange={handleTypeChange}>
          <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-lg border border-border/60 bg-background/60 p-1 shadow-inner">
            {typeTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-md px-3 py-2.5 text-xs font-black data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground sm:text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="overflow-x-auto [scrollbar-color:hsl(var(--primary))_transparent] [scrollbar-width:thin]">
        <Table
          className={`text-xs lg:text-sm ${
            isWithdrawView ? "min-w-[720px]" : "min-w-[840px]"
          }`}
        >
          <TableHeader>{renderHeader()}</TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columnCount}>
                  <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <div>
                        <p className="text-sm font-bold">Memuat transaksi</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Riwayat nasabah sedang disiapkan.
                        </p>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : customerTransaction.length !== 0 ? (
              customerTransaction.map((trans) => renderTransactionRow(trans))
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount}>
                  <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center">
                    <div>
                      <p className="text-sm font-bold">Tidak ada transaksi</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Transaksi {typeLabel.toLowerCase()} nasabah akan tampil
                        di sini.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center gap-2 border-t border-border/60 p-4 lg:justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={handlePreviousPage}
          disabled={page === 1}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeftIcon size={17} />
        </Button>
        <span className="min-w-[116px] rounded-md border border-border/60 bg-background/45 px-3 py-2 text-center text-xs font-bold text-muted-foreground">
          Halaman {page} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={handleNextPage}
          disabled={page === totalPages}
          aria-label="Halaman berikutnya"
        >
          <ChevronRightIcon size={17} />
        </Button>
      </div>
    </div>
  );
};

export default CustomerTransactions;
