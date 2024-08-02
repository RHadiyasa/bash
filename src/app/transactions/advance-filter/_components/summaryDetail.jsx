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
import toPascalCase from "@/lib/helpers/toPascalCase";
import React from "react";
import { BsFilePdfFill } from "react-icons/bs";

const SummaryDetail = ({
  uniqueCustomers,
  totalWeightPerTrashType,
  uniqueStatus,
  uniqueType,
}) => {
  return (
    <div>
      <div className="grid gap-10">
        <div className="flex items-start justify-center gap-10">
          <div className="grid w-2/5 px-5">
            <div>
              <div className="text-left font-semibold">List Nasabah</div>
              <Separator className="my-2" />
              <ScrollArea className="h-[200px] border-b px-2">
                <ul className="list-decimal list-inside text-left">
                  {uniqueCustomers.map((customer, index) => (
                    <li key={index}>{toPascalCase(customer)}</li>
                  ))} 
                </ul>
              </ScrollArea>
            </div>
            <div className="mt-5">
              <div className="text-left font-semibold">Status</div>
              <ul className="list-disc list-inside text-left">
                {uniqueStatus.map((status, index) => (
                  <li key={index}>{toPascalCase(status)}</li>
                ))}
              </ul>
            </div>
            <div className="mt-5">
              <div className="text-left font-semibold">Jenis Transaksi</div>
              <ul className="list-disc list-inside text-left">
                {uniqueType.map((type, index) => (
                  <li key={index}>{toPascalCase(type)}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-2/5">
            <div className="text-left font-semibold">Daftar Sampah</div>
            <Separator className="my-2" />
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Sampah</TableHead>
                    <TableHead className="text-left">Berat (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(totalWeightPerTrashType).map(
                    ([trashName, weight]) => (
                      <TableRow key={trashName}>
                        <TableCell className="text-left">{trashName}</TableCell>
                        <TableCell className="text-left">
                          {formatNumber(weight)} kg
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
        <Button className="flex items-center justify-center gap-2">
          <BsFilePdfFill size={18} /> <span>Export data to PDF</span> 
        </Button>
      </div>
    </div>
  );
};

export default SummaryDetail;
