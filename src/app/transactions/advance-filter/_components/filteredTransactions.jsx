import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { Badge } from "@/components/ui/badge";

const FilteredTransactions = ({ transactions }) => {
  return (
    <Table className="mt-5 min-w-[820px] text-xs lg:text-sm">
      <TableHeader>
        <TableRow className="border-y bg-muted/35 hover:bg-muted/35">
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Tanggal
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Nama
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Jenis
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Sampah
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Nominal
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TableRow key={transaction._id} className="hover:bg-primary/5">
              <TableCell className="text-muted-foreground">
                {formatDateToIndonesian(transaction.createdAt)}
              </TableCell>
              <TableCell className="font-bold">
                {transaction.customer?.fullName || "Deleted"}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="rounded-md border-primary/20 bg-primary/10 px-2 py-1 text-xs font-bold text-primary"
                >
                  {transaction.transactionType}
                </Badge>
              </TableCell>
              <TableCell>
                {transaction.transactionType === "deposit"
                  ? transaction.trash?.trashName
                  : "Tarik Tunai"}
              </TableCell>
              <TableCell className="font-extrabold">
                {formatRupiah(transaction.transactionAmount)}
              </TableCell>
              <TableCell>{transaction.transactionStatus}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6}>
              <div className="rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center text-sm font-bold">
                Tidak ada transaksi
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default FilteredTransactions;
