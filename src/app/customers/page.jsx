"use client";
import RafiHadiyasa from "@/components/copyright";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import TableListCustomer from "./_components/viewCustomerList";
import { useRouter } from "next/navigation";

const CustomerPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    console.log("Mencari nasabah dengan kata kunci:", searchTerm);
    // Logic pencarian lebih lanjut bisa ditambahkan di sini
  };

  return (
    <div className="bg-[#151518] min-h-screen">
      <HeaderPage />
      <div className="py-6 px-5 md:px-8 lg:px-10 grid gap-4">
        <div className="flex items-center gap-4 ml-2">
          <Search className="w-auto" size={20} />
          <Input
            type="search"
            value={searchTerm}
            placeholder="Cari Nasabah..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 md:w-auto rounded-xl bg-[#09090B]"
          />
        </div>
        <Card className="bg-[#09090B] p-1 md:p-5">
          <CardHeader className="grid gap-2 md:flex flex-row justify-between">
            <div className="grid">
              <span className="font-bold text-xl">Nasabah</span>
              <span className="font-normal text-[9pt] md:text-sm text-white/60">
                Daftar nasabah yang terdaftar di Bank Sampah
              </span>
            </div>
            <div>
              <Link href={"/customers/new"}>
                <Button className="flex gap-2 items-center hover:bg-white/30 hover:text-white h-8 md:h-auto">
                  <Plus className="rounded-xl" size={15} />
                  <div className="font-semibold text-[9pt] md:text-sm">
                    Tambah Nasabah
                  </div>
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <TableListCustomer router={router} searchTerm={searchTerm} />
          </CardContent>
        </Card>
        <RafiHadiyasa />
      </div>
    </div>
  );
};

export default CustomerPage;
