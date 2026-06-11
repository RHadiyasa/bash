"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LogIn, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/themeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Edukasi", href: "/edukasi" },
  { label: "Promosi", href: "/promosi" },
];

const PublicNavbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 sm:px-6">
      <nav className="glass-nav mx-auto flex max-w-6xl items-center justify-between rounded-lg px-4 py-2.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-foreground transition hover:text-primary"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
            <Leaf size={18} />
          </span>
          BASH
        </Link>

        <div className="hidden items-center gap-1 rounded-lg border border-border/60 bg-background/40 p-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-semibold transition",
                isActive(item.href)
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button asChild className="hidden gap-2 md:inline-flex">
            <Link href="/login">
              <LogIn size={16} />
              Masuk
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Buka menu"
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l border-border bg-background">
              <SheetTitle>
                <span className="inline-flex items-center gap-2 text-lg font-extrabold text-foreground">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                    <Leaf size={18} />
                  </span>
                  BASH
                </span>
              </SheetTitle>
              <SheetDescription className="mt-1">
                Bank Sampah Indonesia
              </SheetDescription>

              <div className="mt-8 grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-4 py-3 text-base font-semibold transition",
                      isActive(item.href)
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Button asChild className="mt-6 w-full gap-2">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <LogIn size={16} />
                  Masuk
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default PublicNavbar;
