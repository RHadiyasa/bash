"use client";

import dynamic from "next/dynamic";
import { EyeFilledIcon } from "@/assets/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/assets/EyeSlashFilledIcon";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "../../components/ui/input";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/modules/users/services/user.service";
import { BiLeftArrowCircle } from "react-icons/bi";

const LocationSelect = dynamic(() => import("./_components/locationSelect"), {
  ssr: false,
});

const RegisterPage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    location: {
      province: "",
      regency: "",
      district: "",
      village: "",
    },
  });

  console.log(user);

  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onRegister = async () => {
    if (user.password !== confirmPassword) {
      toast.error("Password tidak sama");
      return;
    }

    try {
      setLoading(true);
      await registerUser(user);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      // toast.error("User already exists");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.name.length > 0 &&
      user.email.length > 0 &&
      user.phoneNumber.length > 0 &&
      user.password.length > 0
    ) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [user]);

  const handleNext = () => {
    if (
      user.location.province &&
      user.location.regency &&
      user.location.district &&
      user.location.village
    ) {
      setStep(2);
    } else {
      toast.error("Silahkan isi lokasi Bank Sampah");
    }
  };

  const handlePrev = () => {
    user.location.province = "";
    user.location.regency = "";
    user.location.district = "";
    user.location.village = "";
    setStep(1);
  };

  return (
    <div
      className="dark p-7 md:p-0 bg-cover bg-register
    from-slate-900 to-slate-800 min-h-screen flex items-center justify-center"
    >
      <Toaster position="top-left" />
      <Card
        className="border-none backdrop-blur-sm bg-slate-900/60 animate-appearance-in 
      hover:bg-gradient-to-b from-slate-900/70 to-slate-900/5 dark:bg-default-100/50 rounded-3xl p-10 m-14"
      >
        <CardHeader>
          <CardTitle className="font-bold text-white text-center justify-center text-xl lg:text-3xl">
            Daftarkan Bank Sampah Anda
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-5">
          {step === 1 && (
            <div className="grid">
              <div className="grid gap-2">
                <LocationSelect user={user} setUser={setUser} />
              </div>
              <div className="mt-10">
                <Button onClick={handleNext} className="w-full">
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <Form>
              <div className="dark grid lg:grid-cols-3 gap-6 w-auto lg:w-[600px] mt-5">
                <div className="grid gap-2">
                  <span className="text-sm font-bold pl-1">
                    Nama Bank Sampah
                  </span>
                  <Input
                    className="bg-transparent/40 py-6"
                    value={user.name || ""}
                    type="text"
                    onChange={(event) =>
                      setUser({ ...user, name: event.target.value })
                    }
                    placeholder="Nama Bank Sampah"
                  />
                </div>
                <div className="grid gap-2">
                  <p className="text-sm font-bold font-sans ml-1">Email</p>
                  <Input
                    className="bg-transparent/40 py-6"
                    value={user.email || ""}
                    type="email"
                    onChange={(event) =>
                      setUser({ ...user, email: event.target.value })
                    }
                    placeholder="Your email"
                  />
                </div>
                <div className="grid gap-2">
                  <p className="text-sm font-bold font-sans ml-1">
                    No Telp (Whatsapp)
                  </p>
                  <Input
                    className="bg-transparent/40 py-6"
                    value={user.phoneNumber || ""}
                    type="text"
                    onChange={(event) =>
                      setUser({ ...user, phoneNumber: event.target.value })
                    }
                    placeholder="+62"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 mt-5">
                <div className="grid gap-2">
                  <p className="text-sm font-bold font-sans ml-1">Password</p>
                  <div className="flex flex-row justify-end items-center scale-100 mt-3">
                    <Input
                      className=" bg-transparent/40 py-6 absolute"
                      type={isVisible ? "text" : "password"}
                      value={user.password || ""}
                      placeholder="Your password"
                      onChange={(event) =>
                        setUser({ ...user, password: event.target.value })
                      }
                    />
                    <button
                      className="focus:outline-none mr-3 scale-100"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none animate-bounce" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm font-bold font-sans ml-1">
                    Konfirmasi Password
                  </p>
                  <div className="flex flex-row justify-end items-center scale-100 mt-3">
                    <Input
                      className=" bg-transparent/40 py-6 absolute"
                      type={isVisible ? "text" : "password"}
                      value={confirmPassword || ""}
                      placeholder="Your password"
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                    />
                    <button
                      className="focus:outline-none mr-3 scale-100"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none animate-bounce" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  onClick={handlePrev}
                  className="col-span-2 mt-5 flex items-center gap-1"
                >
                  <BiLeftArrowCircle size={18} /> <span>Kembali</span>
                </Button>
              </div>
            </Form>
          )}
        </CardContent>
        {step === 2 && (
          <CardFooter className="flex flex-col justify-center gap-5 mt-5">
            <div className="flex items-center gap-2">
              <Button
                className="font-sans w-60 font-bold"
                onClick={onRegister}
                disabled={disableButton}
              >
                {loading ? "Please wait" : ""}
                {disableButton ? (
                  "All fields are required"
                ) : "Register" && loading ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>
              <div className="flex justify-center items-center gap-2 font-bold"></div>
            </div>

            <div className="flex items-center flex-col gap-2 dark mt-3 mb-[30px] md:mb-2">
              Already have an account?{" "}
              <Link
                href={"/login"}
                className={buttonVariants({ variant: "outline" })}
              >
                Click here
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default RegisterPage;
