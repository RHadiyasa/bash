import React from "react";
import { Separator } from "@/components/ui/separator";
import formatRupiah from "@/lib/helpers/formatRupiah";

const Summary = ({ totals }) => (
  <div>
    <h2 className="text-xl lg:text-3xl font-bold text-center mb-5">
      Transaction Summary
    </h2>
    <div className="text-white">
      <div className="grid items-center justify-center gap-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-right">Berat Total</div>
          <div>: {totals.totalWeight.toFixed(2)} kg</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-right">Total Nilai Transaksi</div>
          <div>: {formatRupiah(totals.totalPrice)}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-right">Jumlah Nasabah</div>
          <div>: {totals.totalTransactions}</div>
        </div>
      </div>

      <Separator className="my-3 mt-5" />
      <h3 className="text-lg lg:text-xl text-center font-bold">
        Detail Nasabah
      </h3>
      <Separator className="my-3" />

      {Object.entries(totals.customerTotals).map(([customer, data]) => (
        <div className="grid grid-cols-3 gap-2" key={customer}>
          <div className="flex-row md:flex gap-2">
            <div>Nama:</div>
            <div className="font-bold">{customer.split("-")[0]}</div>
          </div>
          <div className="flex-row md:flex gap-2">
            <div>Berat Sampah:</div>
            <div className="font-bold">
              {data.totalWeight.toFixed(2) <= 0 ? (
                <div className="text-red-500 animate-pulse">Error</div>
              ) : (
                `${data.totalWeight.toFixed(2)} kg`
              )}
            </div>
          </div>
          <div className="flex-row md:flex gap-2">
            <div>Nilai Transaksi:</div>
            <div className="font-bold">{formatRupiah(data.totalPrice)}</div>
          </div>
        </div>
      ))}

      <Separator className="my-3 mt-5" />
      <h3 className="text-lg lg:text-xl text-center font-bold">
        Detail Setiap Sampah
      </h3>
      <Separator className="my-3" />

      {Object.entries(totals.trashTotals).map(([trash, data]) => (
        <div className="grid grid-cols-3 gap-2" key={trash}>
          <div className="flex-row md:flex items-center md:gap-2">
            <div className="font-normal text-sm">Sampah: </div>
            <div className="font-bold text-xs">{trash.split("-")[0]}</div>
          </div>
          <div className="flex-row md:flex items-center md:gap-2">
            <div className="font-normal text-sm">Berat: </div>
            <div className="flex font-bold text-xs">
              {data.totalWeight.toFixed(2) <= 0 ? (
                <div className="text-red-500 animate-pulse">Error</div>
              ) : (
                `${data.totalWeight.toFixed(2)} kg`
              )}
            </div>
          </div>
          <div className="flex-row md:flex items-center md:gap-2">
            <div className="font-normal text-sm">Harga: </div>
            <div className="font-bold text-xs">
              {data.totalPrice <= 0 ? (
                <div className="text-red-500 animate-pulse">Error</div>
              ) : (
                formatRupiah(data.totalPrice)
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Summary;
