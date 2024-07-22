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
import { Form } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import axios from "axios";
import React from "react";

const LoginPage = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const handledKeyPress = (event) => {
    if (event.key === "Enter") {
      onLogin();
    }
  };

  const onLogin = async () => {
    try {
      setLoading(true);
      if (!user.email || !user.password) {
        setMessage("All fields are required");
        return;
      }

      const response = await axios.post("/api/users/login", user);
      const { userId, token } = response.data;

      localStorage.setItem("token", token);
      toast.success("Login success!");
      setTimeout(() => {
        router.push(`/profile/${userId}`);
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid Login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cover bg-[url('https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] min-h-screen flex items-center justify-center px-5">
      <Toaster position="top-left" />
      <Card className="border-none backdrop-blur-sm shadow-xl bg-black/30 animate-appearance-in hover:bg-gradient-to-b from-green-900/50 to-green-900/10 p-5 rounded-3xl">
        <CardHeader>
          <CardTitle className="font-bold text-white flex text-center justify-center text-2xl">
            Login to BashApp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form className="gap-5">
            <div className="dark">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    value={user.email}
                    onChange={(event) =>
                      setUser({ ...user, email: event.target.value })
                    }
                    className="text-white bg-transparent/40"
                    type="email"
                    placeholder="Your email"
                  />
                </div>
                <div className="flex flex-row justify-end items-center scale-100">
                  <Input
                    value={user.password}
                    onChange={(event) =>
                      setUser({ ...user, password: event.target.value })
                    }
                    className="text-white bg-transparent/40 absolute lg:relative"
                    type={isVisible ? "text" : "password"}
                    placeholder="Your password"
                    onKeyPress={handledKeyPress}
                  />
                  <button
                    className="focus:outline-none mr-3 md:ml-3 scale-100"
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
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center gap-5 mt-5 lg:mt-2">
          <Button onClick={onLogin} className="dark font-sans w-40 font-bold">
            {loading ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin disabled:true" />
            ) : (
              "Login"
            )}
          </Button>
          <div className="font-bold text-red-300">{message}</div>
          <div className="text-white text-[0.7rem] lg:text-[0.9rem]">
            Don't have an account?{" "}
            <Link
              href={"/register"}
              className="font-bold text-blue-200 animate-pulse"
            >
              Register here
            </Link>
          </div>
          <Link href={"/reset-password"}>
            <div className="text-sm font-semibold">Reset Password</div>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
