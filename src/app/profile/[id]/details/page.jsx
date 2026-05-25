"use client";

import HeaderPage from "@/components/header/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import formatRupiah from "@/lib/helpers/formatRupiah";
import useBankSampahData from "@/hooks/useBankSampahData";
import useCategoryData from "@/hooks/useCategoryData";
import useCustomersData from "@/hooks/useCustomersData";
import useTransactions from "@/hooks/useTransactions";
import useTrashesData from "@/hooks/useTrashesData";
import {
  ArrowLeftIcon,
  BadgePercentIcon,
  BanknoteIcon,
  Building2Icon,
  CalendarDaysIcon,
  DatabaseIcon,
  Loader2Icon,
  MailIcon,
  MinusIcon,
  PencilLineIcon,
  PhoneIcon,
  PlusIcon,
  Settings2Icon,
  SquareStackIcon,
  Trash2Icon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Avatar from "react-avatar";
import toast, { Toaster } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import EditProfile from "./_components/editProfile";
import { updateTransactionFee } from "@/modules/services/user.service";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getAddress = (profile) => {
  if (Array.isArray(profile?.address)) {
    return profile.address[0] ?? {};
  }

  return profile?.address ?? {};
};

const BankSampahProfilePage = () => {
  const searchParams = useSearchParams();
  const requestedTab =
    searchParams.get("tab") === "konfigurasi" ? "konfigurasi" : "profile";
  const { bankSampahProfile } = useBankSampahData();
  const { transactionsData } = useTransactions();
  const { customers } = useCustomersData();
  const { trashes } = useTrashesData();
  const { categories } = useCategoryData();
  const [activeTab, setActiveTab] = useState(requestedTab);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [transactionFee, setTransactionFee] = useState(0);
  const [initial, setInitial] = useState(0);

  useEffect(() => {
    setActiveTab(requestedTab);
  }, [requestedTab]);

  useEffect(() => {
    if (bankSampahProfile?.transactionFee !== undefined) {
      setTransactionFee(bankSampahProfile.transactionFee);
      setInitial(bankSampahProfile.transactionFee);
    }
  }, [bankSampahProfile]);

  const address = useMemo(
    () => getAddress(bankSampahProfile),
    [bankSampahProfile]
  );
  const profileName = bankSampahProfile?.name || "Bank Sampah";
  const transactionsCount = transactionsData?.length ?? 0;
  const customersCount = customers?.length ?? 0;
  const trashCount = trashes?.length ?? 0;
  const categoryCount = categories?.length ?? 0;

  const summaryCards = [
    {
      label: "Pendapatan",
      value: formatRupiah(bankSampahProfile?.revenue ?? 0),
      helper: "Revenue aktif",
      icon: BanknoteIcon,
      className: "bg-primary/10 text-primary",
    },
    {
      label: "Nasabah",
      value: `${customersCount} nasabah`,
      helper: "Total terdaftar",
      icon: UsersIcon,
      className: "bg-cyan-500/10 text-cyan-300",
    },
    {
      label: "Transaksi",
      value: `${transactionsCount} transaksi`,
      helper: "Seluruh riwayat",
      icon: DatabaseIcon,
      className: "bg-amber-500/10 text-amber-300",
    },
    {
      label: "Sampah",
      value: `${trashCount} item`,
      helper: `${categoryCount} kategori`,
      icon: Trash2Icon,
      className: "bg-violet-500/10 text-violet-300",
    },
  ];

  const profileRows = [
    {
      label: "Nama Bank Sampah",
      value: bankSampahProfile?.name || "Belum Ada",
      icon: Building2Icon,
    },
    {
      label: "Email",
      value: bankSampahProfile?.email || "-",
      icon: MailIcon,
    },
    {
      label: "Username",
      value: bankSampahProfile?.username || "-",
      icon: UserCogIcon,
    },
    {
      label: "Nomor Whatsapp",
      value: bankSampahProfile?.phoneNumber || "Tambah Whatsapp",
      icon: PhoneIcon,
    },
    {
      label: "Alamat",
      value: address?.region || "Tambah Alamat",
      icon: Building2Icon,
    },
    {
      label: "Tanggal Bergabung",
      value: formatDateTime(bankSampahProfile?.createdAt),
      icon: CalendarDaysIcon,
    },
  ];

  const addFee = () => {
    setTransactionFee(transactionFee + 1);
    setMessage("");
  };

  const subtractFee = () => {
    if (transactionFee > 0) {
      setTransactionFee(transactionFee - 1);
      setMessage("");
      return;
    }

    setMessage("Tidak boleh kurang dari 0%.");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateTransactionFee({ transactionFee });
      setInitial(transactionFee);
      toast.success("Biaya transaksi berhasil diperbarui");
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui biaya transaksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <Toaster position="bottom-left" />
      <main className="mx-auto grid w-full max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6 lg:p-7">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <UserCogIcon size={14} />
                Akun Bank Sampah
              </div>
              <h1 className="break-words text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                {profileName}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm leading-6 text-muted-foreground sm:text-base">
                <span>{address?.region || "Tambah Alamat"}</span>
                <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/60 sm:inline-flex" />
                <span className="inline-flex items-center gap-1">
                  <FaWhatsapp size={15} />
                  {bankSampahProfile?.phoneNumber || "Tambah Whatsapp"}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/profile/${bankSampahProfile?._id || ""}`}>
                <Button
                  variant="outline"
                  className="h-10 gap-2 border-border/70 bg-background/60 font-bold"
                >
                  <ArrowLeftIcon size={16} />
                  Dashboard
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-10 gap-2 font-bold">
                    <PencilLineIcon size={16} />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card !w-[min(94vw,560px)] rounded-lg">
                  <DialogTitle>
                    <div className="text-xl font-black">Edit Profile</div>
                    <DialogDescription className="mt-1">
                      Edit profile Bank Sampah {profileName}
                    </DialogDescription>
                  </DialogTitle>
                  <EditProfile bankSampahProfile={bankSampahProfile} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        <Card className="glass-card overflow-hidden rounded-lg">
          <CardContent className="grid gap-5 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-lg border border-border/60 bg-background/45 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="mt-2 truncate text-lg font-black">
                          {item.value}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                          {item.helper}
                        </p>
                      </div>
                      <span className={`rounded-lg p-2.5 ${item.className}`}>
                        <Icon size={18} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
                  <SquareStackIcon size={15} />
                  Pilih Tampilan Akun
                </div>
                <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-border/60 bg-background/60 p-1 shadow-inner">
                  <TabsTrigger
                    value="profile"
                    className="rounded-md px-3 py-3 text-xs font-black data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm sm:text-sm"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="konfigurasi"
                    className="rounded-md px-3 py-3 text-xs font-black data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm sm:text-sm"
                  >
                    Konfigurasi
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="profile" className="mt-5">
                <Card className="glass-card overflow-hidden rounded-lg">
                  <CardHeader className="border-b border-border/60 bg-background/30">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <Avatar
                          size="64"
                          color={Avatar.getRandomColor("sitebase", [
                            "#F87171",
                            "#4ADE80",
                            "#60A5FA",
                          ])}
                          name={profileName}
                          round={false}
                          className="rounded-2xl"
                        />
                        <div className="min-w-0">
                          <h2 className="break-words text-2xl font-black tracking-tight">
                            {profileName}
                          </h2>
                          <CardDescription className="mt-2 leading-6">
                            {bankSampahProfile?.email || "-"} / @
                            {bankSampahProfile?.username || "banksampah"}
                          </CardDescription>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className="rounded-md border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                            >
                              Fee {transactionFee}%
                            </Badge>
                            <Badge
                              variant="outline"
                              className="rounded-md border-border/60 bg-background/50 px-3 py-1 text-xs font-bold text-muted-foreground"
                            >
                              ID {bankSampahProfile?._id || "-"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 sm:p-6">
                    <div className="grid gap-x-8 gap-y-1 lg:grid-cols-2">
                      {profileRows.map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.label}
                            className="flex min-h-16 items-center justify-between gap-4 border-b border-border/50 py-3 last:border-b-0 lg:last:border-b"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Icon size={16} />
                              </span>
                              <div className="min-w-0">
                                <div className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                                  {item.label}
                                </div>
                                <div className="mt-1 break-words text-sm font-extrabold">
                                  {item.value || "-"}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="konfigurasi" className="mt-5">
                <div className="grid gap-5">
                  <Card className="glass-card overflow-hidden rounded-lg">
                    <CardHeader className="border-b border-border/60 bg-background/30">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                            <Settings2Icon size={14} />
                            Konfigurasi Biaya
                          </div>
                          <h2 className="text-2xl font-black">
                            Biaya Transaksi
                          </h2>
                          <CardDescription className="mt-2 max-w-3xl leading-6">
                            Biaya transaksi dibebankan kepada nasabah untuk
                            setiap transaksi deposit. Seluruh biaya transaksi
                            tetap menjadi milik pengurus Bank Sampah.
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className="w-fit rounded-md border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                        >
                          Saat ini {initial}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-6 p-5 sm:p-6">
                      <div className="flex flex-col items-center justify-center gap-5 rounded-lg border border-border/60 bg-background/35 p-5 text-center">
                        <div className="flex items-center justify-center gap-5">
                          <Button
                            className="h-11 w-11 rounded-full p-0"
                            onClick={subtractFee}
                            disabled={transactionFee <= 0}
                          >
                            <MinusIcon size={20} />
                          </Button>
                          <div className="min-w-28 text-4xl font-black">
                            {transactionFee}%
                          </div>
                          <Button
                            className="h-11 w-11 rounded-full p-0"
                            onClick={addFee}
                          >
                            <PlusIcon size={20} />
                          </Button>
                        </div>
                        <p className="text-sm font-semibold text-muted-foreground">
                          {transactionFee !== initial
                            ? message || "Ada perubahan yang belum disimpan."
                            : `Biaya transaksi Bank Sampah saat ini ${transactionFee}%.`}
                        </p>
                        <Button
                          disabled={initial === transactionFee || loading}
                          onClick={handleSubmit}
                          className="w-full max-w-sm font-bold"
                        >
                          {loading ? (
                            <Loader2Icon className="animate-spin" size={18} />
                          ) : (
                            "Simpan Konfigurasi"
                          )}
                        </Button>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-3">
                        {[
                          "Sampah A: Rp. 3.000/kg",
                          "Sampah B: Rp. 4.000/kg",
                          "Sampah C: Rp. 5.000/kg",
                        ].map((item) => (
                          <div
                            key={item}
                            className="rounded-lg border border-border/60 bg-background/35 p-4 text-sm font-bold"
                          >
                            {item}
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-lg border border-border/60 bg-background/35 p-4">
                          <div className="mb-3 flex items-center gap-2 text-sm font-black">
                            <BadgePercentIcon size={16} />
                            Dasar Perhitungan
                          </div>
                          <div className="grid gap-3 text-sm text-muted-foreground">
                            <p>
                              Keuntungan pengurus = nilai transaksi x biaya
                              transaksi (%).
                            </p>
                            <p>
                              Deposit nasabah = nilai transaksi - keuntungan
                              pengurus.
                            </p>
                          </div>
                        </div>
                        <div className="rounded-lg border border-border/60 bg-background/35 p-4">
                          <div className="mb-3 flex items-center gap-2 text-sm font-black">
                            <BanknoteIcon size={16} />
                            Contoh Kasus
                          </div>
                          <div className="grid gap-2 text-sm text-muted-foreground">
                            <p>
                              Sampah A 3 kg + Sampah B 5 kg + Sampah C 2 kg =
                              Rp. 39.000.
                            </p>
                            <p className="font-bold text-foreground">
                              Dengan biaya 10%, deposit nasabah menjadi Rp.
                              35.100.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BankSampahProfilePage;
