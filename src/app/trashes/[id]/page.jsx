"use client";
import React, { useEffect, useMemo, useState } from "react";
import { fetchTrashesById } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeftIcon,
  BanknoteIcon,
  FileTextIcon,
  HistoryIcon,
  Layers3Icon,
  PackageIcon,
  RecycleIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import UpdateTrash from "@/app/trashes/[id]/_components/updateTrash";
import TrashUpdateList from "@/app/trashes/[id]/_components/trashUpdateList";
import RafiHadiyasa from "@/components/copyright";
import HeaderPage from "@/components/header/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import formatRupiah from "@/lib/helpers/formatRupiah";

export default function DetailTrashPage() {
  const [trashes, setTrashes] = useState([]);
  const [notFound, setNotFound] = useState(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const loadTrashes = async () => {
      try {
        // const token = process.env.TOKEN_SECRET;
        const token = localStorage.getItem("token");
        const trashesData = await fetchTrashesById(id, token);

        if (!trashesData) {
          setNotFound("Sampah tidak ditemukan...");
          router.push("/trashes");
          return;
        }
        setTrashes(trashesData);
      } catch (error) {
        console.error("An error occurred while fetching trash");
        setNotFound("Sampah tidak ditemukan...");
        router.push("/trashes");
      }
    };
    loadTrashes();
  }, [id, router]);

  const hasTrash = trashes && Object.keys(trashes).length > 0;
  const categoryName = trashes?.trashCategory?.categoryName || "Belum berkategori";
  const changeLogCount = trashes?.changeLogs?.length || 0;
  const descriptionLength = trashes?.trashDescription?.length || 0;
  const price = Number(trashes?.trashPrice || 0);

  const summaryCards = useMemo(
    () => [
      {
        label: "Harga saat ini",
        value: hasTrash ? formatRupiah(price) : "...",
        caption: "per kilogram",
        icon: BanknoteIcon,
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
      },
      {
        label: "Kategori",
        value: categoryName,
        caption: "kelompok material",
        icon: Layers3Icon,
        className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-200",
      },
      {
        label: "Riwayat",
        value: `${changeLogCount} update`,
        caption: "perubahan tercatat",
        icon: HistoryIcon,
        className: "bg-amber-500/10 text-amber-700 dark:text-amber-200",
      },
      {
        label: "Deskripsi",
        value: descriptionLength ? `${descriptionLength} karakter` : "Kosong",
        caption: "keterangan material",
        icon: FileTextIcon,
        className: "bg-violet-500/10 text-violet-700 dark:text-violet-200",
      },
    ],
    [categoryName, changeLogCount, descriptionLength, hasTrash, price]
  );

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6 lg:p-7">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/trashes`}>
                  Sampah & Kategori
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`#`}
                  className="font-semibold text-foreground"
                >
                  Detail Sampah
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <RecycleIcon size={14} />
                Material Detail
              </div>
              <h1 className="break-words text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                {trashes.trashName || "Edit Sampah"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Kelola identitas material, harga per kilogram, kategori,
                deskripsi, gambar, dan riwayat perubahan tanpa kehilangan
                konteks data sebelumnya.
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/45 p-4 shadow-sm backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Snapshot
                  </div>
                  <div className="mt-2 truncate text-lg font-extrabold">
                    {hasTrash ? categoryName : "Memuat data"}
                  </div>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                  <PackageIcon size={20} />
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="rounded-md border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-200"
                >
                  {hasTrash ? formatRupiah(price) : "..."}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-md border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-cyan-700 dark:text-cyan-200"
                >
                  {changeLogCount} update
                </Badge>
              </div>
              <Link href={`/trashes`}>
                <Button
                  variant="outline"
                  className="mt-4 h-10 w-full gap-2 border-border/70 bg-background/60 font-bold"
                >
                  <ArrowLeftIcon size={16} />
                  Kembali
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="glass-card rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 truncate text-xl font-black tracking-tight">
                      {item.value}
                    </p>
                  </div>
                  <span className={`rounded-lg p-2.5 ${item.className}`}>
                    <Icon size={18} />
                  </span>
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground">
                  {item.caption}
                </p>
              </div>
            );
          })}
        </section>

        <TrashUpdateList trashes={trashes} notFound={notFound} featured />

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <Card className="glass-card h-fit overflow-hidden rounded-lg">
            <CardHeader className="border-b border-border/60 bg-background/30">
              {notFound ? (
                <div className="font-extrabold">Sampah tidak ditemukan</div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xl font-black">
                      <SparklesIcon size={20} className="text-primary" />
                      Studio Edit Material
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {trashes.trashName || "Loading sampah..."}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="w-fit rounded-md border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                  >
                    ID {trashes._id || "-"}
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              {hasTrash ? (
                <UpdateTrash {...trashes} />
              ) : (
                <div className="rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center text-sm font-bold">
                  Loading data
                </div>
              )}
            </CardContent>
          </Card>

          <aside className="grid h-fit gap-5">
            <Card className="glass-card h-fit overflow-hidden rounded-lg">
              <CardHeader className="border-b border-border/60 bg-background/30">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileTextIcon size={18} />
                  </span>
                  <div>
                    <div className="font-black">Ringkasan Material</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Informasi yang sedang tersimpan
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 p-4">
                <div className="rounded-lg border border-border/60 bg-background/45 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Nama
                  </div>
                  <div className="mt-2 text-sm font-extrabold">
                    {trashes.trashName || "-"}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-lg border border-border/60 bg-background/45 p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Harga
                    </div>
                    <div className="mt-2 text-sm font-extrabold">
                      {hasTrash ? formatRupiah(price) : "-"}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/45 p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Kategori
                    </div>
                    <div className="mt-2 text-sm font-extrabold">
                      {categoryName}
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/45 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Deskripsi
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {trashes.trashDescription || "Belum ada deskripsi."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
        <RafiHadiyasa />
      </main>
    </div>
  );
}
