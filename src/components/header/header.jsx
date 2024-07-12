"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import {
  MenuIcon,
  CoinsIcon,
  PackageIcon,
} from "lucide-react";
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
import { IoPeopleSharp } from "react-icons/io5";
import { MdOutlineSpaceDashboard } from "react-icons/md";


const HeaderPage = () => {
  const { loading, data, userId, logout } = useHeaderData();
  const path = usePathname();

  const paths = {
    profile: path.startsWith("/profile"),
    trashes: path.startsWith("/trashes"),
    customers: path.startsWith("/customers"),
    transactions: path.startsWith("/transactions"),
  };

  if (loading) {
    return <LoadingPage message="Loading..." />;
  }

  const loadingHandler = () => toast.success("Navigating...");

  return (
    <div className="flex flex-col bg-[#09090B]">
      <Toaster position="bottom-left" />
      <header className="sticky top-0 h-20 flex items-center px-6 bg-[#09090B] md:px-2 lg:px-10 border-b-[1px] border-white/10">
        <nav className="hidden md:flex flex-col gap-6 text-lg font-bold md:flex-row md:items-center md:gap-4 md:text-sm lg:gap-10">
          <Link
            onClick={loadingHandler}
            href={`/profile/${userId}`}
            className="text-xl lg:text-2xl font-extrabold text-foreground transition-colors hover:text-foreground pl-5"
          >
            <span>BashApp</span>
          </Link>
          <div className="flex flex-row items-center justify-center md:px-6 md:gap-5 lg:gap-10">
            <NavLink href={`/profile/${userId}`} active={paths.profile}>
              Dashboard
            </NavLink>
            <NavLink
              onClick={loadingHandler}
              href="/trashes"
              active={paths.trashes}
            >
              Sampah
            </NavLink>
            <NavLink
              onClick={loadingHandler}
              href="/customers"
              active={paths.customers}
            >
              Nasabah
            </NavLink>
            <NavLink
              onClick={loadingHandler}
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
              <SheetDescription className="mt-2">Bank Sampah Application</SheetDescription>
            </SheetTitle>
            <nav className="grid gap-2 mt-8">
              <NavLink href={`/profile/${userId}`} active={paths.profile}>
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
          <div className="font-bold">{data}</div>
          <ProfilePopover data={userId} logout={logout} />
        </div>
      </header>
    </div>
  );
};

export default HeaderPage;
