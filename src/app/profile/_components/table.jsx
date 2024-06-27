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
  const fetchTrashes = async () => {
    try {
      const response = await axios.get("/api/users/trash", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setTrashes(response.data.trashes);
      } else {
        toast.error("Gagal memuat sampah");
      }

      // fetch untuk kategori
    } catch (error) {
      return console.error(error);
    }
  };

  return (
    <Card className="bg-[#09090B]">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-bold">Transaksi</CardTitle>
          <CardDescription className="font-normal text-sm">
            Daftar transaksi terbaru
          </CardDescription>
        </div>
        <div>
          <Link href={"/transactions"}>
            <Button className="gap-2">
              Liat Seluruh Transaksi
              <ArrowUpRight size={20} />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Tanggal</TableHead>
              <TableHead className="font-bold">Nama</TableHead>
              <TableHead className="font-bold">Berat (kg)</TableHead>
              <TableHead className="font-bold">Nilai Transaksi</TableHead>
              <TableHead className="font-bold">Jenis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>21 Juni 2024</TableCell>
              <TableCell>Rafi Hadiyasa</TableCell>
              <TableCell>30 kg</TableCell>
              <TableCell>Rp. 32,500</TableCell>
              <TableCell>Deposit</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>21 Juni 2024</TableCell>
              <TableCell>Rafi Hadiyasa</TableCell>
              <TableCell>30 kg</TableCell>
              <TableCell>Rp. 32,500</TableCell>
              <TableCell>Deposit</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>21 Juni 2024</TableCell>
              <TableCell>Rafi Hadiyasa</TableCell>
              <TableCell>30 kg</TableCell>
              <TableCell>Rp. 32,500</TableCell>
              <TableCell>Deposit</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>21 Juni 2024</TableCell>
              <TableCell>Rafi Hadiyasa</TableCell>
              <TableCell>30 kg</TableCell>
              <TableCell>Rp. 32,500</TableCell>
              <TableCell>Deposit</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>21 Juni 2024</TableCell>
              <TableCell>Rafi Hadiyasa</TableCell>
              <TableCell>30 kg</TableCell>
              <TableCell>Rp. 32,500</TableCell>
              <TableCell>Deposit</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>21 Juni 2024</TableCell>
              <TableCell>Rafi Hadiyasa</TableCell>
              <TableCell>30 kg</TableCell>
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
