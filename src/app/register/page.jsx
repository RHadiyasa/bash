"use client";

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
import { Separator } from "../../components/ui/separator";
import Link from "next/link";
import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [user, setUser] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const [disableButton, setDisableButton] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const onRegister = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/register", user);

      toast.success("Register sucess...");
      console.log(response)
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      // console.log(error);
      toast.error("User already exist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.username.length > 0 &&
      user.email.length > 0 &&
      user.password.length > 0
    ) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [user]);

  return (
    <div
      className="dark p-7 md:p-0 bg-cover
    bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] 
    from-slate-900 to-slate-800 min-h-screen flex items-center justify-center"
    >
      <Toaster position="top-left" />
      <Card
        className="border-none backdrop-blur-sm bg-slate-900/60 animate-appearance-in 
      hover:bg-gradient-to-b from-slate-900/70 to-slate-900/5 dark:bg-default-100/50 md:px-4 
      md:min-h-screen rounded-3xl md:rounded-none md:flex md:items-center"
      >
        <CardHeader>
          <CardTitle className="font-bold text-white flex text-center justify-center mb-4 text-3xl md:w-[300px]">
            Register Your Bank Sampah to BashApp
          </CardTitle>
          <Separator className="bg-white/50" />
        </CardHeader>
        <div className="md:w-[400px]">
          <CardContent>
            <Form>
              <div className="dark col-span-6 md:col-span-4 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="font-bold font-sans ml-1">Nama Bank Sampah</p>
                  <Input
                    className="bg-transparent/40 py-6"
                    value={user.username}
                    type="username"
                    onChange={(event) =>
                      setUser({ ...user, username: event.target.value })
                    }
                    placeholder="Nama Bank Sampah"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-bold font-sans ml-1">Email</p>
                  <Input
                    className="bg-transparent/40 py-6"
                    value={user.email}
                    type="email"
                    onChange={(event) =>
                      setUser({ ...user, email: event.target.value })
                    }
                    placeholder="Your email"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-bold font-sans ml-1">Password</p>
                  <div className="flex flex-row justify-end items-center scale-100 mt-3">
                    <Input
                      className=" bg-transparent/40 py-6 absolute"
                      type={isVisible ? "text" : "password"}
                      value={user.password}
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
              </div>
            </Form>
          </CardContent>
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
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
