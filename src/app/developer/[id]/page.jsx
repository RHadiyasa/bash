"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Building2,
  Loader2,
  LogIn,
  Mail,
  Phone,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DeveloperHeader from "@/components/developer/developerHeader";
import formatRupiah from "@/lib/helpers/formatRupiah";
import formatNumber from "@/lib/helpers/formatNumber";
import {
  deleteBankTransactions,
  getDeveloperBankDetail,
  impersonateBank,
} from "@/modules/services/developer.service";

const Stat = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
      {icon}
    </span>
    <p className="mt-4 text-xl font-bold tabular-nums">{value}</p>
    <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
  </div>
);

const Panel = ({ title, children }) => (
  <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur">
    <div className="border-b border-border/60 px-5 py-4">
      <h2 className="font-bold">{title}</h2>
    </div>
    {children}
  </div>
);

const DeveloperBankDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingTransactions, setDeletingTransactions] = useState(false);
  const [impersonating, setImpersonating] = useState(false);

  const loadBankDetail = useCallback(async (withLoader = true) => {
    if (!id) return;
    if (withLoader) {
      setLoading(true);
    }

    const res = await getDeveloperBankDetail(id);
    if (res?.success) setData(res);

    if (withLoader) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBankDetail();
  }, [loadBankDetail]);

  const handleDeleteAllTransactions = async (bank) => {
    if (
      !window.confirm(
        `Hapus SELURUH transaksi "${bank.name}"? Aksi ini hanya untuk developer dan tidak bisa dibatalkan.`
      )
    ) {
      return;
    }

    setDeletingTransactions(true);
    const res = await deleteBankTransactions(bank._id);
    if (res?.success) {
      toast.success(
        `${formatNumber(res.deletedTransactions || 0)} transaksi dihapus`
      );
      await loadBankDetail(false);
    }
    setDeletingTransactions(false);
  };

  const handleImpersonate = async (bank) => {
    if (
      !window.confirm(
        `Login sebagai "${bank.name}"? Session developer akan berpindah ke akun bank sampah ini.`
      )
    ) {
      return;
    }

    setImpersonating(true);
    const res = await impersonateBank(bank._id);
    if (res?.success) {
      toast.success(res.message || "Berhasil login sebagai bank sampah");
      router.push(`/profile/${res.userId}`);
      router.refresh();
    }
    setImpersonating(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <DeveloperHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/developer">
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> Kembali
          </Button>
        </Link>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-muted-foreground" size={28} />
          </div>
        ) : !data?.bank ? (
          <div className="rounded-2xl border border-dashed border-border/60 py-24 text-center text-muted-foreground">
            Bank sampah tidak ditemukan.
          </div>
        ) : (
          (() => {
            const { bank, stats, customers, recentTransactions } = data;
            const address = bank.location?.[0];
            return (
              <>
                <section className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {bank.name}
                      </h1>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Mail size={15} className="text-primary" /> {bank.email}
                        </span>
                        <span className="flex items-center gap-2">
                          <Phone size={15} className="text-primary" /> +62 {bank.phoneNumber}
                        </span>
                        {address ? (
                          <span className="flex items-center gap-2">
                            <Building2 size={15} className="text-primary" />
                            {[address.village, address.district, address.regency, address.province]
                              .filter(Boolean)
                              .join(", ") || "-"}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        bank.isActive === false
                          ? "bg-destructive/10 text-destructive"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                      }`}
                    >
                      {bank.isActive === false ? "Nonaktif" : "Aktif"}
                    </span>
                    <Button
                      className="h-10 gap-2 font-bold"
                      disabled={impersonating || bank.isActive === false}
                      onClick={() => handleImpersonate(bank)}
                    >
                      {impersonating ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <LogIn size={16} />
                      )}
                      Login sebagai bank
                    </Button>
                  </div>
                </section>

                <section className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <Stat icon={<Users size={18} />} label="Nasabah" value={formatNumber(stats.customerCount)} />
                  <Stat icon={<Banknote size={18} />} label="Transaksi" value={formatNumber(stats.transactionCount)} />
                  <Stat icon={<Wallet size={18} />} label="Total Saldo" value={formatRupiah(stats.totalBalance)} />
                  <Stat icon={<Wallet size={18} />} label="Revenue" value={formatRupiah(bank.revenue || 0)} />
                </section>

                <section className="mt-5">
                  <Panel title="Aksi Developer">
                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                          <AlertTriangle size={18} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-bold">
                            Hapus semua transaksi bank ini
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            Aksi ini hanya tersedia untuk developer dan hanya
                            berlaku pada bank sampah yang sedang dibuka.
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        className="h-11 shrink-0 gap-2 font-bold"
                        disabled={
                          deletingTransactions || stats.transactionCount === 0
                        }
                        onClick={() => handleDeleteAllTransactions(bank)}
                      >
                        {deletingTransactions ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Hapus Semua Transaksi
                      </Button>
                    </div>
                  </Panel>
                </section>

                <section className="mt-5 grid gap-5 xl:grid-cols-2">
                  <Panel title={`Nasabah (${customers.length})`}>
                    <div className="max-h-96 overflow-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-card/90 backdrop-blur">
                          <tr className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
                            <th className="px-5 py-2.5 font-semibold">Nama</th>
                            <th className="px-5 py-2.5 font-semibold">Rekening</th>
                            <th className="px-5 py-2.5 text-right font-semibold">Saldo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground">
                                Belum ada nasabah.
                              </td>
                            </tr>
                          ) : (
                            customers.map((c) => (
                              <tr key={c._id} className="border-b border-border/40">
                                <td className="px-5 py-2.5 font-medium">{c.fullName}</td>
                                <td className="px-5 py-2.5 text-muted-foreground">{c.accountNumber || "-"}</td>
                                <td className="px-5 py-2.5 text-right tabular-nums">{formatRupiah(c.balance || 0)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Panel>

                  <Panel title="Transaksi Terbaru">
                    <div className="max-h-96 overflow-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-card/90 backdrop-blur">
                          <tr className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
                            <th className="px-5 py-2.5 font-semibold">Tanggal</th>
                            <th className="px-5 py-2.5 font-semibold">Nasabah</th>
                            <th className="px-5 py-2.5 font-semibold">Jenis</th>
                            <th className="px-5 py-2.5 text-right font-semibold">Nilai</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentTransactions.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                                Belum ada transaksi.
                              </td>
                            </tr>
                          ) : (
                            recentTransactions.map((t) => (
                              <tr key={t._id} className="border-b border-border/40">
                                <td className="px-5 py-2.5 text-muted-foreground">
                                  {new Date(t.createdAt).toLocaleDateString("id-ID")}
                                </td>
                                <td className="px-5 py-2.5 font-medium">
                                  {t.customer?.fullName || "Deleted"}
                                </td>
                                <td className="px-5 py-2.5">
                                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                    {t.transactionType}
                                  </span>
                                </td>
                                <td className="px-5 py-2.5 text-right tabular-nums">
                                  {formatRupiah(t.transactionAmount)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Panel>
                </section>
              </>
            );
          })()
        )}
      </main>
    </div>
  );
};

export default DeveloperBankDetail;
