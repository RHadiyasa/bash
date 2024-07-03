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
import { Edit, Loader2, LucideEye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import { Badge } from "@/components/ui/badge";
import { updateTransactionStatus } from "@/modules/users/services/transaction.service";

const TransactionTable = ({ transactionData, router }) => {
  const [transactions, setTransactions] = useState([]);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [loadingFailed, setLoadingFailed] = useState(false);

  useEffect(() => {
    const sortedTransactions = [...transactionData].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    setTransactions(sortedTransactions);
  }, [transactionData, transactions.transactionStatus]);

  const gotoDetails = (transactionId) => {
    router.push(`/transactions/${transactionId}`);
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
      const updatedTransactions = transactions.map((transaction) =>
        transaction._id === transactionId
          ? { ...transaction, transactionStatus: newStatus }
          : transaction
      );

      setTransactions(updatedTransactions);
    } catch (error) {
      console.error("Failed to update transaction status", error);
    } finally {
      setLoadingCompleted(false);
      setLoadingFailed(false);
    }
  };

  return (
    <Table className="text-[8pt] sm:text-[9pt] md:text-sm">
      <TableHeader>
        <TableRow>
          <TableHead className="hidden md:table-cell text-center">
            Rekening
          </TableHead>
          <TableHead className="text-center">Nama Nasabah</TableHead>
          <TableHead className="text-center">Jenis</TableHead>
          <TableHead className="hidden lg:table-cell text-center">
            Status
          </TableHead>
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
              <Popover>
                <PopoverTrigger asChild>
                  {transaction.transactionStatus === "pending" ? (
                    <Button className="size-0 bg-transparent hover:bg-transparent">
                      <Badge
                        className={
                          "bg-transparent text-white hover:text-black border-white text-[8pt]"
                        }
                      >
                        {transaction.transactionStatus}
                      </Badge>
                    </Button>
                  ) : transaction.transactionStatus === "failed" ? (
                    <Badge
                      className={
                        "bg-red-800 text-white hover:text-black border-white text-[8pt]"
                      }
                    >
                      {transaction.transactionStatus}
                    </Badge>
                  ) : (
                    <Badge
                      className={
                        "bg-green-800 text-white hover:text-black border-white text-[8pt]"
                      }
                    >
                      {transaction.transactionStatus}
                    </Badge>
                  )}
                </PopoverTrigger>
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
                          Selesai
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
                          Gagal
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
            <TableCell className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Link
                    href={"#"}
                    className="p-2 hover:bg-white/5 hover:rounded-md"
                  >
                    <MoreHorizontal size={20} />
                  </Link>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  className="w-auto backdrop-blur-sm bg-black/50 shadow-white/20 shadow-inner"
                >
                  <Button
                    onClick={() => gotoDetails(transaction._id)}
                    variant="border "
                    className="flex items-center w-full justify-start gap-2 text-sm py-2 hover:bg-white/5 rounded-md p-3 pr-10"
                  >
                    <LucideEye size={18} />
                    Liat detail
                  </Button>
                  <Button
                    onClick={changeStatus}
                    variant="border "
                    className="flex items-center w-full justify-start gap-2 text-sm py-2 hover:bg-white/5 rounded-md p-3 pr-10"
                  >
                    <Edit size={18} />
                    Ubah Status
                  </Button>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
