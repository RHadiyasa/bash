"use client";
import { Separator } from "@/components/ui/separator";
import useBankSampahData from "@/hooks/useBankSampahData";
import { ArrowLeft, ArrowLeftCircle, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";
import Avatar from "react-avatar";
import { FaWhatsapp } from "react-icons/fa";

const BankSampahProfilePage = () => {
  const { bankSampahProfile } = useBankSampahData();

  console.log(bankSampahProfile);
  return (
    <div className="bg-earth bg-cover bg-fixed bg-center min-h-screen">
      <div className="p-16">
        <Link href={`/profile/${bankSampahProfile._id}`}>
          <div className="flex items-center gap-2 mb-3">
            <ArrowLeft size={16} />
            <span className="text-sm">Home</span>
          </div>
        </Link>
        <div className="bg-black/30 flex gap-7 items-center p-10 rounded-lg">
          <Avatar
            color={Avatar.getRandomColor("sitebase", [
              "#F87171",
              "#4ADE80",
              "#60A5FA",
            ])}
            name={bankSampahProfile.username}
            round={true}
            className="w-1/4"
          />
          <div className="grid gap-2 w-full">
            <div className="text-xl font-semibold">
              {bankSampahProfile.username}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm">Pesanggrahan, Jakarta Selatan</div>
              <div className="flex gap-1 items-center text-sm">
                <FaWhatsapp size={16} />
                +6289693919042
              </div>
            </div>
          </div>
          <Separator orientation="vertical" className="py-12 bg-gray-400" />
          <div className="w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default BankSampahProfilePage;
