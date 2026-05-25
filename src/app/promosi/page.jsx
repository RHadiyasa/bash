"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardList,
  Coins,
  LineChart,
  Megaphone,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicNavbar from "@/components/public/publicNavbar";
import PublicFooter from "@/components/public/publicFooter";

const roles = [
  {
    icon: Building2,
    role: "Untuk Bank Sampah",
    desc: "Kelola operasional harian secara digital tanpa ribet.",
    points: [
      "Data nasabah & saldo tertata rapi",
      "Kategori dan harga sampah mudah diatur",
      "Riwayat transaksi tercatat otomatis",
    ],
    cta: { label: "Login Bank Sampah", href: "/login" },
  },
  {
    icon: UserRound,
    role: "Untuk Nasabah",
    desc: "Ubah sampah jadi tabungan yang transparan.",
    points: [
      "Saldo tabungan bisa dicek kapan saja",
      "Riwayat setor & tarik jelas",
      "Setor sampah, dapat nilai rupiah",
    ],
    cta: { label: "Login Nasabah", href: "/login-customer" },
  },
];

const benefits = [
  {
    icon: Wallet,
    title: "Tabungan transparan",
    desc: "Setiap setoran sampah tercatat dan langsung jadi saldo nasabah.",
  },
  {
    icon: LineChart,
    title: "Operasional terukur",
    desc: "Pantau performa bank sampah lewat data yang ringkas dan jelas.",
  },
  {
    icon: ShieldCheck,
    title: "Akses aman",
    desc: "Login pengelola dan nasabah dipisah agar data tetap terjaga.",
  },
  {
    icon: Coins,
    title: "Nilai ekonomi",
    desc: "Sampah terpilah punya nilai jual, bukan sekadar dibuang.",
  },
];

const steps = [
  {
    icon: ClipboardList,
    title: "Daftar",
    desc: "Buat akun bank sampah, lengkapi profil dan lokasi operasional.",
  },
  {
    icon: UserPlus,
    title: "Tambah nasabah",
    desc: "Daftarkan nasabah dan atur kategori serta harga sampah.",
  },
  {
    icon: BadgeCheck,
    title: "Mulai transaksi",
    desc: "Catat setoran dan penarikan, saldo nasabah update otomatis.",
  },
];

const PromosiPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_0%,hsl(var(--primary)/0.14),transparent_60%),radial-gradient(50%_50%_at_10%_25%,hsl(var(--primary)/0.08),transparent_60%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <PublicNavbar />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
          <section className="py-14 text-center sm:py-20">
            <div className="glass mx-auto inline-flex items-center gap-2 rounded-lg border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <Megaphone size={16} />
              Gabung Gerakan Bank Sampah
            </div>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Ubah sampah jadi tabungan, kelola dengan rapi.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              BASH membantu bank sampah dan nasabah mengelola setoran,
              transaksi, dan saldo dalam satu platform yang mudah digunakan.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/login">
                  <Building2 size={18} />
                  Login Bank Sampah
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/login-customer">
                  <UserRound size={18} />
                  Login Nasabah
                </Link>
              </Button>
            </div>
          </section>

          <section aria-label="Pilihan peran" className="pb-16">
            <div className="grid gap-4 md:grid-cols-2">
              {roles.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.role} className="glass-card rounded-lg p-7">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                      <Icon size={24} />
                    </div>
                    <h2 className="mt-5 text-xl font-extrabold">{item.role}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                    <ul className="mt-5 grid gap-3">
                      {item.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm">
                          <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0 text-primary"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="mt-6 w-full gap-2">
                      <Link href={item.cta.href}>
                        {item.cta.label}
                        <ArrowRight size={18} />
                      </Link>
                    </Button>
                  </article>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="manfaat" className="pb-16">
            <h2 id="manfaat" className="text-2xl font-extrabold sm:text-3xl">
              Kenapa pakai BASH?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Manfaat utama untuk pengelola maupun nasabah.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="glass-card rounded-lg p-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.desc}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="cara-daftar" className="pb-16">
            <h2 id="cara-daftar" className="text-2xl font-extrabold sm:text-3xl">
              Cara Bergabung
            </h2>
            <p className="mt-2 text-muted-foreground">
              Tiga langkah untuk mulai mengelola bank sampah.
            </p>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="glass-card rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                        <Icon size={20} />
                      </div>
                      <span className="text-3xl font-black text-primary/25">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.desc}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="pb-16">
            <div className="glass-card flex flex-col items-center gap-5 rounded-lg p-10 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                Mulai sekarang, gratis untuk dicoba.
              </h2>
              <p className="max-w-xl text-muted-foreground">
                Daftarkan bank sampahmu dan rasakan kemudahan mengelola nasabah
                serta transaksi secara digital.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/register">
                    <UserPlus size={18} />
                    Daftar Bank Sampah
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link href="/edukasi">
                    Pelajari Edukasi
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </div>
  );
};

export default PromosiPage;
