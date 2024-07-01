"use client";
import HeaderPage from "@/components/header";
import { getCustomerDetails } from "@/modules/users/services/customer.service";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams, useRouter } from "next/navigation";
import LoadingPage from "@/components/loadingPage";
import DetailCustomer from "./_components/detailCustomer";
import NotFoundPage from "@/components/notFound";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import CustomerHistoryDetails from "./_components/customerHistoryDetails";
import CustomerTransactionOverview from "./_components/customerTransactionOverview";

const CustomerPageDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [customer, setCustomer] = useState(null);

  const loadCustomerDetail = async () => {
    try {
      const token = process.env.TOKEN_SECRET;
      const customerData = await getCustomerDetails(id, token);

      if (!customerData) {
        console.log("erorr masuk disini");
        setNotFound(true);
        return;
      }
      setCustomer(customerData);
    } catch (error) {
      console.error("An error occurred while fetching customer data");
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadCustomerDetail();
  }, [id, router]);

  if (notFound) {
    return <NotFoundPage />;
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-[#151518]">
      <HeaderPage />
      <div className="grid lg:flex px-5 md:px-14 py-5 pb-10 gap-10">
        <div className=" w-full lg:w-2/3">
          <div className="py-5">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/customers`}>Nasabah</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`#`}
                    className="font-semibold text-white"
                  >
                    {customer.fullName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-4 font-bold text-2xl">
            <Link href={`/customers`}>
              <div className="flex items-center gap-3">
                <ChevronLeftIcon
                  className="bg-[#09090B] text-foreground p-1 rounded-md border"
                  size={30}
                />
              </div>
            </Link>
            {customer.fullName}
          </div>
          <DetailCustomer dataCustomer={customer} onDataUpdated={loadCustomerDetail}/>
        </div>
        <div className="bg-[#151518] w-full lg:w-1/3">
          <div className="grid gap-5">
            <div className="font-semibold text-3xl mt-5">Overview</div>
            <CustomerTransactionOverview customerData={customer} />
            <div>
              <CustomerHistoryDetails customerData={customer} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPageDetails;
