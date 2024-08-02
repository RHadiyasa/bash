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
import Link from "next/link";
import { ArrowUpCircleIcon, Loader2 } from "lucide-react";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { updateTransactionStatus } from "@/modules/services/transaction.service";
import RafiHadiyasa from "@/components/copyright";

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
        {transactionStatus === "completed" ? (
          <Link
            href={"#"}
            className="rounded-full bg-green-600 hover:bg-white/5 hover:rounded-full"
          >
            <ArrowUpCircleIcon
              className="text-transparent lg:text-white"
              size={20}
            />
          </Link>
        ) : transactionStatus === "failed" ? (
          <Link
            href={"#"}
            className="rounded-full bg-red-600 hover:bg-white/5 hover:rounded-full"
          >
            <ArrowUpCircleIcon
              className="text-transparent lg:text-white"
              size={20}
            />
          </Link>
        ) : (
          <Link
            href={"#"}
            className="rounded-full hover:bg-white/5 hover:rounded-full"
          >
            <ArrowUpCircleIcon className="text-white" size={20} />
          </Link>
        )}
      </DrawerTrigger>
      <DrawerContent className="w-auto backdrop-blur-sm bg-black/50 shadow-white/20">
        <DrawerHeader className={"flex flex-col items-center"}>
          <DrawerTitle>
            <div className="flex items-center justify-center gap-2">
              <div className="text-xl font-bold">Detail Transaction</div>
            </div>
          </DrawerTitle>
          <DrawerDescription>
            Detil transaksi {transactionData._id}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-10">
          <div className="grid grid-cols-2 gap-4 items-center text-xs lg:text-sm">
            <div className="text-right">Nama :</div>
            <div>{transactionData.customer?.fullName || "deleted"}</div>
            <div className="text-right font-semibold">Rekening :</div>
            <div>{transactionData.customer?.accountNumber || "deleted"}</div>
            <div className="text-right font-semibold">Jenis :</div>
            <div>{transactionData.transactionType}</div>
            <div className="text-right font-semibold">Status :</div>
            <div>
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <select
                  value={transactionStatus}
                  onChange={(e) => handleChangeStatus(e.target.value)}
                  className="bg-black text-white border border-gray-600 rounded-full px-3 p-1"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              )}
            </div>
            <div className="text-right font-semibold">Tanggal :</div>
            <div>{formatDateToIndonesian(transactionData.createdAt)}</div>
            {transactionData.transactionType === "deposit" && (
              <>
                <div className="text-right font-semibold">Sampah :</div>
                <div>{transactionData.trash?.trashName}</div>
                <div className="text-right font-semibold">Berat (kg) :</div>
                <div>{transactionData.trashWeight} kg</div>
              </>
            )}
            <div className="text-right font-semibold">Nilai (Rp) :</div>
            <div>{formatRupiah(transactionData.transactionAmount)}</div>
          </div>
        </div>
        <DrawerFooter className={"items-center"}>
          <RafiHadiyasa />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerTransaction;
