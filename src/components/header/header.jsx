"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { MenuIcon, CoinsIcon, PackageIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useHeaderData from "@/hooks/useHeaderData";
import NavLink from "./navLink";
import ProfilePopover from "./profilePopover";
import LoadingPage from "../loadingPage";
import LoadingBar from "react-top-loading-bar";
import { IoPeopleSharp, IoWarningOutline } from "react-icons/io5";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import useBankSampahData from "@/hooks/useBankSampahData";
import { useState } from "react";
import { Badge } from "../ui/badge";

const HeaderPage = () => {
  const [progress, setProgress] = useState(0);
  const { loading, userId, logout } = useHeaderData();
  const { bankSampahProfile } = useBankSampahData();
  const path = usePathname();
  const router = useRouter();

  const paths = {
    profile: path.startsWith("/profile"),
    trashes: path.startsWith("/trashes"),
    customers: path.startsWith("/customers"),
    transactions: path.startsWith("/transactions"),
  };

  if (loading) {
    return <LoadingPage message="Loading..." />;
  }

  const loadingHandler = (pathName) => {
    const navigating = toast.loading("Navigating...");
    if (path === pathName) {
      setProgress(100);
    } else {
      setProgress(30);
      setProgress(80);
      router.push(pathName);
    }

    toast.dismiss(navigating);
  };

  return (
    <div className="flex flex-col bg-background">
      <LoadingBar
        color="#8dCC9E"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Toaster position="bottom-left" />
      <header className="sticky top-0 h-20 flex items-center px-6 md:px-2 lg:px-10 border-b-[1px] border-white/10">
        <nav className="hidden md:flex flex-col gap-6 text-lg font-bold md:flex-row md:items-center md:gap-4 md:text-sm lg:gap-10">
          <Link
            onClick={() => loadingHandler(`/profile/${userId}`)}
            href={`/profile/${userId}`}
            className="text-xl lg:text-2xl font-extrabold text-foreground transition-colors hover:text-foreground pl-5"
          >
            <span>BashApp</span>
          </Link>
          <div className="flex flex-row items-center justify-center md:px-6 md:gap-5 lg:gap-10">
            <NavLink
              onClick={() => loadingHandler(`/profile/${userId}`)}
              href={`/profile/${userId}`}
              active={paths.profile}
            >
              Dashboard
            </NavLink>
            <NavLink
              onClick={() => loadingHandler(`/trashes`)}
              href={`/trashes`}
              active={paths.trashes}
            >
              <span>Sampah</span>
            </NavLink>
            <NavLink
              onClick={() => loadingHandler(`/customers`)}
              href="/customers"
              active={paths.customers}
            >
              Nasabah
            </NavLink>
            <NavLink
              onClick={() => loadingHandler(`/transactions`)}
              href="/transactions"
              active={paths.transactions}
            >
              Transaksi
            </NavLink>
          </div>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden bg-transparent text-foreground hover:bg-white/5 gap-2 flex justify-center items-center">
              <MenuIcon />
              <span className="font-bold">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black p-10">
            <SheetTitle>
              <Link
                href={`/profile/${userId}`}
                className="text-4xl font-extrabold text-foreground transition-colors hover:text-foreground mb-10"
              >
                <span>BashApp</span>
              </Link>
              <SheetDescription className="mt-2">
                Bank Sampah Application
              </SheetDescription>
            </SheetTitle>
            <nav className="grid gap-2 mt-8">
              <NavLink
                onClick={loadingHandler}
                href={`/profile/${userId}`}
                active={paths.profile}
              >
                <div className="flex items-center py-4 gap-2 hover:bg-white/20 hover:text-white hover:rounded-md hover:pl-4">
                  <MdOutlineSpaceDashboard size={25} />
                  <div>Dashboard</div>
                </div>
              </NavLink>
              <NavLink href="/trashes" active={paths.trashes}>
                <div className="flex items-center py-4 gap-2 hover:bg-white/20 hover:text-white hover:rounded-md hover:pl-4">
                  <PackageIcon />
                  <div>Sampah</div>
                </div>
              </NavLink>
              <NavLink href="/customers" active={paths.customers}>
                <div className="flex items-center py-4 gap-2 hover:bg-white/20 hover:text-white hover:rounded-md hover:pl-4">
                  <IoPeopleSharp size={25} />
                  <div>Nasabah</div>
                </div>
              </NavLink>
              <NavLink href="/transactions" active={paths.transactions}>
                <div className="flex items-center py-4 gap-2 hover:bg-white/20 hover:text-white hover:rounded-md hover:pl-4">
                  <CoinsIcon />
                  <div>Transaksi</div>
                </div>
              </NavLink>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex w-full justify-end px-5 items-center gap-4">
          <div className="font-bold">{bankSampahProfile.name}</div>
          <ProfilePopover
            bankSampah={bankSampahProfile}
            data={userId}
            logout={logout}
            setProgress={setProgress}
          />
        </div>
      </header>
    </div>
  );
};

export default HeaderPage;
