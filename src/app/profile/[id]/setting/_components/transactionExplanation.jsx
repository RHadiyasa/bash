import React from "react";
import { LucideArrowBigDownDash, Minus, MoveRight, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import RafiHadiyasa from "@/components/copyright";

const TransactionExplanation = () => {
  return (
    <div>
      <div className="text-lg md:text-xl lg:text-2xl font-bold text-center mt-5">
        Skema Biaya Transaksi
      </div>
      <Separator className="my-4" />
      <div className="grid md:flex gap-5 justify-center md:justify-between px-5 md:px-10 text-sm">
        <div>Sampah A : Rp. 3000 /kg</div>
        <div>Sampah B : Rp. 4000 /kg</div>
        <div>Sampah C : Rp. 5000 /kg</div>
      </div>

      <Separator className="my-4" />
      <div className="px-5 md:px-10 text-sm my-3">
        <div className="grid md:flex gap-2">
          <div className="flex items-center gap-2">
            <div className="font-semibold">Nilai Transaksi</div>
            <MoveRight className="hidden md:flex" size={18} />
          </div>
          <ul className="text-xs lg:text-sm">
            <li>- Sampah A (3 kg) + Sampah B (5 kg) + Sampah C (2 kg)</li>
            <li>- Rp. 9,000 + Rp. 20,000 + Rp. 10,000</li>
            <li className="font-bold text-yellow-200">
              - Nilai Transaksi = Rp. 39,000
            </li>
          </ul>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-center gap-1 font-semibold">
        <LucideArrowBigDownDash size={14} /> Dasar perhitungan
      </div>
      <div className="grid lg:flex items-start justify-center mt-5">
        <div className="grid gap-2 md:justify-between text-sm px-5 md:px-10">
          <div>
            <div>Keuntungan Pengurus:</div>
            <div className="flex gap-1 items-center font-semibold">
              Nilai Transaksi <X size={12} /> Biaya Transaksi (%)
            </div>
          </div>
          <div>
            <div>Deposit Nasabah:</div>
            <div className="flex gap-1 items-center font-semibold">
              Nilai Transaksi <Minus size={12} /> Keuntungan Pengurus
            </div>
          </div>
        </div>
        <Separator className="flex lg:hidden my-4" />
        <div className="px-5 md:px-10">
          <div className="font-bold text-base">Contoh Kasus</div>
          <div className="text-xs">Diasumsikan biaya transaksi 10%</div>
          <div className="grid gap-2 text-sm mt-3">
            <div>
              <div>Keuntungan Pengurus:</div>
              <div className="flex gap-1 items-center font-semibold">
                Rp. 39,000 <X size={12} /> 10% = Rp. 3,900
              </div>
            </div>
            <div>
              <div>Deposit Nasabah:</div>
              <div className="flex gap-1 items-center font-semibold">
                Rp. 39,000 <Minus size={12} /> Rp. 3,900 = Rp. 35,100
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-10">
        <RafiHadiyasa />
      </div>
    </div>
  );
};

export default TransactionExplanation;
