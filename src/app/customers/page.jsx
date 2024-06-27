import RafiHadiyasa from "@/components/copyright";
import TableListCustomer from "@/components/customer/viewCustomerList";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import React from "react";

const CustomerPage = () => {
  return (
    <div className="bg-[#151518] min-h-screen">
      <HeaderPage />
      <div className="py-6 px-5 md:px-24 grid gap-4">
        <div className="flex items-center gap-2 ">
          <Search className="w-auto" size={20} />
          <Input
            type="search"
            placeholder="Cari Nasabah..."
            className="w-1/2 md:w-auto rounded-xl bg-[#09090B]"
          />
          
          <Button className="text-[9pt] md:text-sm font-semibold rounded-xl hover:bg-white/30 hover:text-white ml-3">
            Cari Nasabah
          </Button>
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
              <Button className="flex gap-2 items-center hover:bg-white/30 hover:text-white h-8 md:h-auto">
                <Plus className="rounded-xl" size={15} />
                <div className="font-semibold text-[9pt] md:text-sm">
                  Tambah Nasabah
                </div>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TableListCustomer />
          </CardContent>
        </Card>
        <RafiHadiyasa />
      </div>
    </div>
  );
};

export default CustomerPage;
