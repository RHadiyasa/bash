import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { Loader2 } from "lucide-react";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import { Badge } from "@/components/ui/badge";
import { updateTransactionStatus } from "@/modules/users/services/transaction.service";
import DrawerTransaction from "./drawerTransaction";

const TransactionTable = ({ transactionData }) => {
  const [transactions, setTransactions] = useState([]);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const [open, setOpen] = useState(null);

  console.log(transactions.length);

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
    if (newStatus === "completed") {
      setLoadingCompleted(true);
    }
    if (newStatus === "failed") {
      setLoadingFailed(true);
    }
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
      setLoadingCompleted(false);
      setLoadingFailed(false);
      setOpen(null);
    }
  };

  const handlePopoverOpenChange = (transactionId, isOpen) => {
    setOpen(isOpen ? transactionId : null);
  };

  return (
    <Table className="text-[8pt] sm:text-[9pt] md:text-sm">
      <TableHeader>
        <TableRow>
          <TableHead className="hidden md:table-cell text-center">
            Tanggal
          </TableHead>
          <TableHead className="text-center">Nama Nasabah</TableHead>
          <TableHead className="hidden lg:table-cell text-center">
            Jenis
          </TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="hidden sm:table-cell text-center">
            Sampah
          </TableHead>
          <TableHead className="hidden lg:table-cell text-center">
            Berat (kg)
          </TableHead>
          <TableHead className="text-center">Nilai (Rp)</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow
            key={transaction._id}
            className={
              !transaction.customer?.accountNumber
                ? "bg-red-700/30 font-extralight"
                : transaction.transactionType === "deposit"
                ? ""
                : "bg-green-400/10 font-semibold hover:text-white"
            }
          >
            <TableCell className="hidden md:table-cell text-center">
              {formatDateToIndonesian(transaction?.createdAt) ? (
                formatDateToIndonesian(transaction.createdAt)
              ) : (
                <span>Deleted</span>
              )}
            </TableCell>
            <TableCell className="text-center">
              {transaction.customer?.fullName ? (
                transaction.customer?.fullName
              ) : (
                <span>Deleted</span>
              )}
            </TableCell>
            <TableCell className="text-center">
              {transaction.transactionType}
            </TableCell>
            <TableCell className="hidden lg:table-cell text-center">
              <Popover
                open={open === transaction._id}
                onOpenChange={(isOpen) =>
                  handlePopoverOpenChange(transaction._id, isOpen)
                }
              >
                {transaction.transactionStatus === "pending" ? (
                  <PopoverTrigger asChild>
                    <Button
                      onClick={() =>
                        handlePopoverOpenChange(
                          transaction._id,
                          open !== transaction._id
                        )
                      }
                      className="bg-transparent hover:bg-transparent size-0"
                    >
                      <Badge
                        className={
                          "bg-transparent text-white hover:text-black border-white text-[8pt] py-1"
                        }
                      >
                        <div className="hidden lg:flex">
                          {transaction.transactionStatus}
                        </div>
                      </Badge>
                    </Button>
                  </PopoverTrigger>
                ) : transaction.transactionStatus === "failed" ? (
                  <Badge
                    className={
                      "bg-red-800 text-white hover:text-black border-white text-[8pt] py-1"
                    }
                  >
                    <div className="hidden lg:flex">
                      {transaction.transactionStatus}
                    </div>
                  </Badge>
                ) : (
                  <Badge
                    className={
                      "bg-green-800 text-white hover:text-black border-white text-[8pt] py-1"
                    }
                  >
                    <div className="hidden lg:flex">
                      {transaction.transactionStatus}
                    </div>
                  </Badge>
                )}
                <PopoverContent className="flex items-center gap-4 w-auto">
                  <div className="text-center text-xs font-semibold">
                    Ubah Status
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    {loadingCompleted ? (
                      <div className="text-xs bg-green-800 p-1 px-8 rounded-full border-2 border-white/70">
                        <Loader2 className="animate-spin" size={15} />
                      </div>
                    ) : (
                      <Button
                        className="bg-transparent hover:bg-transparent"
                        size={10}
                        onClick={() =>
                          changeStatus(transaction._id, "completed")
                        }
                      >
                        <Badge
                          className={
                            "bg-green-800 text-white hover:text-black border-white text-[8pt] w-20 justify-center"
                          }
                        >
                          <div>Completed</div>
                        </Badge>
                      </Button>
                    )}
                    {loadingFailed ? (
                      <div className="text-xs bg-red-800 p-1 px-8 rounded-full border-2 border-white/70">
                        <Loader2 className="animate-spin" size={15} />
                      </div>
                    ) : (
                      <Button
                        className="bg-transparent hover:bg-transparent"
                        size={10}
                        onClick={() => changeStatus(transaction._id, "failed")}
                      >
                        <Badge
                          className={
                            "bg-red-800 text-white hover:text-black border-white text-[8pt] w-20 justify-center"
                          }
                        >
                          <div>Failed</div>
                        </Badge>
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
            <TableCell className="hidden sm:table-cell text-center">
              {transaction.transactionType === "deposit"
                ? transaction.trash?.trashName
                : "Tarik Tunai"}
            </TableCell>
            <TableCell className="hidden lg:table-cell text-center">
              {transaction.transactionType === "deposit" ? (
                <span>{transaction.trashWeight} kg</span>
              ) : (
                "Tarik Tunai"
              )}
            </TableCell>
            <TableCell className="text-left pl-5">
              {formatRupiah(transaction.transactionAmount)}
            </TableCell>
            <TableCell className="flex">
              <DrawerTransaction
                transactionData={transaction}
                onUpdateTransaction={handleUpdateTransaction}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
