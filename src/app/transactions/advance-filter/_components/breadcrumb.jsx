import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const TransactionsBreadcrum = ({ page }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="px-5 md:px-0">
        <BreadcrumbItem>
          <BreadcrumbLink href={`/transactions`}>Transaksi</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`#`} className="font-semibold text-white">
            {page}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default TransactionsBreadcrum;
