"use client";

import HeaderPage from "@/components/header/header";
import LoadingPage from "@/components/loadingPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconInput } from "@/components/ui/icon-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { getAllCustomers } from "@/modules/services/customer.service";
import { addTransaction } from "@/modules/services/transaction.service";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  HandCoinsIcon,
  Loader2Icon,
  ReceiptTextIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserRoundIcon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const MIN_WITHDRAW = 1000;

const CustomerOptionLabel = ({ customer }) => (
  <span className="truncate">
    {customer.fullName || "Nasabah"} - {customer.accountNumber || "-"}
  </span>
);

export default function WithdrawTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCustomerId = searchParams.get("customerId") || "";
  const isCustomerScoped = Boolean(initialCustomerId);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(initialCustomerId);
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const data = await getAllCustomers();
        setCustomers(data || []);
      } catch (error) {
        toast.error("Gagal memuat data nasabah");
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomers();
  }, []);

  useEffect(() => {
    if (initialCustomerId) {
      setSelectedCustomerId(initialCustomerId);
    }
  }, [initialCustomerId]);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer._id === selectedCustomerId),
    [customers, selectedCustomerId]
  );

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return customers;

    return customers.filter((customer) =>
      [customer.fullName, customer.accountNumber, customer.username]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [customers, search]);

  const amountNumber = Number(amount || 0);
  const balance = Number(selectedCustomer?.balance || 0);
  const remainingBalance = Math.max(balance - amountNumber, 0);
  const canSubmit =
    selectedCustomer &&
    amountNumber >= MIN_WITHDRAW &&
    amountNumber <= balance &&
    !submitting;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCustomer) {
      toast.error("Pilih nasabah terlebih dahulu");
      return;
    }

    if (amountNumber < MIN_WITHDRAW) {
      toast.error("Minimum tarik saldo Rp. 1,000");
      return;
    }

    if (amountNumber > balance) {
      toast.error("Saldo nasabah tidak mencukupi");
      return;
    }

    setSubmitting(true);
    try {
      await addTransaction({
        customer: selectedCustomer._id,
        trash: null,
        trashWeight: 0,
        transactionAmount: amountNumber,
        transactionType: "withdraw",
        transactionStatus: "completed",
        clientRequestId: `withdraw-${selectedCustomer._id}-${Date.now()}`,
      });

      toast.success("Tarik saldo berhasil dicatat");
      router.push(`/customers/${selectedCustomer._id}`);
    } catch (error) {
      toast.error(error.message || "Gagal mencatat tarik saldo");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCustomers) {
    return <LoadingPage message="Memuat data nasabah..." />;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-200">
                <HandCoinsIcon size={14} />
                Tarik Saldo
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Transaksi Withdrawal
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Catat penarikan saldo nasabah secara terpisah dari flow deposit
                sampah agar ledger lebih jelas.
              </p>
            </div>
            <Link href="/transactions">
              <Button
                variant="outline"
                className="h-10 gap-2 border-border/70 bg-background/60 font-bold"
              >
                <ArrowLeftIcon size={16} />
                Kembali
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="glass-card rounded-lg">
            <CardContent className="p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="grid gap-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                    {isCustomerScoped ? "Withdrawal Nasabah" : "Form Withdrawal"}
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold">
                    {isCustomerScoped
                      ? selectedCustomer?.fullName || "Nasabah terpilih"
                      : "Pilih nasabah dan nominal"}
                  </h2>
                </div>

                {isCustomerScoped ? (
                  <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-background/45 text-primary">
                        <UserRoundIcon size={19} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-black">
                          {selectedCustomer?.fullName || "Nasabah"}
                        </p>
                        <p className="mt-1 truncate text-xs font-semibold text-muted-foreground">
                          {selectedCustomer?.accountNumber || "-"} / @
                          {selectedCustomer?.username || "nasabah"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-2">
                      <Label>Cari Nasabah</Label>
                      <IconInput
                        icon={SearchIcon}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Nama, username, atau nomor rekening"
                        className="glass-input h-11"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Nasabah</Label>
                      <Select
                        value={selectedCustomerId}
                        onValueChange={setSelectedCustomerId}
                      >
                        <SelectTrigger className="glass-input h-11">
                          <SelectValue placeholder="Pilih nasabah" />
                        </SelectTrigger>
                        <SelectContent className="glass-card max-h-72">
                          {filteredCustomers.length === 0 ? (
                            <SelectItem value="__empty" disabled>
                              Tidak ada nasabah
                            </SelectItem>
                          ) : (
                            filteredCustomers.map((customer) => (
                              <SelectItem key={customer._id} value={customer._id}>
                                <CustomerOptionLabel customer={customer} />
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="grid gap-2">
                  <Label>Nominal Tarik</Label>
                  <IconInput
                    icon={WalletIcon}
                    type="number"
                    min={MIN_WITHDRAW}
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Masukkan nominal"
                    className="glass-input h-11"
                  />
                  <p className="text-xs font-semibold text-muted-foreground">
                    Minimum tarik saldo {formatRupiah(MIN_WITHDRAW)}.
                  </p>
                </div>

                <Separator />

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="h-11 gap-2 font-bold"
                >
                  {submitting ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2Icon size={16} />
                  )}
                  Catat Tarik Saldo
                </Button>
              </form>
            </CardContent>
          </Card>

          <aside className="glass-card self-start rounded-lg p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-primary">
              <ReceiptTextIcon size={16} />
              Ringkasan
            </div>

            {selectedCustomer ? (
              <div className="grid gap-3">
                <div className="rounded-lg border border-border/60 bg-background/45 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                      <UserRoundIcon size={19} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-black">
                        {selectedCustomer.fullName}
                      </p>
                      <p className="mt-1 truncate text-xs font-semibold text-muted-foreground">
                        {selectedCustomer.accountNumber || "-"} / @
                        {selectedCustomer.username || "nasabah"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-200">
                        Saldo Aktif
                      </p>
                      <p className="mt-2 text-2xl font-black">
                        {formatRupiah(balance)}
                      </p>
                    </div>
                    <WalletIcon className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
                  </div>
                </div>

                <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-700 dark:text-amber-200">
                    Sisa Setelah Tarik
                  </p>
                  <p className="mt-2 text-xl font-black">
                    {formatRupiah(remainingBalance)}
                  </p>
                </div>

                {amountNumber > balance ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-bold text-destructive">
                    Nominal tarik melebihi saldo nasabah.
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border/70 bg-background/35 p-6 text-center text-sm text-muted-foreground">
                Pilih nasabah untuk melihat saldo dan sisa setelah penarikan.
              </div>
            )}

            <div className="mt-4 rounded-lg border border-border/60 bg-background/45 p-4 text-xs leading-5 text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 font-black uppercase tracking-[0.14em] text-foreground">
                <ShieldCheckIcon size={14} />
                Catatan
              </div>
              Transaksi tarik saldo langsung berstatus selesai dan mengurangi
              saldo nasabah. Flow ini dipisahkan dari deposit sampah.
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
