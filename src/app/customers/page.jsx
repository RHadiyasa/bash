"use client";
import RafiHadiyasa from "@/components/copyright";
import HeaderPage from "@/components/header/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import TableListCustomer from "./_components/tableListCustomer";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableDeletedCustomers from "./_components/tableListDeletedCustomer";

const CustomerPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("active");

  const onTriggerValue = (newValue) => {
    setValue(newValue);
  };

  const loadingTrigger = () => {
    setLoading(true);
  };

  return (
    <div className="bg-[#151518] min-h-screen">
      <HeaderPage />
      <div className="py-10 md:px-8 lg:px-10 min-[1540px]:px-60 grid gap-4">
        <div className="flex items-center justify-center md:justify-start gap-4 ml-2">
          <div className="flex items-center justify-center gap-3">
            <Search className="w-auto" size={20} />
            <Input
              type="search"
              value={searchTerm}
              placeholder="Cari Nasabah..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-[#09090B]"
            />
          </div>
        </div>
        <Card className="bg-[#09090B] md:p-5">
          <CardHeader className="grid gap-2 md:flex flex-row justify-between">
            <div className="grid">
              <span className="font-bold text-xl">Nasabah</span>
              <span className="font-normal text-[9pt] md:text-sm text-white/60">
                Daftar nasabah yang terdaftar di Bank Sampah
              </span>
            </div>
            <div>
              <Link href={"/customers/new"}>
                <Button
                  onClick={loadingTrigger}
                  className="flex gap-2 items-center bg-white hover:bg-white/30 hover:text-white h-8 md:h-auto"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin disabled:true" />
                  ) : (
                    <div className="flex items-center gap-1">
                      <Plus className="rounded-xl" size={15} />
                      <div className="font-semibold text-[9pt] md:text-sm">
                        Tambah Nasabah
                      </div>
                    </div>
                  )}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={value}>
              <div className="flex justify-center md:justify-start">
                <TabsList className="items-center">
                  <TabsTrigger
                    onClick={() => onTriggerValue("active")}
                    className="text-[9pt] md:text-sm"
                    value="active"
                  >
                    Nasabah Aktif
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => onTriggerValue("inactive")}
                    className="text-[9pt] md:text-sm"
                    value="inactive"
                  >
                    Nasabah Non-Aktif
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent className="mt-5" value="active">
                <TableListCustomer router={router} searchTerm={searchTerm} />
              </TabsContent>
              <TabsContent className="mt-5" value="inactive">
                <TableDeletedCustomers
                  router={router}
                  searchTerm={searchTerm}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <RafiHadiyasa />
      </div>
    </div>
  );
};

export default CustomerPage;
