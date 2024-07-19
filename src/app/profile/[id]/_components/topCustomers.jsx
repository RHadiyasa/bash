import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import formatNumber from "@/lib/helpers/formatNumber";
import DetailTopCustomer from "./detailsTopCustomer";
import { ScrollArea } from "@/components/ui/scroll-area";

const TopCustomers = ({ topCustomers }) => {
  return (
    <Card className="bg-black/30 w-full lg:w-2/5">
      <CardHeader>
        <CardTitle>Top 10</CardTitle>
        <CardDescription>10 Nasabah terbaik</CardDescription>
      </CardHeader>
      <Separator />
      <ScrollArea className="h-[380px]">
        <CardContent>
          {topCustomers.map((customer, index) => (
            <DetailTopCustomer
              key={index}
              no={index + 1}
              name={customer.name}
              id={customer.id} // Jika Anda ingin menampilkan email, tambahkan properti email di calculateTopCustomers
              transaction={`${formatNumber(customer.totalWeight)} kg`}
            />
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default TopCustomers;
