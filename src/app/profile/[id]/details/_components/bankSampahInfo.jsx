import React, { useEffect, useState } from "react";
import CardProfile from "./cardProfile";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { Separator } from "@/components/ui/separator";
import { BsPercent, BsPerson } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { GrTransaction } from "react-icons/gr";
import { BiMoney } from "react-icons/bi";

const BankSampahInfo = ({ bankSampahProfile, transactions, customers }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bankSampahProfile) {
      setLoading(false);
    }
  }, [bankSampahProfile]);

  return (
    <div>
      <div className="text-xl text-center font-bold">
        Semua Tentang Bank Sampah Anda
      </div>
      <Separator className="my-4" />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 text-center text-sm font-semibold">
          <div className="grid gap-2 w-full">
            <div className="flex items-center gap-1">
              <BsPerson />
              <span>Nama Bank Sampah</span>
            </div>
            <CardProfile attribute={bankSampahProfile.name?.length === 0 ? "Belum Ada" : bankSampahProfile.name} />
          </div>
          <div className="grid gap-2 w-full">
            <div className="flex items-center gap-1">
              <MdEmail />
              <span>Email</span>
            </div>
            <CardProfile attribute={bankSampahProfile.email} />
          </div>
          <div className="grid gap-2 w-full">
            <div className="flex items-center gap-1">
              <IoPeopleSharp />
              <span>Total Nasabah</span>
            </div>
            <div>
              <CardProfile attribute={customers?.length + " Nasabah"} />
            </div>
          </div>
          <div className="grid gap-2 w-full">
            <div className="flex items-center gap-1">
              <GrTransaction />
              <span>Total Transaksi</span>
            </div>
            <div>
              <CardProfile attribute={transactions?.length + " Transaksi"} />
            </div>
          </div>
          <div className="grid gap-2 w-full">
            <div className="flex items-center gap-1">
              <BiMoney />
              <span>Pendapatan (Revenue)</span>
            </div>

            <CardProfile
              attribute={formatRupiah(bankSampahProfile.revenue ?? 0)}
            />
          </div>
          <div className="grid gap-2 w-full">
            <div className="flex items-center gap-1">
              <BsPercent />
              <span>Transaction Fee</span>
            </div>
            <div>
              <CardProfile
                attribute={bankSampahProfile.transactionFee + " %"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankSampahInfo;
