import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

// terima data username sama ID dari viewCustomerList
const DeleteCustomer = ({ customer, onConfirmDelete }) => {
  if (!customer) {
    return null;
  }

  return (
    <DialogContent className="glass-card grid !w-[min(94vw,460px)] justify-center rounded-lg p-6 text-center">
      <DialogHeader className="items-center text-center">
        <DialogTitle className="text-xl font-extrabold">
          Hapus Nasabah {customer.fullName}
        </DialogTitle>
        <DialogDescription className="text-center">
          Apakah Anda yakin ingin menghapus customer{" "}
          <span className="font-bold text-foreground">{customer.fullName}</span>{" "}
          dengan rekening{" "}
          <span className="font-bold text-foreground">
            {customer.accountNumber}
          </span>
        </DialogDescription>
      </DialogHeader>
      <div className="mt-2 grid w-full gap-2 sm:grid-cols-2">
        <DialogClose asChild>
          <Button
            className="w-full font-bold"
            variant="destructive"
            onClick={onConfirmDelete}
          >
            Hapus Customer
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button className="w-full bg-background/60" variant="outline">
            Batal
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

export default DeleteCustomer;
