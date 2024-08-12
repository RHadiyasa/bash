"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useCustomersData from "@/hooks/useCustomersData";
import formatNumber from "@/lib/helpers/formatNumber";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { getCustomerAsPublic } from "@/modules/services/public.service";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const CheckBalance = () => {
  const [username, setUsername] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [publicData, setPublicdata] = useState([]);

  const handleCheckBalance = async () => {
    try {
      const customerData = await getCustomerAsPublic(username, accountNumber);
      if (!customerData) {
        setPublicdata([]);
        return;
      }
      setPublicdata(customerData);
    } catch (error) {
      console.error(error);
    }
  };

  // username accountNumber balance bankSampah fullName totalDeposit totalWeight totalWithdraw _id

  return (
    <div className="grid md:flex bg-earth min-h-screen">
      <Toaster position="top-center" />
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex-col w-1/2">
          <div className="text-2xl font-bold text-center">Check Saldo</div>
          <Separator className="my-4 bg-white/20" />
          <div className="grid gap-2">
            <div className="grid gap-2">
              <div className="font-semibold">Username</div>
              <Input
                value={username}
                className="bg-black/20 transparent"
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="font-semibold">Rekening</div>
              <Input
                value={accountNumber}
                className="bg-black/20 transparent"
                onChange={(event) => setAccountNumber(event.target.value)}
              />
            </div>
            <Button onClick={handleCheckBalance} className="mt-5">
              Check Saldo
            </Button>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-black/50 w-full flex items-center xl:justify-center">
        {publicData.length === 0 ? (
          ""
        ) : (
          <div>
            <div className="text-center text-3xl font-semibold">{publicData.username}</div>
            <div className="grid p-10 gap-5 xl:grid-cols-3 xl:text-center">
              <div>
                <div className="text-sm font-bold">Nama Nasabah</div>
                <div className="text-xl">{publicData.fullName}</div>
              </div>
              <div>
                <div className="text-sm font-bold">No Rekening</div>
                <div className="text-xl">{publicData.accountNumber}</div>
              </div>
              <div>
                <div className="text-sm font-bold">Bank Sampah</div>
                <div className="text-xl">{publicData.bankSampah?.name}</div>
              </div>
            </div>
            <div className="grid px-10 xl:flex xl:items-center xl:justify-center gap-10 xl:text-center">
              <div>
                <div className="text-sm font-bold">Saldo Nasabah</div>
                <div className="text-3xl">
                  {formatRupiah(publicData.balance)}
                </div>
              </div>
              <div>
                <div className="text-sm font-bold">Total Berat Sampah</div>
                <div className="text-3xl">
                  {formatNumber(publicData.totalWeight)}{" "}
                  <span className="text-base">Kg</span>{" "}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckBalance;
