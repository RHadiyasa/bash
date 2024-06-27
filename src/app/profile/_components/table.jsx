import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ArrowUpRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TableTransaksi = () => {
  return (
    <Card className="bg-[#09090B]">
      <CardHeader className="grid md:flex flex-row justify-between gap-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-bold">Transaksi</CardTitle>
          <CardDescription className="font-normal text-sm">
            Daftar transaksi terbaru
          </CardDescription>
        </div>
        <div>
          <Link href={"/transactions"}>
            <Button className="gap-1 md:gap-2 text-[8pt] md:text-sm">
              Liat Seluruh Transaksi
              <ArrowUpRight size={15} />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table className="text-[7pt] md:text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Tanggal</TableHead>
              <TableHead className="font-bold">Nama</TableHead>
              <TableHead className="font-bold hidden md:flex items-center">Berat (kg)</TableHead>
              <TableHead className="font-bold">Nilai Transaksi</TableHead>
              <TableHead className="font-bold">Jenis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>21 Juni 2024</TableCell>
              <TableCell>Rafi Hadiyasa</TableCell>
              <TableCell className="hidden md:flex items-center">30 kg</TableCell>
              <TableCell >Rp. 32,500</TableCell>
              <TableCell>Deposit</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>21 Juni 2024</TableCell>
              <TableCell>Rafi Hadiyasa</TableCell>
              <TableCell className="hidden md:flex items-center">30 kg</TableCell>
              <TableCell>Rp. 32,500</TableCell>
              <TableCell>Deposit</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>21 Juni 2024</TableCell>
              <TableCell>Rafi Hadiyasa</TableCell>
              <TableCell className="hidden md:flex items-center">30 kg</TableCell>
              <TableCell>Rp. 32,500</TableCell>
              <TableCell>Deposit</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>21 Juni 2024</TableCell>
              <TableCell>Rafi Hadiyasa</TableCell>
              <TableCell className="hidden md:flex items-center">30 kg</TableCell>
              <TableCell>Rp. 32,500</TableCell>
              <TableCell>Deposit</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>21 Juni 2024</TableCell>
              <TableCell>Rafi Hadiyasa</TableCell>
              <TableCell className="hidden md:flex items-center">30 kg</TableCell>
              <TableCell>Rp. 32,500</TableCell>
              <TableCell>Deposit</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>21 Juni 2024</TableCell>
              <TableCell>Rafi Hadiyasa</TableCell>
              <TableCell className="hidden md:flex items-center">30 kg</TableCell>
              <TableCell>Rp. 32,500</TableCell>
              <TableCell>Deposit</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TableTransaksi;
