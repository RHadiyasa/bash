"use client"
import React from "react";
import AddCustomer from "./_components/addCustomer";
import HeaderPage from "@/components/header/header";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const NewCustomer = () => {
  return (
    <div className="min-h-screen bg-[#151518]">
      <HeaderPage />
      <div className="px-5 md:px-10 pb-10">
        <div className="py-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/customers`}>Nasabah</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`#`} className="font-semibold text-white">
                  Nasabah Baru
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="w-full md:w-2/3">
          <Card className="bg-[#09090B] w-auto">
            <CardHeader className="flex flex-col w-[auto]">
              <span className="font-bold text-md md:text-xl">
                Tambah Nasabah Baru
              </span>
              <span className="font-normal text-[9pt] md:text-sm text-white/60">
                Masukan data nasabah yang akan menjadi bagian dari Bank Sampah
                Anda
              </span>
            </CardHeader>
          </Card>
          <AddCustomer />
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;
