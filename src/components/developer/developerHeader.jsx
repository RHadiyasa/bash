"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { LogOut, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/themeToggle";

const DeveloperHeader = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      if (typeof window !== "undefined") localStorage.removeItem("token");
      toast.success("Logout berhasil");
      router.push("/login");
    } catch {
      toast.error("Gagal logout");
    }
  };

  return (
    <>
      <Toaster position="bottom-left" />
      <header className="sticky top-0 z-40 w-full px-4 pt-3 sm:px-6 lg:px-8">
        <div className="glass-nav mx-auto flex min-h-16 max-w-7xl items-center justify-between rounded-lg px-4 py-3 md:min-h-20 lg:px-6">
          <Link
            href="/developer"
            className="inline-flex items-center gap-2 text-lg font-extrabold text-foreground transition hover:text-primary"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
              <Terminal size={18} />
            </span>
            <span>
              BASH <span className="text-primary">Developer</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              className="h-10 gap-2 border-border/70 bg-background/60 font-bold"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default DeveloperHeader;
