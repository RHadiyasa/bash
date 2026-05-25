"use client";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { getUserDetail } from "@/modules/services/user.service";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  CheckCircle2,
  LayoutDashboard,
  Leaf,
  Loader2,
  LogOut,
  Megaphone,
  Recycle,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import Link from "next/link";
import PublicFooter from "@/components/public/publicFooter";
import useGlobe from "@/hooks/useGlobe";
import "./styles.css";

const highlights = [
  {
    icon: Recycle,
    title: "Data sampah tertata",
    description: "Kategori, harga, dan stok lebih mudah dipantau setiap hari.",
  },
  {
    icon: WalletCards,
    title: "Saldo nasabah jelas",
    description: "Riwayat transaksi dan tabungan nasabah tampil ringkas.",
  },
  {
    icon: ShieldCheck,
    title: "Operasional aman",
    description: "Akses pengelola dan nasabah dibuat terpisah sejak awal.",
  },
];

const previewCards = [
  {
    icon: BookOpen,
    title: "Edukasi pemilahan",
    description:
      "Pelajari jenis sampah, cara memilah dari rumah, dan tips daur ulang yang bisa langsung diterapkan.",
    href: "/edukasi",
    cta: "Buka Edukasi",
  },
  {
    icon: Megaphone,
    title: "Promosi program",
    description:
      "Kenalkan manfaat bergabung, alur pendaftaran, dan ajakan untuk bank sampah maupun nasabah.",
    href: "/promosi",
    cta: "Lihat Promosi",
  },
];

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const canvasRef = useRef(null);
  useGlobe(canvasRef);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await getUserDetail();
        setUserData(res);
      } catch {
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  const handleClick = () => {
    if (userData?._id) {
      router.push(`/profile/${userData._id}`);
    } else {
      router.push("/login");
    }
  };

  const handleClickCustomer = () => {
    setLoading(true);
    router.push(`/login-customer`);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.get("/api/users/logout", { withCredentials: true });
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      setUserData(null);
      toast.success("Berhasil logout");
      router.refresh();
    } catch {
      toast.error("Gagal logout");
    } finally {
      setLoading(false);
    }
  };

  const isLoggedIn = Boolean(userData?._id);

  return (
    <div className="dark homepage-shell bg-black text-white">
      <div className="background">
        <canvas id="c" ref={canvasRef} aria-hidden="true"></canvas>
      </div>
      <div className="homepage-overlay" />

      <main className="foreground homepage-content">
        <Toaster position="top-right" />

        <nav className="home-nav" aria-label="Navigasi utama">
          <button
            type="button"
            className="brand-mark"
            onClick={() => router.push("/")}
            aria-label="BASH Indonesia"
          >
            <span className="brand-icon">
              <Leaf size={18} />
            </span>
            <span>BASH</span>
          </button>

          <div className="nav-links" aria-label="Navigasi halaman">
            <Link href="/edukasi">Edukasi</Link>
            <Link href="/promosi">Promosi</Link>
          </div>

          {loading ? (
            <Button type="button" variant="outline" className="nav-action" disabled>
              <Loader2 className="animate-spin" size={16} />
            </Button>
          ) : isLoggedIn ? (
            <div className="nav-actions">
              <Button
                type="button"
                className="nav-action nav-dashboard"
                onClick={() => router.push(`/profile/${userData._id}`)}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Button>
              <Button
                type="button"
                variant="outline"
                className="nav-action nav-logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="nav-action"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          )}
        </nav>

        <section className="hero-section" aria-labelledby="home-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <CheckCircle2 size={17} />
              <TypeAnimation
                sequence={[
                  "Mulai peduli",
                  1500,
                  "Mulai mandiri",
                  2000,
                  "Jaga bumi, mulai dari sini...",
                  4000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>

            <h1 id="home-title">BASH INDONESIA</h1>

            <p className="hero-description">
              Platform digital untuk membantu bank sampah mengelola data
              nasabah, transaksi, kategori sampah, dan saldo dengan tampilan
              yang lebih rapi.
            </p>

            <div className="hero-actions" id="akses">
              <Button
                type="button"
                size="lg"
                className="primary-cta"
                onClick={handleClick}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Building2 size={18} />
                )}
                {userData?._id
                  ? "Buka Dashboard"
                  : "Login Bank Sampah"}
                {!loading ? <ArrowRight size={18} /> : null}
              </Button>

              {isLoggedIn ? (
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="secondary-cta"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="secondary-cta"
                  onClick={handleClickCustomer}
                  disabled={loading}
                >
                  <UserRound size={18} />
                  Login Nasabah
                </Button>
              )}
            </div>
          </div>

          <div className="hero-status" aria-label="Ringkasan layanan">
            <div>
              <span className="status-value">Nasabah</span>
              <span className="status-label">data &amp; saldo tertata</span>
            </div>
            <div>
              <span className="status-value">Sampah</span>
              <span className="status-label">kategori &amp; harga</span>
            </div>
            <div>
              <span className="status-value">Transaksi</span>
              <span className="status-label">setor &amp; tarik tunai</span>
            </div>
          </div>
        </section>

        <section className="feature-grid" id="fitur" aria-label="Fitur utama">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <article className="feature-card" key={item.title}>
                <div className="feature-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <section
        className="foreground homepage-preview"
        aria-label="Preview edukasi dan promosi"
      >
        <div className="preview-header">
          <span className="preview-kicker">Langkah berikutnya</span>
          <h2>Bangun ekosistem bank sampah yang lebih mudah dipahami.</h2>
          <p>
            Setelah operasional tertata, BASH juga menyiapkan materi publik
            untuk edukasi pemilahan dan promosi gerakan bank sampah.
          </p>
        </div>

        <div className="preview-grid">
          {previewCards.map((item) => {
            const Icon = item.icon;

            return (
              <article className="preview-card" key={item.title}>
                <div className="preview-icon">
                  <Icon size={22} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <Button asChild className="preview-link">
                  <Link href={item.href}>
                    {item.cta}
                    <ArrowUpRight size={17} />
                  </Link>
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      <div className="foreground homepage-footer">
        <PublicFooter />
      </div>
    </div>
  );
}
