import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactionByCustomerId } from "@/modules/users/services/transaction.service";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import formatRupiah from "@/lib/helpers/formatRupiah";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";

const CustomerTransactions = ({ customer }) => {
  const [customerTransaction, setCustomerTransaction] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadCustomerTransaction = async () => {
    const token = process.env.TOKEN_SECRET;
    const { transactions, totalPages, currentPage } =
      await getTransactionByCustomerId(customer._id, token, page, 5);

    if (!transactions) {
      toast.error("Transaksi tidak ditemukan");
    } else {
      setTotalPages(totalPages);
      setPage(currentPage);
      setCustomerTransaction(transactions);
    }
  };

  useEffect(() => {
    if (customer && customer._id) {
      loadCustomerTransaction();
    }
  }, [customer, page]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // console.log("customerTransaction : ", customerTransaction);

  return (
    <div className="mt-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-auto py-5">Tanggal Transaksi</TableHead>
            <TableHead className="w-auto py-5 hidden lg:table-cell">
              Jenis
            </TableHead>
            <TableHead className="hidden lg:table-cell w-auto py-5">
              Status
            </TableHead>
            <TableHead className="w-auto py-5">Sampah</TableHead>
            <TableHead className="w-auto py-5">Berat</TableHead>
            <TableHead className="w-auto py-5">Nilai (Rp.)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customerTransaction.length !== 0 ? (
            customerTransaction.map((trans) => (
              <TableRow key={trans._id}>
                <TableCell className="pl-10 py-8">
                  {formatDateToIndonesian(trans.createdAt)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {trans.transactionType}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge className={"bg-yellow-200 text-xs font-bold px-4"}>
                    {trans.transactionStatus}
                  </Badge>
                </TableCell>
                <TableCell>{trans.trash?.trashName}</TableCell>
                <TableCell>{trans.trashWeight} Kg</TableCell>
                <TableCell>{formatRupiah(trans.transactionAmount)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center font-semibold">Tidak ada transaksi</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end items-center p-4 gap-5">
        <Button
          className="bg-transparent text-white hover:bg-white/10"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          <GrPrevious size={15} />
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          className="bg-transparent text-white hover:bg-black/30"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          <GrNext size={15} />
        </Button>
      </div>
    </div>
  );
};

export default CustomerTransactions;
