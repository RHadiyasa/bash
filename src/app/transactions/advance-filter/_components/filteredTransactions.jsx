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

const FilteredTransactions = ({ transactions }) => {
  return (
    <Table className="mt-5">
      <TableHeader>
        <TableRow>
          <TableHead>Tanggal</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Jenis Transaksi</TableHead>
          <TableHead>Jenis sampah</TableHead>
          <TableHead>Nominal</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions &&
          transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>
                {formatDateToIndonesian(transaction.createdAt)}
              </TableCell>
              <TableCell>
                {transaction.customer?.fullName ? (
                  transaction.customer?.fullName
                ) : (
                  <span>Deleted</span>
                )}
              </TableCell>
              <TableCell>{transaction.transactionType}</TableCell>
              <TableCell>
                {transaction.transactionType === "deposit"
                  ? transaction.trash?.trashName
                  : "Tarik Tunai"}
              </TableCell>
              <TableCell>
                {formatRupiah(transaction.transactionAmount)}
              </TableCell>
              <TableCell>{transaction.transactionStatus}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default FilteredTransactions;
