"use client";

import { Button } from "@/components/ui/button";
import { useParams, usePathname, useRouter } from "next/navigation";
import { act, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CoinsIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  PackageOpenIcon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { checkUrl } from "@/helpers/checkUrl";
import { fetchHeader } from "@/helpers/fetchHeader";

const HeaderPage = () => {
  const [data, setData] = useState("");
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const params = useParams().id;
  const path = usePathname();

  const active = "transition-colors hover:text-foreground/60 p-1 hover:border-b-2"
  const inactive = "text-gray-600 "+ active;

  useEffect(() => {
    if(path !== `/profile/${params}`){
      try {
        fetchHeader(setData, setUserId)
      } catch (error) {
        logout();
      }
    } else {
      checkUrl(params, router, setData, setUserId);
    }
  }, [params, router]);

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
    <div className="flex flex-col bg-black">
      <Toaster position="bottom-left" />
      <header className="sticky top-0 h-20 flex items-center px-6 bg-black md:px-2 lg:px-10 border-b-[1px] border-white/10">
        <nav className="hidden flex-col gap-6 text-lg font-bold md:flex md:flex-row md:items-center md:gap-4 md:text-sm lg:gap-10">
          <Link
            href={`/profile/${userId}`}
            className="text-xl lg:text-2xl font-extrabold text-foreground transition-colors hover:text-foreground pl-5"
          >
            <span>BashApp</span>
          </Link>
          <div className="flex flex-row items-center justify-center md:px-6 md:gap-5 lg:gap-10">
            <Link
              href={`/profile/${userId}`}
              className={path !== `/profile/${userId}` ? inactive : active}
            >
              Dashboard
            </Link>
            <Link
              href={"/trashes"}
              className={path !== "/trashes" ? inactive : active}
            >
              Sampah
            </Link>
            <Link
              href={"/customers"}
              className={path !== "/customers" ? inactive : active}
            >
              Nasabah
            </Link>
            <Link
              href={"/transactions"}
              className={path !== "/transactions" ? inactive : active}
            >
              Transaksi
            </Link>
          </div>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden bg-transparent text-foreground hover:bg-slate-800 gap-2 flex justify-center items-center border-[0.5px] border-slate-600">
              <MenuIcon />
              <span className="font-bold">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black p-10">
            <nav className="grid gap-2">
              <Link
                href={"#"}
                className="text-3xl font-extrabold text-foreground transition-colors hover:text-foreground mb-10"
              >
                <span>BashApp</span>
              </Link>
              <Link
                href={"#"}
                className="flex items-stretch text-lg hover:backdrop-blur-sm transition-colors hover:text-green-200 hover:pl-5 hover:bg-gradient-to-r hover:rounded-l-xl from-green-100/10 font-semibold py-4 gap-4"
              >
                <HomeIcon />
                Dashboard
              </Link>
              <Link
                href={"#"}
                className="flex items-stretch text-lg hover:backdrop-blur-sm transition-colors hover:text-green-200 hover:pl-5 hover:bg-gradient-to-r hover:rounded-l-xl from-green-100/10 font-semibold py-4 gap-4"
              >
                <PackageOpenIcon />
                Sampah
              </Link>
              <Link
                href={"#"}
                className="flex items-stretch text-lg hover:backdrop-blur-sm transition-colors hover:text-green-200 hover:pl-5 hover:bg-gradient-to-r hover:rounded-l-xl from-green-100/10 font-semibold py-4 gap-4"
              >
                <Users2Icon />
                Nasabah
              </Link>
              <Link
                href={"#"}
                className="flex items-stretch text-lg hover:backdrop-blur-sm transition-colors hover:text-green-200 hover:pl-5 hover:bg-gradient-to-r hover:rounded-l-xl from-green-100/10 font-semibold py-4 gap-4"
              >
                <CoinsIcon />
                Transaksi
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex w-full justify-end px-5 items-center gap-4">
          <div className="font-bold">{data}</div>
          <Popover>
            <PopoverTrigger>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="mt-2 mr-8 bg-slate-900">
              <div className="flex flex-col gap-4 mt-2">
                <Link href={"#"}>
                  <div className="flex items-center gap-2 px-2 text-sm font-semibold">
                    <User2Icon className="h-4" />
                    <span>Profile</span>
                  </div>
                </Link>
                <Link href={"#"}>
                  <div className="flex items-center gap-2 px-2 text-sm font-semibold">
                    <SettingsIcon className="h-4" />
                    <span>Setting</span>
                  </div>
                </Link>
                <Button onClick={logout} className="bg-opacity-0">
                  <div className="flex items-center gap-2 px-2 text-sm font-semibold h-10">
                    <LogOutIcon className="h-4" />
                    <span>Logout</span>
                  </div>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>
    </div>
  );
};

export default HeaderPage;
