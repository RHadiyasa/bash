"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  LockKeyhole,
  Mail,
  Recycle,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import axios from "axios";
import React from "react";
import ThemeToggle from "@/components/themeToggle";
import "./styles.css";

const benefits = [
  {
    icon: Recycle,
    title: "Transaksi tertata",
    description: "Pantau setoran, penarikan, dan kategori sampah dari satu tempat.",
  },
  {
    icon: ShieldCheck,
    title: "Akses pengelola",
    description: "Login khusus bank sampah untuk menjaga data operasional tetap aman.",
  },
  {
    icon: Sparkles,
    title: "Dashboard ringkas",
    description: "Masuk langsung ke profil dan performa bank sampah Anda.",
  },
];

const LoginPage = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const toggleVisibility = () => setIsVisible((current) => !current);

  const onLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!user.email || !user.password) {
      setMessage("Email dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/users/login", user);
      const { userId, role } = response.data;

      toast.success("Login berhasil.");
      setTimeout(() => {
        router.push(role === "developer" ? "/developer" : `/profile/${userId}`);
      }, 500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Email atau password tidak valid.";

      setMessage(errorMessage);
      toast.error("Login gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell relative min-h-screen overflow-hidden bg-background text-foreground">
      <Toaster position="top-left" />
      <div className="login-brand-glow absolute inset-0" />
      <div className="login-grid absolute inset-0" />
      <div className="login-fade absolute inset-0" />

      <main className="login-main relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col overflow-hidden px-5 py-5 sm:px-8">
        <nav className="login-nav glass-nav flex items-center justify-between rounded-lg px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md text-sm font-bold text-foreground transition hover:text-primary"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
              <Leaf size={18} />
            </span>
            BASH
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Home
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        <section className="grid min-w-0 flex-1 items-center gap-10 py-10 lg:grid-cols-[1.04fr_0.96fr] lg:py-14">
          <div className="login-intro min-w-0 space-y-8">
            <div className="glass inline-flex items-center gap-2 rounded-lg border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <ShieldCheck size={17} />
              Akses resmi pengelola bank sampah
            </div>

            <div className="max-w-2xl space-y-5">
              <h1 className="login-hero-title text-4xl font-black leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
                Masuk dan kelola operasional dengan lebih tenang.
              </h1>
              <p className="login-copy max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                Dashboard BASH membantu pengelola memantau nasabah, kategori
                sampah, transaksi, dan saldo tanpa tampilan yang berantakan.
              </p>
            </div>

            <div className="login-benefits grid min-w-0 gap-3 sm:grid-cols-3">
              {benefits.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="login-feature-card glass-card min-w-0 rounded-lg p-4"
                  >
                    <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                      <Icon size={18} />
                    </div>
                    <h2 className="text-sm font-extrabold text-foreground">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <Card className="login-form-card glass-card mx-auto w-full max-w-md rounded-lg p-2 text-foreground">
            <CardHeader className="space-y-3 px-5 pt-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                <LockKeyhole size={22} />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-normal text-foreground">
                  Login Bank Sampah
                </CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Gunakan email dan password yang terdaftar untuk masuk ke
                  dashboard.
                </p>
              </div>
            </CardHeader>

            <form onSubmit={onLogin}>
              <CardContent className="space-y-5 px-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80">
                    Email
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 z-10 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary shadow-sm">
                      <Mail size={15} />
                    </span>
                    <Input
                      id="email"
                      value={user.email}
                      onChange={(event) =>
                        setUser({ ...user, email: event.target.value })
                      }
                      className="glass-input h-12 rounded-lg pl-14 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/60"
                      type="email"
                      placeholder="nama@email.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground/80">
                    Password
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 z-10 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary shadow-sm">
                      <LockKeyhole size={15} />
                    </span>
                    <Input
                      id="password"
                      value={user.password}
                      onChange={(event) =>
                        setUser({ ...user, password: event.target.value })
                      }
                      className="glass-input h-12 rounded-lg pl-14 pr-12 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/60"
                      type={isVisible ? "text" : "password"}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
                      onClick={toggleVisibility}
                      aria-label={
                        isVisible
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {isVisible ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {message ? (
                  <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
                    {message}
                  </p>
                ) : null}
              </CardContent>

              <CardFooter className="grid gap-4 px-5 pb-6 pt-2">
                <Button
                  type="submit"
                  className="h-12 gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 font-bold text-emerald-950 shadow-xl transition hover:from-emerald-400 hover:to-teal-300"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LockKeyhole size={18} />
                  )}
                  {loading ? "Memproses..." : "Masuk Dashboard"}
                  {!loading ? <ArrowRight size={18} /> : null}
                </Button>

                <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/reset-password"
                    className="font-semibold text-foreground/80 transition hover:text-primary"
                  >
                    Lupa password?
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 font-bold text-primary transition hover:text-foreground"
                  >
                    <UserPlus size={16} />
                    Daftar Bank Sampah
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
