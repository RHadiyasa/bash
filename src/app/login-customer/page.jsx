"use client";

import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockKeyholeIcon,
  RecycleIcon,
  UserRoundIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginCustomerPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Username dan password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/customer/login",
        { username: username.trim(), password },
        { withCredentials: true }
      );
      toast.success(`Selamat datang, ${res.data.fullName || res.data.username}!`);
      router.push("/customer/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-card w-full max-w-sm rounded-xl p-8">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
              <RecycleIcon size={28} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold tracking-tight">
                Portal Nasabah
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Masuk untuk cek saldo & riwayat setoran
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <IconInput
                icon={UserRoundIcon}
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Masukkan username"
                className="glass-input h-11"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <IconInput
                icon={LockKeyholeIcon}
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Masukkan password"
                className="glass-input h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                rightSlot={
                  <button
                    type="button"
                    tabIndex={-1}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={16} />
                    ) : (
                      <EyeIcon size={16} />
                    )}
                  </button>
                }
              />
              <p className="text-xs text-muted-foreground">
                Password default sama dengan username jika belum pernah diganti.
              </p>
            </div>

            <Button
              type="submit"
              className="mt-2 h-11 w-full font-bold"
              disabled={loading}
            >
              {loading ? (
                <Loader2Icon size={16} className="animate-spin" />
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginCustomerPage;
