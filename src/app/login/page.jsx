"use client";

import { EyeFilledIcon } from "@/assets/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/assets/EyeSlashFilledIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";

const loginPage = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="bg-cover bg-[url('https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] min-h-screen flex items-center justify-center">
      <Card className="border-none backdrop-blur-sm shadow-xl bg-black/30 animate-appearance-in hover:bg-gradient-to-b from-green-900/50 to-green-900/10 p-5 rounded-3xl">
        <CardHeader>
          <CardTitle className="font-bold text-white flex text-center justify-center text-2xl">
            Login to BashApp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form className="gap-5">
            <div className="dark col-span-6 md:col-span-4 w-[600px] flex flex-col gap-2">
              <div className="flex gap-4">
                <Input
                  className="text-white bg-transparent/40"
                  type="email"
                  placeholder="Your email"
                />
                <Input
                  className="text-white bg-transparent/40"
                  type={isVisible ? "text" : "password"}
                  placeholder="Your password"
                />
                <button
                  className="focus:outline-none"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-white/40 text-2xl text-default-400 pointer-events-none animate-bounce" />
                  ) : (
                    <EyeFilledIcon className="text-white/40 text-2xl text-default-400 pointer-events-none animate-in" />
                  )}
                </button>
              </div>
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center gap-5">
          <Button className="dark font-sans w-40 font-bold">Login</Button>
          <div className="text-white">
            Don't have an account? <Link href={"/register"} className="font-bold underline">Register here</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default loginPage;
