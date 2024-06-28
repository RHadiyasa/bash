"use client";
import RafiHadiyasa from "@/components/copyright";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  addCustomer,
  getUserDetailCustomer,
  validateCustomerInput,
} from "@/modules/users/services/customer.service";
import React, { useEffect, useState } from "react";
import AddressForm from "./addressForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AddCustomer = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState({
    street: "",
    region: "",
    city: "",
    postalCode: "",
    province: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [style, setStyle] = useState("text-[9pt] md:text-sm font-semibold pl-2")
  const isEmpty = "text-[9pt] md:text-sm font-semibold pl-2 text-green-400"

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserDetailCustomer();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch User data", error);
      }
    };
    fetchUser();
  }, []);

  const addCustomerHandle = async () => {
    validateCustomerInput({ username, fullName, accountNumber, phoneNumber, address});

    const props = {
      username,
      fullName,
      phoneNumber,
      accountNumber,
      address: [address],
      bankSampah: user._id,
    };

    console.log("Data input: ", props);

    // try {
    //   await addCustomer(props);
    //   toast.success("Customer berhasil ditambahkan");
    //   router.push("/customers");
    // } catch (error) {
    //   console.error("Failed to add customer", error.response);
    //   toast.error(error.response.data.error);
    // }
  };

  const handleCancle =() => {
    router.push("/customers")
  }
  return (
    <div>
      <Card className="bg-[#09090B] mt-3 md:mt-5 p-5 md:p-10">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="grid gap-2">
            <div className={username ? isEmpty : style}>
              Username
            </div>
            <Input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Username"
              className="bg-black"
            />
          </div>
          <div className="grid gap-2">
            <div className={fullName ? isEmpty : style}>
              Nama Lengkap Nasabah
            </div>
            <Input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Nama Nasabah Baru"
              className="bg-black"
            />
          </div>
          <div className="grid gap-2">
            <div className={accountNumber ? isEmpty : style}>
              No Rekening
            </div>
            <Input
              type="text"
              value={accountNumber}
              onChange={(event) => setAccountNumber(event.target.value)}
              placeholder="Nomor Rekening"
              className="bg-black"
            />
          </div>
          <div className="grid gap-2">
            <div className={phoneNumber ? isEmpty : style}>
              No Telp (+62)
            </div>
            <Input
              type="text"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="Handphone"
              className="bg-black"
            />
          </div>
        </div>
        <div className="mt-5 md:mt-8">
          <AddressForm address={address} setAddress={setAddress} style={style} isEmpty={isEmpty}/>
          <div className="grid gap-2 mt-5 p-2">
            <div className="text-[9pt] md:text-sm font-semibold">
              Terms and Condition
            </div>
            <div className="grid items-center text-[9pt] md:text-sm font-normal gap-3">
              {user?.username && (
                <span className="text-[9pt] md:text-[10pt] font-light">
                  Nasabah ini akan terdaftar pada bank Sampah Anda saat ini{" "}
                  <span className="font-bold text-green-300">
                    {user.username}
                  </span>
                  . Dengan itu nasabah akan mengikuti segala jenis kebijakan
                  pada bank sampah tempat mereka terdaftar.
                </span>
              )}
              <div className="flex gap-2 items-center">
                <Checkbox checked={isChecked} onCheckedChange={(checked)=>setIsChecked(checked)} />
                <label
                  htmlFor="terms"
                  className="text-[9pt] md:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
              </div>
            </div>
          </div>
          <div className="grid md:flex py-5 gap-2">
            <Button onClick={addCustomerHandle} disabled={!isChecked}>Daftarkan Nasabah</Button>
            <Button onClick={handleCancle} variant="destructive">Batal</Button>
          </div>
        </div>
      </Card>
      <RafiHadiyasa />
    </div>
  );
};

export default AddCustomer;
