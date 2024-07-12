import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";

const DeleteAllTransaction = ({
  open,
  setOpen,
  confirmationDelete,
  onConfirmationdelete,
  deleteValidation,
}) => {
  return (
    <div className="grid items-center justify-center gap-2 mt-10">
      <div className="flex items-center justify-center text-red-500 font-base font-mono">
        Developer Only
      </div>
      <Dialog open={open} onOpenChange={() => setOpen(true)}>
        <DialogTrigger asChild>
          <Button variant="destructive" className="font-mono hover:scale-105">Delete All Transactions</Button>
        </DialogTrigger>
        <DialogContent className="w-3/4 rounded-xl bg-black/5 backdrop-blur-sm">
          <DialogTitle>
            <div className="text-center">
              Hapus Semua Transaksi Bank Sampah Anda
            </div>
            <DialogDescription className="text-center text-xs mt-2">
              Seluruh transaksi yang dihapus tidak dapat dikembalikan. Ketik
              "Hapus Transaksi" untuk menghapus seluruh transaksi.
            </DialogDescription>
          </DialogTitle>
          <Input
            placeholder="Hapus Transaksi"
            value={confirmationDelete}
            onChange={(event) => onConfirmationdelete(event)}
          />
          <Button onClick={deleteValidation} variant="destructive">
            Hapus Transaksi
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteAllTransaction;
