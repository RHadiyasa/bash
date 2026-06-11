import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useMemo, useState } from "react";
import formatRupiah from "@/lib/helpers/formatRupiah";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  Loader2,
  XCircleIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import { Badge } from "@/components/ui/badge";
import { updateTransactionStatus } from "@/modules/services/transaction.service";
import DrawerTransaction from "./drawerTransaction";

const statusStyles = {
  pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-200",
  completed:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
  failed: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200",
};

const typeStyles = {
  deposit:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
  withdraw:
    "border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200",
};

const statusLabels = {
  pending: "Belum Dijual",
  completed: "Sudah Dijual",
  failed: "Dibatalkan",
};

const withdrawStatusLabels = {
  pending: "Pending",
  completed: "Selesai",
  failed: "Dibatalkan",
};

const typeLabels = {
  deposit: "Deposit",
  withdraw: "Tarik Tunai",
};

const typeIcons = {
  deposit: ArrowDownLeftIcon,
  withdraw: ArrowUpRightIcon,
};

const TransactionTable = ({
  transactionData,
  searchTerm,
  value,
  type,
  loading,
}) => {
  const [transactions, setTransactions] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const [open, setOpen] = useState(null);
  const isDepositView = type === "deposit";
  const isWithdrawView = type === "withdraw";
  const columnCount = isWithdrawView ? 6 : 7;

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm?.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const statusMatch =
        value === "all" || transaction.transactionStatus === value;
      const searchMatch = normalizedSearch
        ? [
            transaction.customer?.fullName,
            transaction.customer?.accountNumber,
            transaction.transactionType,
            transaction.transactionStatus,
          ]
            .filter(Boolean)
            .some((item) =>
              String(item).toLowerCase().includes(normalizedSearch)
            )
        : true;

      return statusMatch && searchMatch;
    });
  }, [searchTerm, transactions, value]);

  useEffect(() => {
    const sortedTransactions = [...transactionData].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    setTransactions(sortedTransactions);
  }, [transactionData]);

  const handleUpdateTransaction = (updatedTransaction) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction._id === updatedTransaction._id
        ? {
            ...transaction,
            transactionStatus: updatedTransaction.transactionStatus,
          }
        : transaction
    );
    setTransactions(updatedTransactions);
  };

  const changeStatus = async (transactionId, newStatus) => {
    setLoadingStatus(`${transactionId}-${newStatus}`);
    try {
      await updateTransactionStatus(transactionId, newStatus);
      const updatedTransaction = transactions.find(
        (transaction) => transaction._id === transactionId
      );
      if (updatedTransaction) {
        handleUpdateTransaction({
          ...updatedTransaction,
          transactionStatus: newStatus,
        });
      }
    } catch (error) {
      console.error("Failed to update transaction status", error);
    } finally {
      setLoadingStatus(null);
      setOpen(null);
    }
  };

  const handlePopoverOpenChange = (transactionId, isOpen) => {
    setOpen(isOpen ? transactionId : null);
  };

  const getStatusLabel = (transaction) => {
    const labels =
      transaction.transactionType === "deposit"
        ? statusLabels
        : withdrawStatusLabels;

    return labels[transaction.transactionStatus] || transaction.transactionStatus;
  };

  const renderStatusBadge = (transaction) => {
    const status = transaction.transactionStatus;
    const isDeposit = transaction.transactionType === "deposit";
    const badge = (
      <Badge
        variant="outline"
        className={`rounded-md px-2 py-1 text-xs font-bold ${
          statusStyles[status] || statusStyles.pending
        }`}
      >
        {getStatusLabel(transaction)}
      </Badge>
    );

    if (status !== "pending") return badge;

    return (
      <Popover
        open={open === transaction._id}
        onOpenChange={(isOpen) => handlePopoverOpenChange(transaction._id, isOpen)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto p-0 hover:bg-transparent"
            aria-label={`Ubah status transaksi ${transaction._id}`}
          >
            {badge}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          className="glass-card grid !w-[min(90vw,320px)] gap-3 rounded-lg p-4"
        >
          <div>
            <p className="text-sm font-extrabold">Ubah Status</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isDeposit
                ? "Tandai status penjualan sampah ke pengepul."
                : "Tandai status transaksi tarik tunai nasabah."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="h-10 gap-2 font-bold"
              onClick={() => changeStatus(transaction._id, "completed")}
              disabled={Boolean(loadingStatus)}
            >
              {loadingStatus === `${transaction._id}-completed` ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2Icon className="h-4 w-4" />
              )}
              {isDeposit ? "Sudah Dijual" : "Selesaikan"}
            </Button>
            <Button
              variant="destructive"
              className="h-10 gap-2 font-bold"
              onClick={() => changeStatus(transaction._id, "failed")}
              disabled={Boolean(loadingStatus)}
            >
              {loadingStatus === `${transaction._id}-failed` ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircleIcon className="h-4 w-4" />
              )}
              Batalkan
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const renderHeader = () => {
    if (isDepositView) {
      return (
        <TableRow className="border-b bg-muted/35 hover:bg-muted/35">
          <TableHead className="w-[190px] font-bold uppercase tracking-[0.12em]">
            Tanggal Setor
          </TableHead>
          <TableHead className="w-[260px] font-bold uppercase tracking-[0.12em]">
            Nasabah
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Sampah
          </TableHead>
          <TableHead className="w-[120px] font-bold uppercase tracking-[0.12em]">
            Berat
          </TableHead>
          <TableHead className="w-[150px] font-bold uppercase tracking-[0.12em]">
            Status Jual
          </TableHead>
          <TableHead className="w-[150px] text-right font-bold uppercase tracking-[0.12em]">
            Nilai Setor
          </TableHead>
          <TableHead className="w-[90px] text-right">Action</TableHead>
        </TableRow>
      );
    }

    if (isWithdrawView) {
      return (
        <TableRow className="border-b bg-muted/35 hover:bg-muted/35">
          <TableHead className="w-[190px] font-bold uppercase tracking-[0.12em]">
            Tanggal Tarik
          </TableHead>
          <TableHead className="w-[260px] font-bold uppercase tracking-[0.12em]">
            Nasabah
          </TableHead>
          <TableHead className="w-[160px] font-bold uppercase tracking-[0.12em]">
            Status Tarik
          </TableHead>
          <TableHead className="w-[170px] text-right font-bold uppercase tracking-[0.12em]">
            Nominal Tarik
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Keterangan
          </TableHead>
          <TableHead className="w-[90px] text-right">Action</TableHead>
        </TableRow>
      );
    }

    return (
      <TableRow className="border-b bg-muted/35 hover:bg-muted/35">
        <TableHead className="w-[190px] font-bold uppercase tracking-[0.12em]">
          Tanggal
        </TableHead>
        <TableHead className="w-[260px] font-bold uppercase tracking-[0.12em]">
          Nasabah
        </TableHead>
        <TableHead className="w-[160px] font-bold uppercase tracking-[0.12em]">
          Jenis
        </TableHead>
        <TableHead className="w-[140px] font-bold uppercase tracking-[0.12em]">
          Status
        </TableHead>
        <TableHead className="font-bold uppercase tracking-[0.12em]">
          Detail
        </TableHead>
        <TableHead className="w-[150px] text-right font-bold uppercase tracking-[0.12em]">
          Nilai
        </TableHead>
        <TableHead className="w-[90px] text-right">Action</TableHead>
      </TableRow>
    );
  };

  const renderCustomerCell = (transaction) => (
    <TableCell className="align-top">
      <div className="grid gap-1">
        <span className="font-bold">
          {transaction.customer?.fullName || "Deleted"}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {transaction.customer?.accountNumber || "Nasabah dihapus"}
        </span>
      </div>
    </TableCell>
  );

  const renderActionCell = (transaction) => (
    <TableCell className="align-top">
      <div className="flex justify-end">
        <DrawerTransaction
          transactionData={transaction}
          onUpdateTransaction={handleUpdateTransaction}
        />
      </div>
    </TableCell>
  );

  const renderTransactionRow = (transaction) => {
    const TypeIcon =
      typeIcons[transaction.transactionType] || ArrowDownLeftIcon;

    if (isDepositView) {
      return (
        <TableRow
          key={transaction._id}
          className={`border-b border-border/40 hover:bg-primary/5 ${
            !transaction.customer?.accountNumber ? "bg-red-500/5" : ""
          }`}
        >
          <TableCell className="align-top text-muted-foreground">
            {transaction?.createdAt ? (
              formatDateToIndonesian(transaction.createdAt)
            ) : (
              <span>Deleted</span>
            )}
          </TableCell>
          {renderCustomerCell(transaction)}
          <TableCell className="align-top">
            <div className="grid gap-1">
              <span className="font-semibold">
                {transaction.trash?.trashName || "-"}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Setoran sampah nasabah
              </span>
            </div>
          </TableCell>
          <TableCell className="align-top font-semibold">
            {transaction.trashWeight || 0} kg
          </TableCell>
          <TableCell className="align-top">
            {renderStatusBadge(transaction)}
          </TableCell>
          <TableCell className="align-top text-right font-bold">
            {formatRupiah(transaction.transactionAmount)}
          </TableCell>
          {renderActionCell(transaction)}
        </TableRow>
      );
    }

    if (isWithdrawView) {
      return (
        <TableRow
          key={transaction._id}
          className={`border-b border-border/40 hover:bg-primary/5 ${
            !transaction.customer?.accountNumber ? "bg-red-500/5" : ""
          }`}
        >
          <TableCell className="align-top text-muted-foreground">
            {transaction?.createdAt ? (
              formatDateToIndonesian(transaction.createdAt)
            ) : (
              <span>Deleted</span>
            )}
          </TableCell>
          {renderCustomerCell(transaction)}
          <TableCell className="align-top">
            {renderStatusBadge(transaction)}
          </TableCell>
          <TableCell className="align-top text-right font-bold text-amber-700 dark:text-amber-200">
            {formatRupiah(transaction.transactionAmount)}
          </TableCell>
          <TableCell className="align-top">
            <div className="grid gap-1">
              <span className="font-semibold">Penarikan saldo</span>
              <span className="text-[11px] text-muted-foreground">
                Dana keluar dari saldo aktif nasabah
              </span>
            </div>
          </TableCell>
          {renderActionCell(transaction)}
        </TableRow>
      );
    }

    return (
      <TableRow
        key={transaction._id}
        className={`border-b border-border/40 hover:bg-primary/5 ${
          !transaction.customer?.accountNumber ? "bg-red-500/5" : ""
        }`}
      >
        <TableCell className="align-top text-muted-foreground">
          {transaction?.createdAt ? (
            formatDateToIndonesian(transaction.createdAt)
          ) : (
            <span>Deleted</span>
          )}
        </TableCell>
        {renderCustomerCell(transaction)}
        <TableCell className="align-top">
          <Badge
            variant="outline"
            className={`gap-1.5 rounded-md px-2 py-1 text-xs font-bold ${
              typeStyles[transaction.transactionType] || typeStyles.deposit
            }`}
          >
            <TypeIcon size={13} />
            {typeLabels[transaction.transactionType] ||
              transaction.transactionType}
          </Badge>
        </TableCell>
        <TableCell className="align-top">
          {renderStatusBadge(transaction)}
        </TableCell>
        <TableCell className="align-top">
          <div className="grid gap-1">
            <span className="font-semibold">
              {transaction.transactionType === "deposit"
                ? transaction.trash?.trashName || "-"
                : "Penarikan saldo"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {transaction.transactionType === "deposit"
                ? `${transaction.trashWeight || 0} kg`
                : "Tidak memakai data sampah"}
            </span>
          </div>
        </TableCell>
        <TableCell className="align-top text-right font-bold">
          {formatRupiah(transaction.transactionAmount)}
        </TableCell>
        {renderActionCell(transaction)}
      </TableRow>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <Table
        className={`text-xs lg:text-sm ${
          isWithdrawView ? "min-w-[860px]" : "min-w-[980px]"
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
                        Riwayat transaksi sedang disiapkan.
                      </p>
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) =>
              renderTransactionRow(transaction)
            )
          ) : (
            <TableRow>
              <TableCell colSpan={columnCount}>
                <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center">
                  <div>
                    <p className="text-sm font-bold">Tidak ada transaksi</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Transaksi yang sesuai filter akan muncul di sini.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
