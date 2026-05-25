"use client";
import RafiHadiyasa from "@/components/copyright";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { IconInput } from "@/components/ui/icon-input";
import {
  addCustomer,
  validateCustomerInput,
} from "@/modules/services/customer.service";
import React, { useEffect, useState } from "react";
import AddressForm from "./addressForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getUserDetail } from "@/modules/services/user.service";
import {
  CheckCircle2Icon,
  BadgeIcon,
  PhoneIcon,
  ScaleIcon,
  UserRoundIcon,
  WalletIcon,
  XIcon,
} from "lucide-react";

const AddCustomer = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [nik, setNik] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [initialBalance, setInitialBalance] = useState(0);
  const [initialWeight, setInitialWeight] = useState(0);
  const [address, setAddress] = useState({
    street: "",
    region: "",
    city: "",
    postalCode: "",
    province: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const style =
    "text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground";
  const isEmpty =
    "text-xs font-bold uppercase tracking-[0.14em] text-primary";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserDetail();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch User data", error);
      }
    };
    fetchUser();
  }, []);

  const addCustomerHandle = async () => {
    validateCustomerInput({
      fullName,
      nik,
      phoneNumber,
      address,
    });

    const props = {
      fullName,
      nik,
      phoneNumber,
      balance: initialBalance,
      totalWeight: initialWeight,
      address: [address],
      bankSampah: user._id,
    };

    try {
      const customerAdded = await addCustomer(props);
      if (customerAdded) {
        toast.success(
          `Nasabah dibuat. Username: ${customerAdded.username}, Rekening: ${customerAdded.accountNumber}`
        );
        router.push("/customers");
      }
    } catch (error) {
      console.error("Failed to add customer", error.response);
      toast.error(error.response.data.error);
    }
  };

  const handleCancle = () => {
    router.push("/customers");
  };

  return (
    <div>
      <Card className="glass-card rounded-lg p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-border/60 pb-5">
          <div>
            <div className="text-xl font-extrabold">Formulir Nasabah</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Lengkapi identitas dan alamat nasabah. Username serta nomor
              rekening akan dibuat otomatis.
            </p>
          </div>
          <span className="hidden rounded-md bg-primary/10 p-2 text-primary sm:inline-flex">
            <CheckCircle2Icon size={20} />
          </span>
        </div>

        <div className="mb-5 rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm leading-6 text-muted-foreground">
          <span className="font-bold text-primary">Otomatis:</span> username
          dibuat dari nama nasabah dan dibuat unik secara global. Nomor rekening
          dibuat otomatis 10 digit numerik.
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-2">
            <div className={fullName ? isEmpty : style}>
              Nama Nasabah (Sesuai KTP)
            </div>
            <IconInput
              icon={UserRoundIcon}
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Nama Nasabah Baru"
              className="glass-input h-11"
            />
          </div>
          <div className="grid gap-2">
            <div className={nik ? isEmpty : style}>NIK</div>
            <IconInput
              icon={BadgeIcon}
              type="text"
              value={nik}
              onChange={(event) => setNik(event.target.value)}
              placeholder="NIK"
              className="glass-input h-11"
            />
          </div>
          <div className="grid gap-2">
            <div className={phoneNumber ? isEmpty : style}>No Telp (+62)</div>
            <IconInput
              icon={PhoneIcon}
              type="text"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="Handphone"
              className="glass-input h-11"
            />
          </div>
          <div className="grid gap-2">
            <div className={phoneNumber ? isEmpty : style}>
              Saldo Awal Nasabah (Rp)
            </div>
            <IconInput
              icon={WalletIcon}
              type="number"
              value={initialBalance}
              onChange={(event) => setInitialBalance(event.target.value)}
              placeholder="Saldo Awal"
              className="glass-input h-11"
            />
          </div>
          <div className="grid gap-2">
            <div className={phoneNumber ? isEmpty : style}>
              Total Sampah (kg)
            </div>
            <IconInput
              icon={ScaleIcon}
              type="number"
              value={initialWeight}
              onChange={(event) => setInitialWeight(event.target.value)}
              placeholder="Berat Awal Sampah"
              className="glass-input h-11"
            />
          </div>
        </div>
        <div className="mt-6 md:mt-8">
          <AddressForm
            address={address}
            setAddress={setAddress}
            style={style}
            isEmpty={isEmpty}
          />
          <div className="mt-6 grid gap-3 rounded-lg border border-border/60 bg-background/45 p-4">
            <div className="text-sm font-extrabold">
              Terms and Condition
            </div>
            <div className="grid items-center gap-3 text-sm font-normal">
              {user?.name && (
                <span className="text-xs leading-6 text-muted-foreground">
                  Nasabah ini akan terdaftar pada{" "}
                  <span className="font-bold text-primary">{user.name}</span>.
                  Dengan itu{" "}
                  <span className="font-bold text-primary">{user.name}</span>{" "}
                  bertanggung jawab penuh terhadap saldo dan segala bentuk macam
                  transaksi yang akan dilakukan oleh nasabah atas nama{" "}
                  <span className="font-semibold">{fullName}</span> tempat
                  mereka terdaftar.
                </span>
              )}
              <div className="flex gap-2 items-center">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => setIsChecked(checked)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
              </div>
            </div>
          </div>
          <div className="grid gap-2 py-5 md:flex">
            <Button
              className="gap-2 font-bold"
              onClick={addCustomerHandle}
              disabled={!isChecked}
            >
              <CheckCircle2Icon size={16} />
              Daftarkan Nasabah
            </Button>
            <Button
              className="gap-2 font-bold"
              onClick={handleCancle}
              variant="outline"
            >
              <XIcon size={16} />
              Batal
            </Button>
          </div>
        </div>
      </Card>
      <RafiHadiyasa />
    </div>
  );
};

export default AddCustomer;
