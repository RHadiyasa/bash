import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import formatNumber from "@/lib/helpers/formatNumber";
import DetailTopCustomer from "./detailsTopCustomer";
import { ScrollArea } from "@/components/ui/scroll-area";

const TopCustomers = ({ topCustomers }) => {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="border-b border-border/60">
        <CardTitle className="text-xl font-black tracking-normal">
          Top 10 Nasabah
        </CardTitle>
        <CardDescription>10 Nasabah terbaik</CardDescription>
      </CardHeader>
      <ScrollArea className="h-[380px]">
        <CardContent className="grid gap-3 p-4">
          {topCustomers.length === 0 ? (
            <div className="rounded-lg border border-border/60 bg-background/40 p-5 text-sm font-semibold text-muted-foreground">
              Belum ada data nasabah terbaik.
            </div>
          ) : (
            topCustomers.map((customer, index) => (
              <DetailTopCustomer
                key={index}
                no={index + 1}
                name={customer.name}
                id={customer.id}
                transaction={`${formatNumber(customer.totalWeight)} kg`}
              />
            ))
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default TopCustomers;
