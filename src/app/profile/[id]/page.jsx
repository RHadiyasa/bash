"use client";

import RafiHadiyasa from "@/components/copyright";
import Customer from "@/components/customers";
import DashboardCard from "@/components/dashboard-card";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  CoinsIcon,
  HandCoinsIcon,
  PackageOpen,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";

const ProfilePage = () => {
  return (
    <div className="bg-[#151518] min-h-screen">
      <HeaderPage />
      <div className="px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:w-auto xl:flex-row mt-10 gap-5">
          <DashboardCard
            title={"Total Tabungan"}
            number={"Rp. 64,432,400"}
            type={",-"}
            icon={<CoinsIcon />}
          />
          <DashboardCard
            title={"Total Sampah"}
            number={"5,503"}
            type={"kilogram"}
            icon={<PackageOpen />}
          />
          <DashboardCard
            title={"Total Nasabah"}
            number={"300"}
            type={"Nasabah"}
            icon={<Users2Icon />}
          />
          <DashboardCard
            title={"Total Transaksi"}
            number={"2,340"}
            type={"Transaksi"}
            icon={<HandCoinsIcon />}
          />
        </div>
        <div className="flex flex-col xl:flex-row justify-between gap-5 mt-10">
          <div className="basis-2/3">
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
                      <TableHead className="font-bold">
                        Nilai Transaksi
                      </TableHead>
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
          </div>
          <div className="basis-1/3">
            <Card className="bg-[#09090B]">
              <CardHeader>
                <CardTitle>Top 10</CardTitle>
                <CardDescription>
                  10 nasabah terbaik berdasarkan jumlah transaksi
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent>
                <Customer
                  no={"1"}
                  name={"Rafi Hadiyasa"}
                  email={"rafihadiyasa32@gmail.com"}
                  transaction={"68 Transaksi"}
                />
                <Customer
                  no={"2"}
                  name={"Rani Afifah Salsabila"}
                  email={"raniafifah@gmail.com"}
                  transaction={"54 Transaksi"}
                />
                <Customer
                  no={"3"}
                  name={"Rahma Haifa"}
                  email={"rahmahaifa@gmail.com"}
                  transaction={"32 Transaksi"}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <RafiHadiyasa />
      </div>
    </div>
  );
};

export default ProfilePage;
