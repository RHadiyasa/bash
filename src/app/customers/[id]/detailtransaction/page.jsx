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
import React, { useEffect, useState } from "react";
import CustomerTransactions from "./_components/customerTransactions";
import AddTransaction from "./_components/addTransaction";
import { getUserDetail } from "@/modules/services/user.service";
import toast from "react-hot-toast";

const DetailTransaction = () => {
  const { id } = useParams();
  const [bankSampah, setBankSampah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const router = useRouter();

  const loadCustomerDetail = async () => {
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
  };

  const onAddTransaction = () => {
    loadCustomerDetail();
  };

  useEffect(() => {
    loadCustomerDetail();
  }, []);

  if (!customer) {
    return <LoadingPage message={"Loading transaksi..."} />;
  }

  return (
    <div className="min-h-screen bg-earth bg-cover bg-fixed bg-center">
      <HeaderPage />
      <div className="grid lg:flex px-8 md:px-14 py-5 pb-10 gap-10">
        <div className=" w-full">
          <div className="py-5">
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
                  <BreadcrumbLink className="font-semibold text-white text-xs md:text-sm">
                    Detail Transaksi
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center justify-between gap-10">
            <div className="text-md lg:text-2xl font-bold">
              Detail Transaction {customer.fullName}
            </div>
            <AddTransaction
              customer={customer}
              bankSampah={bankSampah}
              onAddTransaction={onAddTransaction}
            />
          </div>
          <div className="mt-5">
            <CustomerTransactions
              customer={customer}
              onAddTransaction={onAddTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTransaction;
