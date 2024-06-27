"use client";

import RafiHadiyasa from "@/components/copyright";
import Customer from "@/components/customers";
import DashboardCard from "@/components/dashboard-card";
import HeaderPage from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  ArrowUpRight,
  CoinsIcon,
  HandCoinsIcon,
  PackageOpen,
  Users2Icon,
} from "lucide-react";
import TableTransaksi from "../_components/table";

const ProfilePage = () => {
  return (
    <div className="bg-[#151518] min-h-screen">
      <HeaderPage />
      <div className="px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:w-auto xl:flex-row mt-10 gap-2 md:gap-4">
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
            <TableTransaksi />
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
