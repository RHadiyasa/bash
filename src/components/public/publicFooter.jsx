"use client";

import Link from "next/link";
import {
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Recycle,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Edukasi", href: "/edukasi" },
  { label: "Promosi", href: "/promosi" },
  { label: "Masuk", href: "/login" },
];

const PublicFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full px-4 pb-6 sm:px-6">
      <div className="glass-card mx-auto max-w-6xl rounded-lg p-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-extrabold text-foreground transition hover:text-primary"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                <Leaf size={18} />
              </span>
              BASH Indonesia
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Platform digital pengelolaan bank sampah — bantu kelola nasabah,
              transaksi, kategori sampah, dan saldo dengan rapi.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background/40 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:halo@bash.id"
                aria-label="Email"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background/40 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Recycle size={16} className="text-primary" />
              Tautan
            </h3>
            <ul className="mt-4 grid gap-2.5">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground">Kontak</h3>
            <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>halo@bash.id</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>+62 812-0000-0000</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {year} BASH Indonesia. Semua hak dilindungi.</span>
          <span>Jaga bumi, mulai dari sini.</span>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
