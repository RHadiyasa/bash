"use client";

import Link from "next/link";
import {
  Apple,
  ArrowRight,
  Battery,
  Boxes,
  Droplets,
  Layers,
  Leaf,
  PackageOpen,
  Recycle,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicNavbar from "@/components/public/publicNavbar";
import PublicFooter from "@/components/public/publicFooter";

const wasteTypes = [
  {
    icon: Apple,
    name: "Organik",
    desc: "Sisa makanan, daun, dan kulit buah. Bisa diolah jadi kompos.",
    tone: "text-emerald-500",
  },
  {
    icon: Boxes,
    name: "Anorganik",
    desc: "Plastik, kertas, logam, dan kaca. Sebagian besar bisa didaur ulang.",
    tone: "text-sky-500",
  },
  {
    icon: Battery,
    name: "B3 (Berbahaya)",
    desc: "Baterai, elektronik, dan bahan kimia. Butuh penanganan khusus.",
    tone: "text-amber-500",
  },
  {
    icon: Trash2,
    name: "Residu",
    desc: "Popok, puntung rokok, dan sisa tak terolah. Berakhir di TPA.",
    tone: "text-rose-500",
  },
];

const sortingSteps = [
  {
    icon: Droplets,
    title: "Pisahkan basah & kering",
    desc: "Sampah basah (organik) dipisah dari sampah kering (anorganik) sejak awal.",
  },
  {
    icon: PackageOpen,
    title: "Bersihkan kemasan",
    desc: "Bilas botol dan kemasan bekas agar tidak bau dan mudah didaur ulang.",
  },
  {
    icon: Layers,
    title: "Kelompokkan per jenis",
    desc: "Pisahkan plastik, kertas, logam, dan kaca ke wadah berbeda.",
  },
  {
    icon: Recycle,
    title: "Setor ke bank sampah",
    desc: "Bawa sampah terpilah ke bank sampah dan dapatkan nilai tabungan.",
  },
];

const recycleTips = [
  {
    icon: RefreshCw,
    title: "Reduce",
    desc: "Kurangi pemakaian barang sekali pakai seperti kantong dan sedotan plastik.",
  },
  {
    icon: PackageOpen,
    title: "Reuse",
    desc: "Pakai ulang wadah, botol, dan tas selama masih layak digunakan.",
  },
  {
    icon: Recycle,
    title: "Recycle",
    desc: "Daur ulang sampah anorganik menjadi barang baru yang bernilai.",
  },
  {
    icon: Leaf,
    title: "Kompos",
    desc: "Olah sampah organik rumahan menjadi pupuk kompos yang menyuburkan.",
  },
];

const EdukasiPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_0%,hsl(var(--primary)/0.12),transparent_60%),radial-gradient(50%_50%_at_90%_20%,hsl(var(--primary)/0.08),transparent_60%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <PublicNavbar />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
          <section className="py-14 sm:py-20">
            <div className="glass inline-flex items-center gap-2 rounded-lg border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <Sparkles size={16} />
              Pusat Edukasi Sampah
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Pilah dari rumah, mulai dari hal kecil.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Memilah sampah dengan benar membuat daur ulang lebih mudah dan
              nilai tabungan sampahmu makin besar. Yuk pelajari dasarnya.
            </p>
          </section>

          <section aria-labelledby="jenis-sampah" className="pb-16">
            <h2 id="jenis-sampah" className="text-2xl font-extrabold sm:text-3xl">
              Jenis Sampah
            </h2>
            <p className="mt-2 text-muted-foreground">
              Kenali empat kelompok utama sampah agar tidak salah pilah.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {wasteTypes.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.name} className="glass-card rounded-lg p-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background/50">
                      <Icon size={22} className={item.tone} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{item.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.desc}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="cara-memilah" className="pb-16">
            <h2 id="cara-memilah" className="text-2xl font-extrabold sm:text-3xl">
              Cara Memilah
            </h2>
            <p className="mt-2 text-muted-foreground">
              Empat langkah sederhana sebelum menyetor ke bank sampah.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {sortingSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article
                    key={step.title}
                    className="glass-card flex gap-4 rounded-lg p-5"
                  >
                    <div className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                      <Icon size={20} />
                      <span className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="daur-ulang" className="pb-16">
            <h2 id="daur-ulang" className="text-2xl font-extrabold sm:text-3xl">
              Tips Daur Ulang
            </h2>
            <p className="mt-2 text-muted-foreground">
              Prinsip 3R + kompos untuk mengurangi sampah ke TPA.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recycleTips.map((tip) => {
                const Icon = tip.icon;
                return (
                  <article key={tip.title} className="glass-card rounded-lg p-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{tip.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {tip.desc}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="pb-16">
            <div className="glass-card flex flex-col items-start gap-5 rounded-lg p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold">
                  Siap ubah sampah jadi tabungan?
                </h2>
                <p className="mt-2 max-w-xl text-muted-foreground">
                  Pelajari keuntungan bergabung dan cara mendaftar sebagai bank
                  sampah atau nasabah.
                </p>
              </div>
              <Button asChild size="lg" className="gap-2">
                <Link href="/promosi">
                  Lihat Promosi
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </div>
  );
};

export default EdukasiPage;
