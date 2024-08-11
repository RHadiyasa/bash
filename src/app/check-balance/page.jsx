"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useCustomersData from "@/hooks/useCustomersData";
import React from "react";

const CheckBalance = () => {

  const handleCheckBalance = async () => {
    try {
      console.log("customers balance");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex bg-earth min-h-screen items-center justify-center">
      <div className="flex-col items-center justify-center w-1/4">
        <div className="text-2xl font-bold text-center">Check Saldo</div>
        <Separator className="my-4 bg-white/20" />
        <div className="grid gap-2">
          <div className="grid gap-2">
            <div className="font-semibold">Username</div>
            <Input className="bg-black/20 transparent" />
          </div>
          <div className="grid gap-2">
            <div className="font-semibold">Rekening</div>
            <Input className="bg-black/20 transparent" />
          </div>
          <Button onClick={handleCheckBalance} className="mt-5">
            Check Saldo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckBalance;
