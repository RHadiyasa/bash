"use client";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getUserDetail } from "@/modules/services/user.service";
import { Loader2 } from "lucide-react";
import useHeaderData from "@/hooks/useHeaderData";
import { TypeAnimation } from "react-type-animation";
import useGlobe from "@/hooks/useGlobe";
import "./styles.css";

export default function Home() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useHeaderData();
  const router = useRouter();
  const canvasRef = useRef(null);
  useGlobe(canvasRef);

  useEffect(() => {
    setLoading(true);
    const getUserDetails = async () => {
      try {
        const res = await getUserDetail();
        setUserData(res);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.success("Selamat Datang");
        } else {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  const handleClick = () => {
    setLoading(true);
    if (userData) {
      router.push(`/profile/${userData._id}`);
    } else {
      logout();
      router.push("/");
    }
  };

  const handleClickCustomer = () => {
    setLoading(true);
    router.push(`/login-customer`);
  };

  return (
    <div className="fullscreen">
      <div className="background">
        <canvas id="c" ref={canvasRef}></canvas>
      </div>
      <div className="foreground">
        <div className="flex items-center min-h-screen">
          <Toaster position="top-right" />
          <div className="grid text-left px-10 lg:px-32">
            <div className="text-xl font-bold">
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  "Mulai peduli",
                  1500,
                  "Mulai mandiri",
                  2000,
                  "Jaga bumi, mulai dari sini...",
                  4000,
                ]}
                wrapper="span"
                speed={50}
                style={{ fontSize: "1em", display: "inline-block" }}
                repeat={Infinity}
              />
            </div>
            <div className="scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-7xl">
              BASH INDONESIA
            </div>
            <div>Under development RHadiyasa</div>
            <div>
              {loading ? (
                <div className="flex items-center gap-2 animate-pulse w-40 md:w-[180px] hover:bg-black/70 hover:scale-105 mt-5">
                  <Loader2 className="animate-spin" size={18} />
                  <div className="animate-pulse">Loading...</div>
                </div>
              ) : (
                <div className="grid md:flex md:gap-4">
                  <Button
                    onClick={handleClick}
                    variant="outline"
                    className="animate-pulse w-40 md:w-[180px] bg-black/30 backdrop-blur-sm hover:bg-black/70 hover:scale-105 mt-5"
                  >
                    {!userData || userData.length === 0 ? (
                      <div>Login Bank Sampah</div>
                    ) : (
                      `Go to profile ${userData.username} >>`
                    )}
                  </Button>
                  <Button
                    onClick={handleClickCustomer}
                    variant="outline"
                    className="animate-pulse w-40 md:w-[180px] bg-blue-500/60 backdrop-blur-sm hover:bg-black/70 hover:scale-105 mt-5"
                  >
                    Login Nasabah
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
