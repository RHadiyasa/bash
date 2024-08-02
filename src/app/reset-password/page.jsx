"use client";
import { EyeFilledIcon } from "@/assets/EyeFilledIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  checkEmail,
  resetPassword,
} from "@/modules/services/resetPassword.service";
import { ArrowLeftCircle, EyeIcon, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isVisiblePs, setIsVisiblePs] = useState(false);
  const [isVisibleCps, setIsVisibleCps] = useState(false);
  const router = useRouter();

  const handleCheckEmail = async () => {
    setLoading(true);
    if (email.length <= 0) {
      toast.error("Email tidak boleh kosong");
      return;
    }
    try {
      const emailExists = await checkEmail(email);
      if (!emailExists) {
        toast.error("Email tidak ditemukan");
        return;
      }
      setStep(2);
    } catch (error) {
      console.error("Something error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (password.length <= 0) {
      toast.error("Password tidak boleh kosong");
      return;
    }

    if (password.length <= 5) {
      toast.error("Password harus lebih dari 5 karakter");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password tidak sama");
      return;
    }

    try {
      const response = await resetPassword(email, password);
      if (response.status === 200) {
        toast.success("Password berhasil diubah");
        toast.success("Diarahkan ke halaman login...");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error("Gagal mengganti password");
      }
    } catch (error) {
      console.error("Gagal mengganti password", error);
    } finally {
      setLoading(false);
    }
  };

  const goBackHandle = () => {
    setStep(1);
  };

  return (
    <div className="flex bg-earth min-h-screen items-center justify-center">
      <Toaster />
      <div className="grid w-full px-10 md:w-3/4 lg:w-3/5">
        <Card className="p-10 bg-black/5 backdrop-blur-sm">
          {step === 1 && (
            <div className="text-sm md:text-lg xl:text-2xl font-bold text-center mb-10">
              Reset Password Bank Sampah
            </div>
          )}
          <Form>
            <div className="grid gap-2">
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-5">
                    <Label className="text-sm">Email</Label>
                    <Input
                      className="bg-black/30"
                      placeholder="Email Anda"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  <Button onClick={handleCheckEmail} className="mt-5 w-full">
                    Selanjutnya
                  </Button>
                </div>
              )}
              {step === 2 && (
                <>
                  <div className="grid items-center gap-2 animate-in animate-accordion-up">
                    <div className="pb-5 text-sm font-semibold text-center text-white/50">
                      Ganti Password {email}
                    </div>
                    <div className="grid grid-cols-2 items-center gap-5">
                      <div className="text-right text-sm select-none">
                        Password Baru
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          className="bg-black/30"
                          type={isVisiblePs ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                        />
                        {isVisiblePs ? (
                          <EyeOff
                            onClick={() => setIsVisiblePs(false)}
                            size={18}
                          />
                        ) : (
                          <EyeIcon
                            onClick={() => setIsVisiblePs(true)}
                            size={18}
                          />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-5">
                      <div className="text-right text-sm select-none">
                        Konfirmasi Password
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          className="bg-black/30"
                          type={isVisibleCps ? "text" : "password"}
                          placeholder="Konfirmasi Password"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                        />
                        {isVisibleCps ? (
                          <EyeOff
                            onClick={() => setIsVisibleCps(false)}
                            size={18}
                          />
                        ) : (
                          <EyeIcon
                            onClick={() => setIsVisibleCps(true)}
                            size={18}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleChangePassword}
                      className="mt-5 w-full select-none"
                    >
                      Reset Password
                    </Button>
                    <Button
                      onClick={goBackHandle}
                      variant="outline"
                      className="mt-5 w-full bg-black/30 hover:bg-black/50 select-none"
                    >
                      Kembali
                    </Button>
                  </div>
                </>
              )}
              <a
                href="/login"
                className="flex items-center gap-1 px-5 text-xs mt-5 hover:bg-black/30 hover:rounded-lg w-auto justify-center py-3"
              >
                <ArrowLeftCircle size={15} />
                <span>Back to login page</span>
              </a>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
