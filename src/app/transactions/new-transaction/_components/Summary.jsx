import React from "react";
import { Separator } from "@/components/ui/separator";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { ScrollArea } from "@/components/ui/scroll-area";

const Summary = ({ totals }) => (
  <div>
    <h2 className="mb-4 text-center text-xl font-extrabold lg:text-2xl">
      Ringkasan Transaksi
    </h2>
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border border-border/60 bg-background/45 p-4 text-center">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Berat Total
        </div>
        <div className="mt-2 text-lg font-extrabold">
          {totals.totalWeight.toFixed(2)} kg
        </div>
      </div>
      <div className="rounded-lg border border-border/60 bg-background/45 p-4 text-center">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Nilai
        </div>
        <div className="mt-2 text-lg font-extrabold">
          {formatRupiah(totals.totalPrice)}
        </div>
      </div>
      <div className="rounded-lg border border-border/60 bg-background/45 p-4 text-center">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Nasabah
        </div>
        <div className="mt-2 text-lg font-extrabold">
          {totals.totalTransactions}
        </div>
      </div>
    </div>

    <h3 className="mt-6 text-sm font-extrabold">List Nasabah</h3>
    <Separator className="my-3" />
    <ScrollArea className="h-36 rounded-lg border border-border/60 bg-background/45 p-3">
      <div className="grid gap-2">
        {Object.entries(totals.customerTotals).map(([customer, data]) => (
          <div
            className="grid gap-2 rounded-md bg-background/60 p-3 text-xs md:grid-cols-3"
            key={customer}
          >
            <div>
              <span className="text-muted-foreground">Nama: </span>
              <span className="font-bold">{customer.split("-")[0]}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Berat: </span>
              <span className="font-bold">{data.totalWeight.toFixed(2)} kg</span>
            </div>
            <div>
              <span className="text-muted-foreground">Nilai: </span>
              <span className="font-bold">{formatRupiah(data.totalPrice)}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>

    <h3 className="mt-6 text-sm font-extrabold">List Sampah</h3>
    <Separator className="my-3" />
    <ScrollArea className="h-40 rounded-lg border border-border/60 bg-background/45 p-3">
      <div className="grid gap-2">
        {Object.entries(totals.trashTotals).map(([trash, data]) => (
          <div
            className="grid gap-2 rounded-md bg-background/60 p-3 text-xs md:grid-cols-3"
            key={trash}
          >
            <div>
              <span className="text-muted-foreground">Sampah: </span>
              <span className="font-bold">{trash.split("-")[0]}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Berat: </span>
              <span className="font-bold">{data.totalWeight.toFixed(2)} kg</span>
            </div>
            <div>
              <span className="text-muted-foreground">Harga: </span>
              <span className="font-bold">{formatRupiah(data.totalPrice)}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
);

export default Summary;
