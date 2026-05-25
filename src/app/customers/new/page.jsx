"use client";
import React from "react";
import AddCustomer from "./_components/addCustomer";
import HeaderPage from "@/components/header/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeftIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NewCustomer = () => {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
          <div className="mb-5">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/customers`}>Nasabah</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`#`} className="font-semibold text-foreground">
                    Nasabah Baru
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <UserPlusIcon size={14} />
                Pendaftaran
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Tambah Nasabah Baru
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Masukan data nasabah yang akan menjadi bagian dari Bank Sampah
                Anda
              </p>
            </div>
            <Link href="/customers">
              <Button
                variant="outline"
                className="h-10 gap-2 border-border/70 bg-background/60 font-bold"
              >
                <ArrowLeftIcon size={16} />
                Kembali
              </Button>
            </Link>
          </div>
        </section>
        <AddCustomer />
      </main>
    </div>
  );
};

export default NewCustomer;
