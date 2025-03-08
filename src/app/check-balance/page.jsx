"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useCustomersData from "@/hooks/useCustomersData";
import formatNumber from "@/lib/helpers/formatNumber";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { getCustomerAsPublic } from "@/modules/services/public.service";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const CheckBalance = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [publicData, setPublicdata] = useState(null);

  const handleCheckBalance = async () => {
    try {
      setLoading(true);
      setPublicdata(null);
      const customerData = await getCustomerAsPublic(username, accountNumber);
      if (!customerData) {
        setPublicdata(null);
        return;
      }
      setPublicdata(customerData);
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat memeriksa saldo");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setPublicdata(null);
    setUsername("");
    setAccountNumber("");
  };

  return (
    <div className="grid md:flex bg-earth min-h-screen">
      <Toaster position="top-center" />
      {loading ? (
        <div className="min-h-screen w-full flex items-center justify-center">
          <Loader2 size={48} className="animate-spin text-white" />
        </div>
      ) : publicData ? (
        <div className="min-h-screen bg-black/50 w-full flex items-center md:justify-center">
          <div>
            <div className="text-center text-3xl font-semibold">
              {publicData.username}
            </div>
            <div className="grid p-10 gap-5 xl:grid-cols-3 md:text-center">
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
            <div className="grid px-10 xl:flex xl:items-center xl:justify-center gap-10 md:text-center">
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
            <div className="text-center mt-10">
              <Button onClick={handleBack}>Kembali</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-full flex items-center justify-center">
          <div className="flex-col xl:w-1/4 md:w-1/2 w-3/4">
            <div className="text-2xl font-bold text-center">Cek Saldo Nasabah </div>
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
              <Button onClick={handleCheckBalance} className="mt-5 gap-2">
                Check Saldo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckBalance;
