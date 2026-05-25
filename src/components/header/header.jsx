"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { BoxesIcon, MenuIcon, CoinsIcon, PackageIcon, HandCoinsIcon, ClipboardListIcon } from "lucide-react";
import { IoPeopleSharp, IoWarningOutline } from "react-icons/io5";
import { MdOutlineSpaceDashboard } from "react-icons/md";
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
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import useBankSampahData from "@/hooks/useBankSampahData";
import ThemeToggle from "@/components/themeToggle";

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
    inventory: path.startsWith("/inventory"),
    sales: path.startsWith("/sales"),
    reports: path.startsWith("/reports"),
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
    <div className="flex flex-col">
      <LoadingBar
        color="#8dCC9E"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Toaster position="bottom-left" />
      <header className="sticky top-0 z-40 w-full px-4 pt-3 sm:px-6 lg:px-8">
        <div className="glass-nav mx-auto flex min-h-16 max-w-7xl items-center rounded-lg px-4 py-3 md:min-h-20 lg:px-6">
        <nav className="hidden md:flex flex-col gap-6 text-lg font-bold md:flex-row md:items-center md:gap-4 md:text-sm lg:gap-8">
          <Link
            onClick={() => loadingHandler(`/profile/${userId}`)}
            href={`/profile/${userId}`}
            className="inline-flex items-center gap-2 rounded-md text-xl font-extrabold text-foreground transition-colors hover:text-primary lg:text-2xl"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
              B
            </span>
            <span>BashApp</span>
          </Link>
          <div className="glass flex flex-row items-center justify-center gap-1 rounded-lg p-1 md:ml-2">
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
            <NavLink
              onClick={() => loadingHandler(`/inventory`)}
              href="/inventory"
              active={paths.inventory}
            >
              Stok
            </NavLink>
            <NavLink
              onClick={() => loadingHandler(`/sales`)}
              href="/sales"
              active={paths.sales}
            >
              Penjualan
            </NavLink>
            <NavLink
              onClick={() => loadingHandler(`/reports`)}
              href="/reports"
              active={paths.reports}
            >
              Laporan
            </NavLink>
          </div>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground gap-2 flex justify-center items-center">
              <MenuIcon />
              <span className="font-bold">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-10">
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
                <div className="flex items-center py-4 gap-2 hover:bg-accent hover:text-accent-foreground hover:rounded-md hover:pl-4">
                  <MdOutlineSpaceDashboard size={25} />
                  <div>Dashboard</div>
                </div>
              </NavLink>
              <NavLink href="/trashes" active={paths.trashes}>
                <div className="flex items-center py-4 gap-2 hover:bg-accent hover:text-accent-foreground hover:rounded-md hover:pl-4">
                  <PackageIcon />
                  <div>Sampah</div>
                </div>
              </NavLink>
              <NavLink href="/customers" active={paths.customers}>
                <div className="flex items-center py-4 gap-2 hover:bg-accent hover:text-accent-foreground hover:rounded-md hover:pl-4">
                  <IoPeopleSharp size={25} />
                  <div>Nasabah</div>
                </div>
              </NavLink>
              <NavLink href="/transactions" active={paths.transactions}>
                <div className="flex items-center py-4 gap-2 hover:bg-accent hover:text-accent-foreground hover:rounded-md hover:pl-4">
                  <CoinsIcon />
                  <div>Transaksi</div>
                </div>
              </NavLink>
              <NavLink href="/inventory" active={paths.inventory}>
                <div className="flex items-center py-4 gap-2 hover:bg-accent hover:text-accent-foreground hover:rounded-md hover:pl-4">
                  <BoxesIcon />
                  <div>Stok</div>
                </div>
              </NavLink>
              <NavLink href="/sales" active={paths.sales}>
                <div className="flex items-center py-4 gap-2 hover:bg-accent hover:text-accent-foreground hover:rounded-md hover:pl-4">
                  <HandCoinsIcon />
                  <div>Penjualan</div>
                </div>
              </NavLink>
              <NavLink href="/reports" active={paths.reports}>
                <div className="flex items-center py-4 gap-2 hover:bg-accent hover:text-accent-foreground hover:rounded-md hover:pl-4">
                  <ClipboardListIcon />
                  <div>Laporan</div>
                </div>
              </NavLink>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex w-full min-w-0 justify-end px-2 md:px-5 items-center gap-3">
          <ThemeToggle />
          <div className="hidden max-w-[220px] truncate font-bold text-foreground sm:block">
            {bankSampahProfile.name}
          </div>
          <ProfilePopover
            bankSampah={bankSampahProfile}
            data={userId}
            logout={logout}
            setProgress={setProgress}
          />
        </div>
        </div>
      </header>
    </div>
  );
};

export default HeaderPage;
