"use client";
import HeaderPage from "@/components/header/header";
import LoadingPage from "@/components/loadingPage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCustomerDetails } from "@/modules/services/customer.service";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import CustomerTransactions from "./_components/customerTransactions";
import AddTransaction from "./_components/addTransaction";
import { getUserDetail } from "@/modules/services/user.service";
import toast from "react-hot-toast";
import { ArrowLeftIcon, ReceiptTextIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const DetailTransaction = () => {
  const { id } = useParams();
  const [bankSampah, setBankSampah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const router = useRouter();

  const loadCustomerDetail = useCallback(async () => {
    try {
      const token = process.env.TOKEN_SECRET;
      const customerData = await getCustomerDetails(id, token, router);
      const bankSampahData = await getUserDetail(id, token);

      if (!customerData) {
        toast.error("Customer data tidak ada");
        return;
      }
      setBankSampah(bankSampahData);
      setCustomer(customerData);
    } catch (error) {
      console.error("An error occurred while fetching customer data");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const onAddTransaction = () => {
    loadCustomerDetail();
  };

  useEffect(() => {
    loadCustomerDetail();
  }, [loadCustomerDetail]);

  if (!customer) {
    return <LoadingPage message={"Loading transaksi..."} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
          <div className="mb-5">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/customers`}
                    className="text-xs md:text-sm"
                  >
                    Nasabah
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/customers/${customer._id}`}
                    className="text-xs md:text-sm"
                  >
                    {customer.fullName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-semibold text-foreground text-xs md:text-sm">
                    Detail Transaksi
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <ReceiptTextIcon size={14} />
                Riwayat Nasabah
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Detail Transaksi
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                {customer.fullName} / {customer.accountNumber}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href={`/customers/${customer._id}`}>
                <Button
                  variant="outline"
                  className="h-10 gap-2 border-border/70 bg-background/60 font-bold"
                >
                  <ArrowLeftIcon size={16} />
                  Profil
                </Button>
              </Link>
              <AddTransaction
                customer={customer}
                bankSampah={bankSampah}
                onAddTransaction={onAddTransaction}
              />
            </div>
          </div>
        </section>
        <div className="glass-card rounded-lg p-4">
          <CustomerTransactions
            customer={customer}
            onAddTransaction={onAddTransaction}
          />
        </div>
      </main>
    </div>
  );
};

export default DetailTransaction;
