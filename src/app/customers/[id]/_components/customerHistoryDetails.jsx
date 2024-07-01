import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GrTransaction } from "react-icons/gr";
import React from "react";
import Link from "next/link";

const CustomerHistoryDetails = ({ customerData }) => {
  console.log(customerData);
  return (
    <div className="grid">
      <Link href={`/customers/${customerData._id}/detailtransaction`}>
        <div className="flex items-center gap-1 text-sm p-2">
          Detail transaksi <GrTransaction />
        </div>
      </Link>
      <Card>
        <CardHeader className="bg-[#09090B] rounded-t-xl">
          <div className="font-semibold">
            History Transaksi {customerData.fullName}
          </div>
        </CardHeader>
      </Card>
      <div className="h-auto grid gap-2 py-4 px-4 border-x">
        <div className="bg-white py-2 px-5 text-black font-semibold text-sm rounded-lg flex items-center gap-2 justify-between">
          <div>Setor</div>
          <div className="font-normal">Rp. 10,000</div>
        </div>
        <div className="bg-white py-2 px-5 text-black font-semibold text-sm rounded-lg flex items-center gap-2 justify-between">
          <div>Setor</div>
          <div className="font-normal">Rp. 15,000</div>
        </div>
        <div className="bg-red-400 py-2 px-5 text-black font-semibold text-sm rounded-lg flex items-center gap-2 justify-between">
          <div>Tarik</div>
          <div className="font-normal">Rp. 20,000</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHistoryDetails;
