import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
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
    <DialogContent className="w-[85%] backdrop-blur bg-white/5 rounded-2xl md:w-[50%] grid justify-center">
      <DialogHeader className="items-center">
        <DialogTitle className="text-md md:text-lg">
          Delete Customer {customer.fullName}
        </DialogTitle>
        <DialogDescription className="text-center">
          Apakah Anda yakin ingin menghapus customer{" "}
          <span className="font-semibold text-yellow-200">{customer.fullName}</span>{" "}
          dengan rekening{" "}
          <span className="font-semibold text-yellow-200">
            {customer.accountNumber}
          </span>
        </DialogDescription>
      </DialogHeader>
      <div className="grid md:flex justify-center gap-2 mt-2">
        <Button className="w-full" onClick={onConfirmDelete}>Hapus Customer</Button>
        <Button className="w-full" variant="destructive">Batal</Button>
      </div>
    </DialogContent>
  );
};

export default DeleteCustomer;
