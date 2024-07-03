import { Separator } from "@/components/ui/separator";
import formatRupiah from "@/lib/helpers/formatRupiah";
import React from "react";

const CustomerTransactionOverview = ({ customerData, transaction }) => {
  const totalTrashWeight = (transaction.transactions || []).reduce(
    (total, currentTransaction) => {
      return total + (currentTransaction.trashWeight || 0);
    },
    0
  );

  return (
    <div className="grid gap-2">
      <div>
        <div className="text-sm font-semibold p-2">Saldo Nasabah</div>
        <div className="text-3xl font-semibold px-2">
          {formatRupiah(customerData.balance)}
        </div>
      </div>
      <Separator className="my-2" />
      <div className="grid md:grid-cols-2 gap-2">
        <div className="text-center lg:text-left">
          <div className="text-sm font-semibold p-2 text-white/60">
            Total Transaksi
          </div>
          <div className="text-center font-bold bg-[#09090B] px-5 py-2 rounded-lg border">
            {transaction.transactions?.length} Transaksi
          </div>
        </div>
        <div className="text-center lg:text-left">
          <div className="text-sm font-semibold p-2 text-white/60">
            Total Sampah
          </div>
          <div className="text-center font-bold bg-[#09090B] px-5 py-2 rounded-lg border">
            {totalTrashWeight} Kg
          </div>
        </div>
        <div className="text-center lg:text-left">
          <div className="text-sm font-semibold p-2 text-white/60">
            Total Deposit
          </div>
          <div className="text-center font-bold bg-blue-300 text-black px-5 py-2 rounded-lg border">
            {formatRupiah(customerData.totalDeposit)}
          </div>
        </div>
        <div className="text-center lg:text-left">
          <div className="text-sm font-semibold p-2 text-white/60">
            Total Withdraw
          </div>
          <div className="text-center font-bold bg-orange-300 text-black px-5 py-2 rounded-lg border">
            {formatRupiah(customerData.totalWithdraw)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTransactionOverview;
