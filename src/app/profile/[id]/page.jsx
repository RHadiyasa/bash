"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";

const ProfilePage = () => {
  const [data, setData] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get("/api/users/bash");
        console.log(res.data);
        setData(res.data.data.username); // Mengakses data yang diharapkan
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details");
        logout();
      }
    };

    fetchUserDetails();
  }, []);

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

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Toaster position="top-left" />
      <h2>
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <br></br>
      <div className="font-bold">Profile Page {data}</div>
      <Button onClick={logout} className="mt-4">
        Logout
      </Button>
    </div>
  );
};

export default ProfilePage;
