"use client";
import { Button } from "@/components/ui/button";
import useBankSampahData from "@/hooks/useBankSampahData";
import { ArrowLeft, PencilLine } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Avatar from "react-avatar";
import { FaWhatsapp } from "react-icons/fa";
import BankSampahInfo from "./_components/bankSampahInfo";
import useTransactionData from "@/hooks/useTransactionData";
import useCustomersData from "@/hooks/useCustomersData";
import LoadingBar from "react-top-loading-bar";
import useTrashesData from "@/hooks/useTrashesData";
import TrashInfo from "./_components/trashInfo";
import useCategoryData from "@/hooks/useCategoryData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import EditProfile from "./_components/editProfile";
import { Toaster } from "react-hot-toast";

const BankSampahProfilePage = () => {
  const { bankSampahProfile } = useBankSampahData();
  const { transactions } = useTransactionData();
  const { customers } = useCustomersData();
  const { trashes } = useTrashesData();
  const { categories } = useCategoryData();
  const [progress, setProgress] = useState(0);

  const handleHomeClick = () => {
    setProgress(50);
  };

  return (
    <div className="bg-earth bg-cover bg-fixed bg-center min-h-screen">
      <LoadingBar
        color="#8dCC9E"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Toaster />
      <div className="p-16">
        <div className="gap-2 mb-3">
          <Link
            className="gap-2 p-2 px-4 flex items-center hover:bg-black/60 hover:rounded-lg w-fit"
            href={`/profile/${bankSampahProfile._id}`}
            onClick={handleHomeClick}
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-semibold">Go to Home</span>
          </Link>
        </div>
        <div className="bg-black/30 backdrop-blur-sm flex flex-col gap-5 items-center justify-center p-10 rounded-lg">
          <div>
            <Avatar
              color={Avatar.getRandomColor("sitebase", [
                "#F87171",
                "#4ADE80",
                "#60A5FA",
              ])}
              name={bankSampahProfile.name}
              round={true}
            />
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-center">
              {bankSampahProfile.name}
            </div>
            <div className="flex items-center gap-2">
              {bankSampahProfile.address?.region ?? (
                <div className="flex items-center gap-2 text-sm text-center">
                  Tambah Alamat
                </div>
              )}
              <div>-</div>
              <div className="flex gap-1 items-center text-sm">
                <FaWhatsapp size={16} />
                {bankSampahProfile.phoneNumber ?? <div>Tambah Whatsapp</div>}
              </div>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="hover:bg-white/50 hover:text-white">
                <div className="flex items-center gap-2">
                  <div className="text-sm">Edit your profile</div>
                  <PencilLine size={15} opacity={0.5} />
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/30 backdrop-blur-sm">
              <DialogTitle>
                <div className="font-bold text-xl">Edit profile</div>
                <DialogDescription>
                  Edit profile Bank Sampah {bankSampahProfile.name}
                </DialogDescription>
              </DialogTitle>
              <EditProfile bankSampahProfile={bankSampahProfile} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-black/30 backdrop-blur-sm rounded-md mt-5 p-10">
          <BankSampahInfo
            bankSampahProfile={bankSampahProfile}
            transactions={transactions}
            customers={customers}
          />
        </div>
        <TrashInfo trashes={trashes} categories={categories} />
      </div>
    </div>
  );
};

export default BankSampahProfilePage;
