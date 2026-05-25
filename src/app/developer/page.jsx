"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  AlertTriangleIcon,
  Building2,
  CheckCircle2Icon,
  ChevronRight,
  KeyRound,
  LogIn,
  Loader2,
  Power,
  Search,
  ShieldCheckIcon,
  Trash2,
  Users,
  Wallet,
  WrenchIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconInput } from "@/components/ui/icon-input";
import DeveloperHeader from "@/components/developer/developerHeader";
import formatRupiah from "@/lib/helpers/formatRupiah";
import formatNumber from "@/lib/helpers/formatNumber";
import {
  deleteBank,
  getDeveloperBanks,
  impersonateBank,
  manageBank,
  restoreBank,
} from "@/modules/services/developer.service";

const Stat = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
      {icon}
    </span>
    <p className="mt-4 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
    <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
  </div>
);

const DeveloperPage = () => {
  const router = useRouter();
  const [banks, setBanks] = useState([]);
  const [deletedBanks, setDeletedBanks] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [resetInfo, setResetInfo] = useState(null);
  const [migratePreview, setMigratePreview] = useState(null);
  const [migrateResult, setMigrateResult] = useState(null);
  const [migrateLoading, setMigrateLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [restoringId, setRestoringId] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await getDeveloperBanks();
    if (res?.success) {
      setBanks(res.banks);
      setDeletedBanks(res.deletedBanks || []);
      setOverview(res.overview);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return banks;
    return banks.filter((b) =>
      [b.name, b.email]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [banks, search]);

  const handleToggle = async (bank) => {
    setBusyId(bank._id);
    const res = await manageBank(bank._id, { action: "toggleActive" });
    if (res?.success) {
      toast.success(res.message);
      setBanks((prev) =>
        prev.map((b) => (b._id === bank._id ? { ...b, isActive: res.isActive } : b))
      );
    }
    setBusyId(null);
  };

  const handleReset = async (bank) => {
    setBusyId(bank._id);
    const res = await manageBank(bank._id, { action: "resetPassword" });
    if (res?.success) {
      toast.success("Password direset");
      setResetInfo({ name: bank.name, email: bank.email, password: res.tempPassword });
    }
    setBusyId(null);
  };

  const handleDelete = async (bank) => {
    setDeleteTarget(bank);
    setDeleteConfirmation("");
    setDeletePassword("");
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteConfirmation.trim() !== String(deleteTarget.name || "").trim()) {
      toast.error("Nama bank sampah belum sesuai");
      return;
    }
    if (!deletePassword) {
      toast.error("Password developer wajib diisi");
      return;
    }

    const bank = deleteTarget;
    setBusyId(bank._id);
    const res = await deleteBank(bank._id, {
      confirmationText: deleteConfirmation.trim(),
      developerPassword: deletePassword,
    });
    if (res?.success) {
      toast.success(res.message);
      await load();
      setDeleteTarget(null);
      setDeleteConfirmation("");
      setDeletePassword("");
    }
    setBusyId(null);
  };

  const handleRestore = async (bank) => {
    setRestoringId(bank._id);
    const res = await restoreBank(bank._id);
    if (res?.success) {
      toast.success(res.message);
      await load();
    }
    setRestoringId(null);
  };

  const handleMigratePreview = async () => {
    setMigrateLoading(true);
    setMigratePreview(null);
    setMigrateResult(null);
    try {
      const res = await fetch("/api/developer/migrate/unique-usernames", { credentials: "include" });
      const data = await res.json();
      if (data.success) setMigratePreview(data);
      else toast.error(data.error || "Gagal cek duplikat");
    } catch {
      toast.error("Gagal menghubungi server");
    } finally {
      setMigrateLoading(false);
    }
  };

  const handleMigrateRun = async () => {
    if (!window.confirm("Jalankan migrasi? Username duplikat akan direname. Aksi ini tidak bisa dibatalkan.")) return;
    setMigrateLoading(true);
    setMigrateResult(null);
    try {
      const res = await fetch("/api/developer/migrate/unique-usernames", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setMigrateResult(data);
        setMigratePreview(null);
        toast.success(data.message);
      } else {
        toast.error(data.error || "Gagal migrasi");
      }
    } catch {
      toast.error("Gagal menghubungi server");
    } finally {
      setMigrateLoading(false);
    }
  };

  const handleImpersonate = async (bank) => {
    if (
      !window.confirm(
        `Login sebagai "${bank.name}"? Session developer akan berpindah ke akun bank sampah ini.`
      )
    ) {
      return;
    }

    setBusyId(bank._id);
    const res = await impersonateBank(bank._id);
    if (res?.success) {
      toast.success(res.message || "Berhasil login sebagai bank sampah");
      router.push(`/profile/${res.userId}`);
      router.refresh();
    }
    setBusyId(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <DeveloperHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Panel Developer</h1>
          <p className="mt-1.5 text-muted-foreground">
            Kelola seluruh bank sampah dari satu tempat.
          </p>
        </div>

        {resetInfo ? (
          <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-5 py-4">
            <p className="text-sm">
              Password baru <span className="font-bold">{resetInfo.name}</span>:{" "}
              <code className="rounded-md bg-background/70 px-2 py-1 font-mono font-bold">
                {resetInfo.password}
              </code>
            </p>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setResetInfo(null)}>
              <X size={16} />
            </Button>
          </div>
        ) : null}

        <Dialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => {
            if (busyId === deleteTarget?._id) return;
            if (!open) {
              setDeleteTarget(null);
              setDeleteConfirmation("");
              setDeletePassword("");
            }
          }}
        >
          <DialogContent className="glass-card rounded-2xl sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <AlertTriangleIcon className="text-destructive" size={22} />
                Temporary delete bank sampah
              </DialogTitle>
              <DialogDescription className="leading-6">
                Data bank sampah, nasabah, dan seluruh transaksi tidak akan
                dihapus permanen. Akun dipindahkan ke temporary delete selama
                14 hari dan bisa dipulihkan dari panel developer.
              </DialogDescription>
            </DialogHeader>

            {deleteTarget ? (
              <div className="grid gap-4">
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                  <p className="text-sm font-bold text-destructive">
                    Ketik nama bank untuk konfirmasi:
                  </p>
                  <p className="mt-2 rounded-md bg-background/70 px-3 py-2 font-mono text-sm font-black">
                    {deleteTarget.name}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    Selama temporary delete, bank tidak bisa login atau diakses
                    melalui impersonate.
                  </p>
                </div>
                <IconInput
                  icon={Building2}
                  value={deleteConfirmation}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  placeholder={`Ketik "${deleteTarget.name}"`}
                  className="h-11 rounded-xl border-border/60 bg-background/60 font-semibold"
                />
                <div className="grid gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Password Developer
                  </p>
                  <IconInput
                    icon={KeyRound}
                    type="password"
                    value={deletePassword}
                    onChange={(event) => setDeletePassword(event.target.value)}
                    placeholder="Masukkan password akun developer"
                    className="h-11 rounded-xl border-border/60 bg-background/60 font-semibold"
                  />
                  <p className="text-xs leading-5 text-muted-foreground">
                    Password diverifikasi di server sebelum data dipindahkan ke
                    temporary delete.
                  </p>
                </div>
              </div>
            ) : null}

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                variant="outline"
                className="bg-background/60"
                disabled={busyId === deleteTarget?._id}
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteConfirmation("");
                  setDeletePassword("");
                }}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                className="gap-2 font-bold"
                disabled={
                  !deleteTarget ||
                  busyId === deleteTarget?._id ||
                  deleteConfirmation.trim() !==
                    String(deleteTarget?.name || "").trim() ||
                  !deletePassword
                }
                onClick={handleConfirmDelete}
              >
                {busyId === deleteTarget?._id ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
                Pindahkan ke temporary
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat
            icon={<Building2 size={18} />}
            label={
              overview
                ? `${overview.activeBanks} aktif, ${overview.deletedBanks || 0} temporary`
                : "Bank Sampah"
            }
            value={overview ? overview.totalBanks : "—"}
          />
          <Stat
            icon={<Users size={18} />}
            label="Nasabah"
            value={overview ? formatNumber(overview.totalCustomers) : "—"}
          />
          <Stat
            icon={<Wallet size={18} />}
            label="Transaksi"
            value={overview ? formatNumber(overview.totalTransactions) : "—"}
          />
          <Stat
            icon={<Wallet size={18} />}
            label="Total Saldo"
            value={overview ? formatRupiah(overview.totalBalance) : "—"}
          />
        </section>

        <div className="mt-10 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold">
            Bank Sampah{" "}
            <span className="text-muted-foreground">({filtered.length})</span>
          </h2>
          <IconInput
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email"
            className="h-11 rounded-xl border-border/60 bg-card/60 backdrop-blur"
            wrapperClassName="w-full sm:w-72"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" size={28} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 py-20 text-center text-muted-foreground">
            Tidak ada bank sampah.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((bank) => (
              <div
                key={bank._id}
                className="group flex flex-col rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur transition hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/developer/${bank._id}`}
                    className="min-w-0 flex-1"
                  >
                    <h3 className="truncate font-bold transition group-hover:text-primary">
                      {bank.name}
                    </h3>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {bank.email}
                    </p>
                  </Link>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      bank.isActive === false
                        ? "bg-destructive/10 text-destructive"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                    }`}
                  >
                    {bank.isActive === false ? "Nonaktif" : "Aktif"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-background/40 p-3 text-center">
                  <div>
                    <p className="text-sm font-bold tabular-nums">{formatNumber(bank.customerCount)}</p>
                    <p className="text-[11px] text-muted-foreground">Nasabah</p>
                  </div>
                  <div className="border-x border-border/50">
                    <p className="text-sm font-bold tabular-nums">{formatNumber(bank.transactionCount)}</p>
                    <p className="text-[11px] text-muted-foreground">Transaksi</p>
                  </div>
                  <div>
                    <p className="truncate text-sm font-bold tabular-nums">{formatRupiah(bank.totalBalance)}</p>
                    <p className="text-[11px] text-muted-foreground">Saldo</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-1 border-t border-border/50 pt-3">
                  <Link
                    href={`/developer/${bank._id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:gap-2"
                  >
                    Detail <ChevronRight size={15} />
                  </Link>
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Login sebagai bank sampah"
                      disabled={busyId === bank._id || bank.isActive === false}
                      onClick={() => handleImpersonate(bank)}
                    >
                      <LogIn size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={bank.isActive === false ? "Aktifkan" : "Nonaktifkan"}
                      disabled={busyId === bank._id}
                      onClick={() => handleToggle(bank)}
                    >
                      <Power
                        size={15}
                        className={bank.isActive === false ? "text-emerald-500" : "text-amber-500"}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Reset password"
                      disabled={busyId === bank._id}
                      onClick={() => handleReset(bank)}
                    >
                      <KeyRound size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Hapus"
                      disabled={busyId === bank._id}
                      onClick={() => handleDelete(bank)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* ── Migrasi & Maintenance ── */}
        {deletedBanks.length > 0 ? (
          <section className="mt-10 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangleIcon
                    size={18}
                    className="text-amber-700 dark:text-amber-300"
                  />
                  <h2 className="text-lg font-bold">Temporary Delete</h2>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Bank sampah di bawah ini belum dihapus permanen. Pulihkan
                  sebelum masa simpan 14 hari berakhir.
                </p>
              </div>
              <span className="w-fit rounded-full border border-amber-400/30 bg-background/60 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                {deletedBanks.length} bank
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {deletedBanks.map((bank) => (
                <div
                  key={bank._id}
                  className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background/55 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold">{bank.name}</p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {bank.email}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                      <span>{formatNumber(bank.customerCount)} nasabah</span>
                      <span>/</span>
                      <span>
                        {formatNumber(bank.transactionCount)} transaksi
                      </span>
                      <span>/</span>
                      <span>
                        Recover sampai{" "}
                        {bank.deleteExpiresAt
                          ? new Date(bank.deleteExpiresAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="h-10 shrink-0 gap-2 border-emerald-500/30 bg-emerald-500/10 font-bold text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300"
                    disabled={restoringId === bank._id}
                    onClick={() => handleRestore(bank)}
                  >
                    {restoringId === bank._id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <CheckCircle2Icon size={16} />
                    )}
                    Pulihkan
                  </Button>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-14">
          <div className="mb-5 flex items-center gap-2">
            <WrenchIcon size={18} className="text-muted-foreground" />
            <h2 className="text-lg font-bold">Migrasi & Maintenance</h2>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-bold">Username Unik Global</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cari username yang sama di lebih dari satu bank sampah, lalu rename
                  dengan suffix angka (contoh: <code className="rounded bg-background/60 px-1">aguschandra2</code>).
                  Username terlama tetap, yang lebih baru yang direname.
                </p>
              </div>
              <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5 text-xs font-bold"
                  disabled={migrateLoading}
                  onClick={handleMigratePreview}
                >
                  {migrateLoading ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheckIcon size={13} />}
                  Cek Duplikat
                </Button>
                <Button
                  size="sm"
                  className="h-9 gap-1.5 text-xs font-bold"
                  disabled={migrateLoading}
                  onClick={handleMigrateRun}
                >
                  {migrateLoading ? <Loader2 size={13} className="animate-spin" /> : <WrenchIcon size={13} />}
                  Jalankan Migrasi
                </Button>
              </div>
            </div>

            {/* Preview hasil cek */}
            {migratePreview && (
              <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4 text-sm">
                {migratePreview.totalAffected === 0 ? (
                  <p className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-300">
                    <CheckCircle2Icon size={15} /> Tidak ada duplikat username maupun rekening.
                  </p>
                ) : (
                  <>
                    <p className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-300">
                      <AlertTriangleIcon size={15} />
                      {migratePreview.totalAffected} nasabah akan direname.
                    </p>

                    {migratePreview.username?.duplicateGroups > 0 && (
                      <div className="mt-3">
                        <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                          Username duplikat ({migratePreview.username.duplicateGroups} grup, {migratePreview.username.affected} nasabah):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {migratePreview.username.duplicates.map((d) => (
                            <span
                              key={d.value}
                              className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300"
                            >
                              {d.value} ×{d.count}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {migratePreview.accountNumber?.duplicateGroups > 0 && (
                      <div className="mt-3">
                        <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                          Rekening duplikat ({migratePreview.accountNumber.duplicateGroups} grup, {migratePreview.accountNumber.affected} nasabah):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {migratePreview.accountNumber.duplicates.map((d) => (
                            <span
                              key={d.value}
                              className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300"
                            >
                              {d.value} ×{d.count}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="mt-3 text-xs text-muted-foreground">
                      Klik <strong>Jalankan Migrasi</strong> untuk memperbaiki.
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Hasil migrasi */}
            {migrateResult && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
                <p className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2Icon size={15} /> {migrateResult.message}
                </p>
                {migrateResult.renamed?.length > 0 && (
                  <div className="mt-3 grid gap-1.5">
                    {migrateResult.renamed.map((r) => (
                      <p key={`${r.customerId}-${r.field}`} className="text-xs text-muted-foreground">
                        <span className="font-bold text-foreground">{r.fullName}</span>
                        {" "}
                        <span className="opacity-60">({r.field})</span>
                        {" — "}
                        <code className="line-through opacity-60">{r.oldValue}</code>
                        {" → "}
                        <code className="font-bold text-emerald-600 dark:text-emerald-300">{r.newValue}</code>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DeveloperPage;
