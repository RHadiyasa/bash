import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatNumber from "@/lib/helpers/formatNumber";
import formatRupiah from "@/lib/helpers/formatRupiah";
import toPascalCase from "@/lib/helpers/toPascalCase";
import React from "react";
import { BsFilePdfFill } from "react-icons/bs";

const SummaryDetail = ({
  uniqueCustomers,
  totalWeightPerTrashType,
  totalAmountPerTrashType,
  uniqueStatus,
  uniqueType,
  totalWeight,
  totalAmount,
}) => {
  return (
    <div className="grid gap-6">
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="grid gap-4">
          <div className="rounded-lg border border-border/60 bg-background/45 p-4">
            <div className="text-left font-extrabold">List Nasabah</div>
            <Separator className="my-3" />
            <ScrollArea className="h-[200px]">
              <ul className="grid gap-2 text-left text-sm">
                {uniqueCustomers.map((customer, index) => (
                  <li key={index} className="rounded-md bg-background/60 p-2">
                    {toPascalCase(customer)}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/45 p-4">
            <div className="text-left font-extrabold">Status</div>
            <ul className="mt-3 grid gap-2 text-left text-sm">
              {uniqueStatus.map((status, index) => (
                <li key={index}>{toPascalCase(status)}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/45 p-4">
            <div className="text-left font-extrabold">Jenis Transaksi</div>
            <ul className="mt-3 grid gap-2 text-left text-sm">
              {uniqueType.map((type, index) => (
                <li key={index}>{toPascalCase(type)}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/45 p-4">
          <div className="text-left font-extrabold">Daftar Sampah</div>
          <Separator className="my-3" />
          <ScrollArea className="h-[360px]">
            <Table className="min-w-[520px]">
              <TableHeader>
                <TableRow className="bg-muted/35 hover:bg-muted/35">
                  <TableHead>Sampah</TableHead>
                  <TableHead>Berat</TableHead>
                  <TableHead>Nilai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(totalWeightPerTrashType).map(
                  ([trashName, weight]) => (
                    <TableRow key={trashName}>
                      <TableCell className="font-bold">{trashName}</TableCell>
                      <TableCell>{formatNumber(weight)} kg</TableCell>
                      <TableCell>
                        {formatRupiah(totalAmountPerTrashType[trashName] || 0)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className="mt-5 grid gap-2 text-right">
            <div className="rounded-md border border-border/60 bg-background/60 px-4 py-3 font-bold">
              Total Berat: {formatNumber(totalWeight)} Kg
            </div>
            <div className="rounded-md border border-border/60 bg-background/60 px-4 py-3 font-bold">
              Grand Total: {formatRupiah(totalAmount)}
            </div>
          </div>
        </div>
      </div>
      <Button className="flex items-center justify-center gap-2 font-bold">
        <BsFilePdfFill size={18} /> <span>Export data to PDF</span>
      </Button>
    </div>
  );
};

export default SummaryDetail;
