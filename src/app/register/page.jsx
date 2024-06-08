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
import {
  Form
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";

const registerPage = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="dark bg-cover bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] from-slate-900 to-slate-800 min-h-screen flex items-center justify-center">
      <Card className="border-none bg-slate-900/60 animate-appearance-in hover:bg-gradient-to-b from-slate-900/70 to-slate-900/5 dark:bg-default-100/50 p-10 rounded-3xl">
        <CardHeader>
          <CardTitle className="font-bold text-white flex text-center justify-center mb-4 text-3xl">
            Register Your Bank Sampah to BashApp
          </CardTitle>
          <Separator className="bg-white/50" />
        </CardHeader>
        <CardContent className="mt-4">
          <Form>
            <div className="dark col-span-6 md:col-span-4 flex flex-col gap-6">
              <Input
                className="bg-transparent/40 py-6"
                type="username"
                placeholder="Your email"
              />
              <Input
                className="bg-transparent/40 py-6"
                type="email"
                placeholder="Your email"
              />
              <div className="flex flex-row justify-end items-center scale-100 mt-3">
                <Input
                  className=" bg-transparent/40 py-6 absolute"
                  type={isVisible ? "text" : "password"}
                  placeholder="Your password"
                />
                <button
                  className="focus:outline-none mr-3 scale-100"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              </div>
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center gap-5 mt-5">
          <Button className="font-sans w-40 font-bold">Register</Button>
          <div className="dark mt-5 mb-[-30px]">
            Alreadt have an account?{" "}
            <Link href={"/login"} className={buttonVariants({ variant: "outline" })}>Click here</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default registerPage;
