"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import { getUserDetail } from "@/modules/users/services/user.service";
import { Loader2 } from "lucide-react";
import useHeaderData from "@/hooks/useHeaderData";

export default function Home() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useHeaderData();
  const router = useRouter();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await getUserDetail();
        setUserData(res);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Jika status 403 / belum logged in
          router.push("/login");
        } else {
          toast.error(error.message);
        }
      }
    };
    getUserDetails();
  }, []);

  const handleClick = () => {
    setLoading(true);
    console.log("Data :", userData); // Debug log
    if (userData) {
      router.push(`/profile/${userData._id}`);
    } else {
      logout();
      router.push("/login");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster position="top-right" />
      <div className="flex flex-col items-center gap-6">
        <h1 className="scroll-m-20 text-6xl font-bold tracking-tight lg:text-7xl">
          BashApp Development
        </h1>
        <div>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              <div className="animate-pulse">Loading...</div>
            </div>
          ) : (
            <Button
              onClick={handleClick}
              variant="outline"
              className="w-40 md:w-[360px]"
            >
              {!userData || userData.length === 0
                ? "Login"
                : `Go to profile ${userData.username} >>`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
