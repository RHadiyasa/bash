"use client";
import HeaderPage from "@/components/header/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import useBankSampahData from "@/hooks/useBankSampahData";
import { Loader2, MinusIcon, PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import TransactionExplanation from "./_components/transactionExplanation";
import { deleteAllTransactions, updateTransactionFee } from "@/modules/users/services/user.service";

const SettingPage = () => {
  const [loading, setLoading] = useState(false);
  const { bankSampahProfile } = useBankSampahData();
  const [message, setMessage] = useState("");
  const [transactionFee, setTransactionFee] = useState(0);
  const [initial, setInitial] = useState(0);

  useEffect(() => {
    if (bankSampahProfile && bankSampahProfile.transactionFee !== undefined) {
      setTransactionFee(bankSampahProfile.transactionFee);
      setInitial(bankSampahProfile?.transactionFee);
    }
  }, [bankSampahProfile]);

  const addFee = () => {
    setTransactionFee(transactionFee + 1);
  };

  const substractFee = () => {
    if (transactionFee > 0) {
      setTransactionFee(transactionFee - 1);
      setMessage("");
    } else {
      setMessage("Tidak boleh kurang dari 0%... Rugi donkk");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateTransactionFee({ transactionFee });
      setInitial(transactionFee);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllTransactions = async () => {
    try {
      await deleteAllTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#151518] min-h-screen">
      <HeaderPage />
      <div className="grid items-center p-8 md:px-24 md:pt-14 ">
        <div className="grid gap-2">
          <div className="text-lg md:text-xl lg:text-3xl font-semibold">
            Setting / Konfigurasi
          </div>
          <div className="text-sm font-semibold text-gray-400">
            Konfigurasi Bank Sampah {bankSampahProfile.username}
          </div>
        </div>

        <Card className="rounded-xl bg-[#09090B] mt-10">
          <CardHeader className="text-center">
            <div className="text-base md:text-lg lg:text-2xl font-bold text-center">
              Biaya Transaksi
            </div>
            <CardDescription>
              Biaya transaksi dibebankan kepada nasabah untuk setiap transaksi
              (Deposit) yang dilakukan. Saat ini aplikasi tidak mengenakan biaya
              apapun kepada Bank Sampah. Seluruh biaya transaksi, 100% milik
              pengurus Bank Sampah.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <div className="grid items-center justify-center gap-5">
              <div className="flex items-center justify-center">
                <Button
                  className="rounded-full w-10 p-2"
                  onClick={substractFee}
                  disabled={transactionFee <= 0}
                >
                  <MinusIcon size={22} />
                </Button>
                <div className="px-8 text-2xl font-bold">
                  {transactionFee} %
                </div>
                <Button className="rounded-full w-10 p-2" onClick={addFee}>
                  <PlusIcon />
                </Button>
              </div>
              <div className="font-semibold text-center text-xs md:text-sm">
                {transactionFee !== initial
                  ? message
                  : `Biaya transaksi Bank Sampah saat ini ${transactionFee}%`}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              disabled={initial === transactionFee ? true : false}
              onClick={handleSubmit}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Submit"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* EXPLANATION */}
        <TransactionExplanation />
        <div className="grid items-center justify-center gap-2">
          <div className="flex items-center justify-center text-red-500 font-bold text-sm">
            !!! DANGER BUTTON !!!
          </div>
          <Button
            onClick={() => handleDeleteAllTransactions(bankSampahProfile._id)}
            variant="destructive"
          >
            Delete All Transactions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
