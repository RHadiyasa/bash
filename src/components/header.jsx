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
import { checkUrl } from "@/lib/helpers/checkUrl";
import { fetchHeader } from "@/lib/helpers/fetchHeader";
import LoadingPage from "./loadingPage";

const HeaderPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const params = useParams().id;
  const path = usePathname();

  const active =
    "transition-colors hover:text-foreground/60 p-1 hover:border-b-2";
  const inactive = "text-gray-600 " + active;
  const profilePath = path.startsWith("/profile");
  const trashesPath = path.startsWith("/trashes");
  const customersPath = path.startsWith("/customers");
  const transactionsPath = path.startsWith("/transactions");

  useEffect(() => {
    try {
      setLoading(true);
      if (path !== `/profile/${params}`) {
        try {
          fetchHeader(router, setData, setUserId);
        } catch (error) {
          logout();
        }
      } else {
        checkUrl(params, router, setData, setUserId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [params, router]);

  const loadingHandler = () => {
    toast.success("Navigating...");
  };

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

  if (loading) {
    return <LoadingPage message={"Loading..."} />;
  }

  return (
    <div className="flex flex-col bg-[#09090B]">
      <Toaster position="bottom-left" />
      <header className="sticky top-0 h-20 flex items-center px-6 bg-[#09090B] md:px-2 lg:px-10 border-b-[1px] border-white/10">
        <nav className="hidden flex-col gap-6 text-lg font-bold md:flex md:flex-row md:items-center md:gap-4 md:text-sm lg:gap-10">
          <Link
            onClick={loadingHandler}
            href={`/profile/${userId}`}
            className="text-xl lg:text-2xl font-extrabold text-foreground transition-colors hover:text-foreground pl-5"
          >
            <span>BashApp</span>
          </Link>
          <div className="flex flex-row items-center justify-center md:px-6 md:gap-5 lg:gap-10">
            <Link
              href={`/profile/${userId}`}
              className={profilePath ? active : inactive}
            >
              Dashboard
            </Link>
            <Link
              onClick={loadingHandler}
              href={"/trashes"}
              className={trashesPath ? active : inactive}
            >
              Sampah
            </Link>
            <Link
              onClick={loadingHandler}
              href={"/customers"}
              className={customersPath ? active : inactive}
            >
              Nasabah
            </Link>
            <Link
              onClick={loadingHandler}
              href={"/transactions"}
              className={transactionsPath ? active : inactive}
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
                href={`/profile/${userId}`}
                className="text-3xl font-extrabold text-foreground transition-colors hover:text-foreground mb-10"
              >
                <span>BashApp</span>
              </Link>
              <Link
                href={`/profile/${userId}`}
                className="flex items-stretch text-lg hover:backdrop-blur-sm transition-colors hover:text-green-200 hover:pl-5 hover:bg-gradient-to-r hover:rounded-l-xl from-green-100/10 font-semibold py-4 gap-4"
              >
                <HomeIcon />
                Dashboard
              </Link>
              <Link
                href={`/trashes`}
                className="flex items-stretch text-lg hover:backdrop-blur-sm transition-colors hover:text-green-200 hover:pl-5 hover:bg-gradient-to-r hover:rounded-l-xl from-green-100/10 font-semibold py-4 gap-4"
              >
                <PackageOpenIcon />
                Sampah
              </Link>
              <Link
                href={"/customers"}
                className="flex items-stretch text-lg hover:backdrop-blur-sm transition-colors hover:text-green-200 hover:pl-5 hover:bg-gradient-to-r hover:rounded-l-xl from-green-100/10 font-semibold py-4 gap-4"
              >
                <Users2Icon />
                Nasabah
              </Link>
              <Link
                href={"/transactions"}
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
            <PopoverContent className="mt-2 mr-8 bg-[#09090B]/70 backdrop-blur-sm">
              <div className="flex flex-col mt-2">
                <Link href={"#"}>
                  <div className="flex items-center gap-2 px-2 text-sm font-semibold py-3 rounded-lg hover:bg-secondary">
                    <User2Icon className="h-4" />
                    <span>Profile</span>
                  </div>
                </Link>
                <Link href={"#"}>
                  <div className="flex items-center gap-2 px-2 text-sm font-semibold py-3 rounded-lg hover:bg-secondary">
                    <SettingsIcon className="h-4" />
                    <span>Setting</span>
                  </div>
                </Link>
                <Button
                  onClick={logout}
                  className="mt-4 bg-white hover:bg-white/40 hover:text-white"
                >
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
