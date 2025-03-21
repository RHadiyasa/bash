"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [data, setData] = useState("");
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred during logout"
      );
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get("/api/users/bash");
        setData(res.data.data?.username);
        setUserId(res.data.data?._id);
      } catch (error) {
        console.error("You're not logged in", error);
        toast.success("Welcome to bashApp. Please login first");
        logout();
      }
    };
    getUserDetails();
  }, []);

  const gotoProfile = () => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster position="top-right" />
      <div className="flex flex-col items-center gap-6">
        <h1 className="scroll-m-20 text-6xl font-bold tracking-tight lg:text-7xl">
          BashApp
        </h1>
        <div>
          <Button
            onClick={gotoProfile}
            variant="outline"
            className="w-40 md:w-[360px]"
          >
            {!data ? "Login" : `Go to profile ${data} >>`}
          </Button>
        </div>
      </div>
    </div>
  );
}
