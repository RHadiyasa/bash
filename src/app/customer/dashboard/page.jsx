"use client";

import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import formatNumber from "@/lib/helpers/formatNumber";
import formatRupiah from "@/lib/helpers/formatRupiah";
import axios from "axios";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanknoteIcon,
  Building2Icon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
  HashIcon,
  HomeIcon,
  KeyRoundIcon,
  Loader2Icon,
  LogOutIcon,
  MapPinIcon,
  PhoneIcon,
  ReceiptTextIcon,
  RecycleIcon,
  ScaleIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UserIcon,
  UserRoundIcon,
  WalletIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ags",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const STATUS_STYLES = {
  pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  completed:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  failed: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300",
};

const STATUS_LABELS = {
  all: { pending: "Pending", completed: "Selesai", failed: "Gagal" },
  deposit: {
    pending: "Belum Dijual",
    completed: "Sudah Dijual",
    failed: "Dibatalkan",
  },
  withdraw: { pending: "Pending", completed: "Selesai", failed: "Gagal" },
};

const TRANSACTION_TYPE_TABS = [
  { value: "all", label: "Semua" },
  { value: "deposit", label: "Deposit" },
  { value: "withdraw", label: "Tarik Tunai" },
];

const StatusBadge = ({ status, type = "all" }) => {
  const label = STATUS_LABELS[type] || STATUS_LABELS.all;

  return (
    <Badge
      variant="outline"
      className={`shrink-0 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold ${
        STATUS_STYLES[status] || STATUS_STYLES.pending
      }`}
    >
      {label[status] || status}
    </Badge>
  );
};

const TabTitle = ({ icon: Icon, label }) => (
  <span className="inline-flex min-w-0 items-center justify-center gap-1.5 sm:gap-2">
    <Icon className="shrink-0" size={15} />
    <span className="truncate">{label}</span>
  </span>
);

const MetricCard = ({ label, value, caption, icon: Icon, tone }) => (
  <div className="group rounded-lg border border-border/60 bg-background/45 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-background/60">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-2 break-words text-lg font-black tracking-tight text-foreground sm:text-xl">
          {value}
        </p>
      </div>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${tone}`}
      >
        <Icon size={19} />
      </span>
    </div>
    {caption ? (
      <p className="mt-3 text-xs font-semibold leading-5 text-muted-foreground">
        {caption}
      </p>
    ) : null}
  </div>
);

const InfoTile = ({ label, value, icon: Icon }) => (
  <div className="rounded-lg border border-border/60 bg-background/45 p-4">
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 break-words font-black text-foreground">
          {value || "-"}
        </p>
      </div>
    </div>
  </div>
);

const PasswordField = ({
  label,
  value,
  onChange,
  placeholder,
  show,
  onToggle,
  withToggle = false,
}) => (
  <div className="grid gap-2">
    <Label>{label}</Label>
    <div className="relative">
      <IconInput
        icon={KeyRoundIcon}
        type={withToggle && show ? "text" : "password"}
        className="glass-input h-11"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rightSlot={
          withToggle ? (
            <button
              type="button"
              tabIndex={-1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
              onClick={onToggle}
            >
              {show ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          ) : null
        }
      />
    </div>
  </div>
);

export default function CustomerDashboard() {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [trashBreakdown, setTrashBreakdown] = useState([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [txType, setTxType] = useState("all");
  const [txStatus, setTxStatus] = useState("all");
  const [loadingTx, setLoadingTx] = useState(true);

  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editRegion, setEditRegion] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editPostal, setEditPostal] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/customer/profile", {
          withCredentials: true,
        });

        if (res.data.success) {
          const c = res.data.customer;
          const addr = c.address?.[0] || {};

          setCustomer(c);
          setEditFullName(c.fullName || "");
          setEditPhone(String(c.phone || ""));
          setEditStreet(addr.street || "");
          setEditRegion(addr.region || "");
          setEditCity(addr.city || "");
          setEditPostal(addr.postalCode || "");
        }
      } catch {
        toast.error("Gagal memuat profil");
      } finally {
        setLoadingProfile(false);
      }
    };

    load();
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      setLoadingTx(true);
      const res = await axios.get("/api/customer/transactions", {
        params: { page: txPage, limit: 10, type: txType, status: txStatus },
        withCredentials: true,
      });

      if (res.data.success) {
        setTransactions(res.data.transactions || []);
        setTxTotalPages(res.data.pagination?.totalPages || 1);
        setSummary(res.data.summary);
        setMonthlyTrend(
          (res.data.monthlyTrend || []).map((m) => ({
            name: MONTH_NAMES[(m._id.month || 1) - 1],
            nilai: m.totalAmount,
            berat: m.totalWeight,
          }))
        );
        setTrashBreakdown(res.data.trashBreakdown || []);
      }
    } catch {
      toast.error("Gagal memuat transaksi");
    } finally {
      setLoadingTx(false);
    }
  }, [txPage, txType, txStatus]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleLogout = async () => {
    await axios.post("/api/customer/logout", {}, { withCredentials: true });
    router.push("/login-customer");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      await axios.patch(
        "/api/customer/profile",
        {
          fullName: editFullName,
          phone: editPhone,
          address: [
            {
              street: editStreet,
              region: editRegion,
              city: editCity,
              postalCode: editPostal,
              province: customer?.address?.[0]?.province || "Indonesia",
            },
          ],
        },
        { withCredentials: true }
      );

      toast.success("Profil berhasil diperbarui");
      setCustomer((prev) => ({
        ...prev,
        fullName: editFullName,
        phone: Number(editPhone),
        address: [
          {
            street: editStreet,
            region: editRegion,
            city: editCity,
            postalCode: editPostal,
            province: prev?.address?.[0]?.province || "Indonesia",
          },
        ],
      }));
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal menyimpan profil");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPwd !== confirmPwd) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    setSavingPwd(true);
    try {
      await axios.patch(
        "/api/customer/password",
        { currentPassword: currentPwd, newPassword: newPwd },
        { withCredentials: true }
      );
      toast.success("Password berhasil diperbarui");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal mengubah password");
    } finally {
      setSavingPwd(false);
    }
  };

  const address = customer?.address?.[0] || {};
  const initials = useMemo(() => {
    const source = customer?.fullName || customer?.username || "N";
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [customer]);

  const financialSummary = useMemo(() => {
    const totalDepositAmount = Number(
      customer?.totalDeposit ?? summary?.totalDepositAmount ?? 0
    );
    const totalWithdrawAmount = Number(
      customer?.totalWithdraw ?? summary?.totalWithdrawAmount ?? 0
    );
    const totalWeight = Number(customer?.totalWeight ?? summary?.totalWeight ?? 0);
    const depositCount = Number(summary?.depositCount || 0);
    const withdrawCount = Number(summary?.withdrawCount || 0);
    const activeBalance = Number(customer?.balance ?? summary?.activeBalance ?? 0);

    return {
      activeBalance,
      depositCount,
      totalDepositAmount,
      totalWeight,
      totalWithdrawAmount,
      withdrawCount,
    };
  }, [customer, summary]);

  const metrics = useMemo(
    () => [
      {
        label: "Total Setor",
        value: formatRupiah(financialSummary.totalDepositAmount),
        caption: `${formatNumber(financialSummary.depositCount)} transaksi setoran`,
        icon: ArrowDownIcon,
        tone: "border-sky-400/20 bg-sky-400/10 text-sky-700 dark:text-sky-200",
      },
      {
        label: "Total Tarik",
        value: formatRupiah(financialSummary.totalWithdrawAmount),
        caption: `${formatNumber(financialSummary.withdrawCount)} transaksi penarikan`,
        icon: ArrowUpIcon,
        tone: "border-amber-400/20 bg-amber-400/10 text-amber-700 dark:text-amber-200",
      },
      {
        label: "Total Berat",
        value: `${formatNumber(financialSummary.totalWeight)} kg`,
        caption: "Akumulasi sampah yang disetor",
        icon: ScaleIcon,
        tone: "border-violet-400/20 bg-violet-400/10 text-violet-700 dark:text-violet-200",
      },
      {
        label: "Transaksi",
        value: formatNumber(
          financialSummary.depositCount + financialSummary.withdrawCount
        ),
        caption: "Semua aktivitas rekening",
        icon: ReceiptTextIcon,
        tone: "border-emerald-400/20 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
      },
    ],
    [financialSummary]
  );

  const txStatusOptions = useMemo(() => {
    const labels = STATUS_LABELS[txType] || STATUS_LABELS.all;

    return [
      { value: "all", label: "Semua Status" },
      { value: "pending", label: labels.pending },
      { value: "completed", label: labels.completed },
      { value: "failed", label: labels.failed },
    ];
  }, [txType]);

  const isDepositTxView = txType === "deposit";
  const isWithdrawTxView = txType === "withdraw";
  const txTableMinWidth = isWithdrawTxView ? "min-w-[720px]" : "min-w-[760px]";

  const handleTxTypeChange = (value) => {
    setTxType(value);
    setTxStatus("all");
    setTxPage(1);
  };

  const handleTxStatusChange = (value) => {
    setTxStatus(value);
    setTxPage(1);
  };

  const renderTransactionHeader = () => {
    if (isDepositTxView) {
      return (
        <TableRow className="bg-muted/35 hover:bg-muted/35">
          <TableHead className="font-black uppercase tracking-[0.12em]">
            Tanggal Setor
          </TableHead>
          <TableHead className="font-black uppercase tracking-[0.12em]">
            Sampah
          </TableHead>
          <TableHead className="text-right font-black uppercase tracking-[0.12em]">
            Berat
          </TableHead>
          <TableHead className="font-black uppercase tracking-[0.12em]">
            Status Jual
          </TableHead>
          <TableHead className="text-right font-black uppercase tracking-[0.12em]">
            Nilai Setor
          </TableHead>
        </TableRow>
      );
    }

    if (isWithdrawTxView) {
      return (
        <TableRow className="bg-muted/35 hover:bg-muted/35">
          <TableHead className="font-black uppercase tracking-[0.12em]">
            Tanggal Tarik
          </TableHead>
          <TableHead className="font-black uppercase tracking-[0.12em]">
            Status Tarik
          </TableHead>
          <TableHead className="text-right font-black uppercase tracking-[0.12em]">
            Nominal Tarik
          </TableHead>
          <TableHead className="font-black uppercase tracking-[0.12em]">
            Keterangan
          </TableHead>
        </TableRow>
      );
    }

    return (
      <TableRow className="bg-muted/35 hover:bg-muted/35">
        <TableHead className="font-black uppercase tracking-[0.12em]">
          Tanggal
        </TableHead>
        <TableHead className="font-black uppercase tracking-[0.12em]">
          Jenis
        </TableHead>
        <TableHead className="font-black uppercase tracking-[0.12em]">
          Status
        </TableHead>
        <TableHead className="font-black uppercase tracking-[0.12em]">
          Detail
        </TableHead>
        <TableHead className="text-right font-black uppercase tracking-[0.12em]">
          Nilai
        </TableHead>
      </TableRow>
    );
  };

  const renderMobileTransactionCard = (tx) => {
    const isDeposit = tx.transactionType === "deposit";

    if (isDepositTxView) {
      return (
        <div
          key={tx._id}
          className="rounded-lg border border-border/60 bg-background/45 p-3 sm:p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-black">
                {tx.trash?.trashName || "Setoran Sampah"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDateToIndonesian(tx.createdAt)}
              </p>
            </div>
            <StatusBadge status={tx.transactionStatus} type="deposit" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-border/60 bg-background/35 p-3">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                Berat
              </p>
              <p className="mt-1 font-black">
                {formatNumber(tx.trashWeight)} kg
              </p>
            </div>
            <div className="rounded-md border border-border/60 bg-background/35 p-3 text-right">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                Nilai Setor
              </p>
              <p className="mt-1 font-black text-emerald-700 dark:text-emerald-300">
                +{formatRupiah(tx.transactionAmount)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (isWithdrawTxView) {
      return (
        <div
          key={tx._id}
          className="rounded-lg border border-border/60 bg-background/45 p-3 sm:p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-black">Penarikan Saldo</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDateToIndonesian(tx.createdAt)}
              </p>
            </div>
            <StatusBadge status={tx.transactionStatus} type="withdraw" />
          </div>
          <div className="mt-4 rounded-md border border-amber-400/20 bg-amber-400/10 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-amber-700 dark:text-amber-200">
              Nominal Tarik
            </p>
            <p className="mt-1 font-black text-amber-700 dark:text-amber-200">
              -{formatRupiah(tx.transactionAmount)}
            </p>
            <p className="mt-2 text-xs font-semibold text-muted-foreground">
              Dana keluar dari saldo aktif nasabah.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        key={tx._id}
        className="rounded-lg border border-border/60 bg-background/45 p-3 sm:p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="truncate font-black">
              {isDeposit ? tx.trash?.trashName || "Setoran Sampah" : "Penarikan Saldo"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDateToIndonesian(tx.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-md border-primary/20 bg-primary/10 text-primary"
            >
              {isDeposit ? "Deposit" : "Tarik Tunai"}
            </Badge>
            <StatusBadge
              status={tx.transactionStatus}
              type={tx.transactionType}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <p className="text-xs font-semibold text-muted-foreground">
            {isDeposit ? `${formatNumber(tx.trashWeight)} kg` : "Saldo ditarik"}
          </p>
          <p
            className={`break-words font-black sm:text-right ${
              isDeposit
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-amber-700 dark:text-amber-300"
            }`}
          >
            {isDeposit ? "+" : "-"}
            {formatRupiah(tx.transactionAmount)}
          </p>
        </div>
      </div>
    );
  };

  const renderDesktopTransactionRow = (tx) => {
    const isDeposit = tx.transactionType === "deposit";

    if (isDepositTxView) {
      return (
        <TableRow key={tx._id} className="hover:bg-primary/5">
          <TableCell className="text-xs text-muted-foreground">
            {formatDateToIndonesian(tx.createdAt)}
          </TableCell>
          <TableCell className="font-black">
            {tx.trash?.trashName || "Setoran Sampah"}
          </TableCell>
          <TableCell className="text-right font-semibold text-muted-foreground">
            {formatNumber(tx.trashWeight)} kg
          </TableCell>
          <TableCell>
            <StatusBadge status={tx.transactionStatus} type="deposit" />
          </TableCell>
          <TableCell className="text-right font-black text-emerald-700 dark:text-emerald-300">
            +{formatRupiah(tx.transactionAmount)}
          </TableCell>
        </TableRow>
      );
    }

    if (isWithdrawTxView) {
      return (
        <TableRow key={tx._id} className="hover:bg-primary/5">
          <TableCell className="text-xs text-muted-foreground">
            {formatDateToIndonesian(tx.createdAt)}
          </TableCell>
          <TableCell>
            <StatusBadge status={tx.transactionStatus} type="withdraw" />
          </TableCell>
          <TableCell className="text-right font-black text-amber-700 dark:text-amber-300">
            -{formatRupiah(tx.transactionAmount)}
          </TableCell>
          <TableCell>
            <div className="grid gap-1">
              <span className="font-black">Penarikan saldo</span>
              <span className="text-xs font-semibold text-muted-foreground">
                Dana keluar dari saldo aktif nasabah
              </span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow key={tx._id} className="hover:bg-primary/5">
        <TableCell className="text-xs text-muted-foreground">
          {formatDateToIndonesian(tx.createdAt)}
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className="rounded-md border-primary/20 bg-primary/10 text-primary"
          >
            {isDeposit ? "Deposit" : "Tarik Tunai"}
          </Badge>
        </TableCell>
        <TableCell>
          <StatusBadge status={tx.transactionStatus} type={tx.transactionType} />
        </TableCell>
        <TableCell className="font-black">
          <div className="grid gap-1">
            <span>
              {isDeposit
                ? tx.trash?.trashName || "Setoran Sampah"
                : "Penarikan Saldo"}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              {isDeposit
                ? `${formatNumber(tx.trashWeight)} kg`
                : "Saldo ditarik"}
            </span>
          </div>
        </TableCell>
        <TableCell
          className={`text-right font-black ${
            isDeposit
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-amber-700 dark:text-amber-300"
          }`}
        >
          {isDeposit ? "+" : "-"}
          {formatRupiah(tx.transactionAmount)}
        </TableCell>
      </TableRow>
    );
  };

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="glass-card flex items-center gap-3 rounded-lg px-5 py-4 text-sm font-bold text-muted-foreground">
          <Loader2Icon className="animate-spin text-primary" size={22} />
          Memuat dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <header className="sticky top-0 z-40 w-full px-3 pt-3 sm:px-6">
        <div className="glass-nav mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 rounded-lg px-3 py-3 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-sm font-black text-primary shadow-inner sm:h-11 sm:w-11">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black leading-tight sm:text-base">
                {customer?.fullName || "Nasabah"}
              </p>
              <p className="truncate text-xs font-bold text-primary">
                Terdaftar di {customer?.bankSampahName || "Bank Sampah"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-10 shrink-0 gap-2 border-border/70 bg-background/60 px-3 text-xs font-black sm:px-4"
            onClick={handleLogout}
          >
            <LogOutIcon size={15} />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-3 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:py-7">
        <section className="glass-card relative overflow-hidden rounded-lg">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300" />
          <div className="grid items-start gap-4 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-7">
            <div className="min-w-0">
              <Badge className="max-w-full border-primary/25 bg-primary/10 px-3 py-1 font-black uppercase tracking-[0.12em] text-primary sm:tracking-[0.18em]">
                <ShieldCheckIcon className="mr-2 h-3.5 w-3.5" />
                <span className="truncate">Dashboard Nasabah</span>
              </Badge>
              <h1 className="mt-4 break-words text-2xl font-black tracking-tight sm:text-4xl">
                Halo, {customer?.fullName || customer?.username || "Nasabah"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Pantau saldo, setoran, penarikan, dan riwayat aktivitas rekening
                sampah dari satu tempat.
              </p>

              <div className="mt-5 max-w-2xl rounded-lg border border-primary/25 bg-primary/10 p-3 shadow-[0_16px_40px_hsl(var(--primary)/0.10)] sm:p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-background/45 text-primary sm:h-12 sm:w-12">
                    <Building2Icon size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary sm:text-xs sm:tracking-[0.18em]">
                      Bank Sampah Terdaftar
                    </p>
                    <p className="mt-1 break-words text-lg font-black tracking-tight text-foreground sm:text-2xl">
                      {customer?.bankSampahName || "Bank Sampah"}
                    </p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
                      Semua saldo, setoran, dan penarikan di dashboard ini
                      tercatat pada bank sampah tersebut.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="max-w-full rounded-md border-border/70 bg-background/45 px-3 py-1.5 font-bold"
                >
                  <HashIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate">{customer?.accountNumber || "-"}</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="max-w-full rounded-md border-border/70 bg-background/45 px-3 py-1.5 font-bold"
                >
                  <UserRoundIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate">@{customer?.username || "nasabah"}</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="max-w-full rounded-md border-border/70 bg-background/45 px-3 py-1.5 font-bold"
                >
                  <MapPinIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate">
                    {address.region || address.city || "Wilayah belum diisi"}
                  </span>
                </Badge>
              </div>
            </div>

            <div className="self-start rounded-lg border border-primary/20 bg-primary/10 p-4 shadow-[0_18px_50px_hsl(var(--primary)/0.12)] sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                    Saldo Aktif
                  </p>
                  <p className="mt-3 break-words text-2xl font-black tracking-tight sm:text-4xl">
                    {formatRupiah(financialSummary.activeBalance)}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">
                    Total setor dikurangi total tarik
                  </p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-background/40 text-primary">
                  <WalletIcon size={22} />
                </span>
              </div>
              <Separator className="my-4 bg-primary/20" />
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-md border border-border/50 bg-background/40 p-3">
                  <p className="font-bold text-muted-foreground">Setoran</p>
                  <p className="mt-1 font-black">
                    {formatNumber(financialSummary.depositCount)}
                  </p>
                </div>
                <div className="rounded-md border border-border/50 bg-background/40 p-3">
                  <p className="font-bold text-muted-foreground">Penarikan</p>
                  <p className="mt-1 font-black">
                    {formatNumber(financialSummary.withdrawCount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Tabs defaultValue="overview" className="grid gap-5">
          <div className="glass-card rounded-lg p-2">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-border/60 bg-background/45 p-1 shadow-inner md:grid-cols-4">
              <TabsTrigger
                value="overview"
                className="min-w-0 rounded-md px-2 py-2.5 text-[11px] font-black data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground sm:px-3 sm:py-3 sm:text-sm"
              >
                <TabTitle icon={WalletIcon} label="Overview" />
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="min-w-0 rounded-md px-2 py-2.5 text-[11px] font-black data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground sm:px-3 sm:py-3 sm:text-sm"
              >
                <TabTitle icon={ReceiptTextIcon} label="Transaksi" />
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="min-w-0 rounded-md px-2 py-2.5 text-[11px] font-black data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground sm:px-3 sm:py-3 sm:text-sm"
              >
                <TabTitle icon={UserIcon} label="Profil" />
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="min-w-0 rounded-md px-2 py-2.5 text-[11px] font-black data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground sm:px-3 sm:py-3 sm:text-sm"
              >
                <TabTitle icon={SettingsIcon} label="Keamanan" />
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 grid gap-5">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((item) => (
                <MetricCard key={item.label} {...item} />
              ))}
            </section>

            <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
              <Card className="glass-card overflow-hidden rounded-lg">
                <CardContent className="p-0">
                  <div className="flex flex-col gap-2 border-b border-border/60 bg-background/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                        Tren Setoran
                      </p>
                      <h2 className="mt-1 text-lg font-black">
                        Nilai setoran 6 bulan terakhir
                      </h2>
                    </div>
                    <Badge
                      variant="outline"
                      className="w-fit rounded-md border-primary/20 bg-primary/10 font-bold text-primary"
                    >
                      <BanknoteIcon className="mr-2 h-3.5 w-3.5" />
                      {formatRupiah(financialSummary.totalDepositAmount)}
                    </Badge>
                  </div>
                  <div className="p-4 sm:p-5">
                    {monthlyTrend.length === 0 ? (
                      <div className="flex min-h-56 items-center justify-center rounded-lg border border-dashed border-border/70 bg-background/35 text-center text-sm text-muted-foreground">
                        Belum ada data setoran.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart
                          data={monthlyTrend}
                          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-border/50"
                          />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis
                            tick={{ fontSize: 11 }}
                            tickFormatter={(value) =>
                              value >= 1000
                                ? `${Math.round(value / 1000)}k`
                                : value
                            }
                          />
                          <Tooltip
                            formatter={(value, name) =>
                              name === "berat"
                                ? `${formatNumber(value)} kg`
                                : formatRupiah(value)
                            }
                            contentStyle={{
                              borderRadius: 8,
                              border: "1px solid hsl(var(--border))",
                              background: "hsl(var(--card))",
                              color: "hsl(var(--foreground))",
                            }}
                          />
                          <Bar
                            dataKey="nilai"
                            name="Nilai Setor"
                            fill="hsl(var(--primary))"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card overflow-hidden rounded-lg">
                <CardContent className="p-0">
                  <div className="border-b border-border/60 bg-background/30 px-4 py-4 sm:px-5">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                      Komposisi Sampah
                    </p>
                    <h2 className="mt-1 text-lg font-black">
                      Kontribusi terbesar
                    </h2>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto p-3 sm:p-4">
                    {trashBreakdown.length === 0 ? (
                      <div className="flex min-h-44 items-center justify-center rounded-lg border border-dashed border-border/70 bg-background/35 text-center text-sm text-muted-foreground">
                        Belum ada sampah tercatat.
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {trashBreakdown.map((trash, index) => (
                          <div
                            key={String(trash._id || index)}
                            className="rounded-lg border border-border/60 bg-background/45 p-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate font-black">
                                  {trash.trashName}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {formatNumber(trash.count || 0)} transaksi
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="shrink-0 rounded-md border-primary/20 bg-primary/10 text-primary"
                              >
                                {formatNumber(trash.totalWeight || 0)} kg
                              </Badge>
                            </div>
                            <p className="mt-3 text-sm font-black text-emerald-700 dark:text-emerald-300">
                              {formatRupiah(trash.totalAmount || 0)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            <Card className="glass-card overflow-hidden rounded-lg">
              <CardContent className="p-0">
                <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-background/30 px-4 py-4 sm:px-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                      Aktivitas Terbaru
                    </p>
                    <h2 className="mt-1 text-lg font-black">
                      Transaksi terakhir
                    </h2>
                  </div>
                  <ReceiptTextIcon className="h-5 w-5 text-primary" />
                </div>

                {loadingTx ? (
                  <div className="flex h-36 items-center justify-center">
                    <Loader2Icon
                      className="animate-spin text-primary"
                      size={24}
                    />
                  </div>
                ) : transactions.slice(0, 5).length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Belum ada transaksi.
                  </p>
                ) : (
                  <div className="divide-y divide-border/60">
                    {transactions.slice(0, 5).map((tx) => (
                      <div
                        key={tx._id}
                        className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                              tx.transactionType === "deposit"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                            }`}
                          >
                            {tx.transactionType === "deposit" ? (
                              <ArrowDownIcon size={18} />
                            ) : (
                              <ArrowUpIcon size={18} />
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-black">
                              {tx.transactionType === "deposit"
                                ? tx.trash?.trashName || "Setoran Sampah"
                                : "Penarikan Saldo"}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-muted-foreground">
                              {formatDateToIndonesian(tx.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                          <StatusBadge
                            status={tx.transactionStatus}
                            type={tx.transactionType}
                          />
                          <span
                            className={`min-w-0 break-words text-right font-black ${
                              tx.transactionType === "deposit"
                                ? "text-emerald-700 dark:text-emerald-300"
                                : "text-amber-700 dark:text-amber-300"
                            }`}
                          >
                            {tx.transactionType === "deposit" ? "+" : "-"}
                            {formatRupiah(tx.transactionAmount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-0 grid gap-4">
            <Card className="glass-card rounded-lg">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                    Riwayat Lengkap
                  </p>
                  <h2 className="mt-1 text-lg font-black">
                    Filter transaksi rekening
                  </h2>
                </div>
                <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-[minmax(260px,340px)_160px]">
                  <Tabs value={txType} onValueChange={handleTxTypeChange}>
                    <TabsList className="grid h-10 w-full grid-cols-3 gap-1 rounded-lg border border-border/60 bg-background/45 p-1">
                      {TRANSACTION_TYPE_TABS.map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="rounded-md px-2 text-xs font-black data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <Select
                    value={txStatus}
                    onValueChange={handleTxStatusChange}
                  >
                    <SelectTrigger className="glass-input h-10 w-full text-xs font-black sm:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {txStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card overflow-hidden rounded-lg">
              <CardContent className="p-0">
                {loadingTx ? (
                  <div className="flex h-56 items-center justify-center">
                    <Loader2Icon
                      className="animate-spin text-primary"
                      size={24}
                    />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="flex h-56 items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Tidak ada transaksi.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3 p-3 sm:p-4 md:hidden">
                      {transactions.map((tx) => renderMobileTransactionCard(tx))}
                    </div>

                    <div className="hidden overflow-x-auto md:block">
                      <Table className={`${txTableMinWidth} text-sm`}>
                        <TableHeader>{renderTransactionHeader()}</TableHeader>
                        <TableBody>
                          {transactions.map((tx) =>
                            renderDesktopTransactionRow(tx)
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {txTotalPages > 1 ? (
              <div className="flex items-center justify-center gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  disabled={txPage <= 1}
                  onClick={() => setTxPage((page) => page - 1)}
                >
                  <ChevronLeftIcon size={15} />
                </Button>
                <span className="min-w-[92px] rounded-md border border-border/60 bg-background/45 px-3 py-2 text-center text-xs font-black text-muted-foreground">
                  {txPage} / {txTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  disabled={txPage >= txTotalPages}
                  onClick={() => setTxPage((page) => page + 1)}
                >
                  <ChevronRightIcon size={15} />
                </Button>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="profile" className="mt-0 grid gap-5 lg:grid-cols-2">
            <Card className="glass-card rounded-lg">
              <CardContent className="p-4 sm:p-5">
                <div className="mb-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                    Data Rekening
                  </p>
                  <h2 className="mt-1 text-lg font-black">
                    Identitas nasabah
                  </h2>
                </div>
                <div className="grid gap-3">
                  <InfoTile
                    label="Username"
                    value={customer?.username}
                    icon={UserRoundIcon}
                  />
                  <InfoTile
                    label="Nomor Rekening"
                    value={customer?.accountNumber}
                    icon={HashIcon}
                  />
                  <InfoTile
                    label="Bank Sampah"
                    value={customer?.bankSampahName}
                    icon={RecycleIcon}
                  />
                  <InfoTile
                    label="Tanggal Bergabung"
                    value={
                      customer?.joinDate
                        ? formatDateToIndonesian(customer.joinDate)
                        : "-"
                    }
                    icon={CalendarDaysIcon}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-lg">
              <CardContent className="p-4 sm:p-5">
                <div className="mb-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                    Data Personal
                  </p>
                  <h2 className="mt-1 text-lg font-black">
                    Informasi yang bisa diubah
                  </h2>
                </div>
                <form onSubmit={handleSaveProfile} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Nama Lengkap</Label>
                    <IconInput
                      icon={UserIcon}
                      className="glass-input h-11"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>No. Telepon</Label>
                    <IconInput
                      icon={PhoneIcon}
                      className="glass-input h-11"
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>
                  <Separator />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2 sm:col-span-2">
                      <Label>Jalan / Nama Jalan</Label>
                      <IconInput
                        icon={HomeIcon}
                        className="glass-input h-11"
                        placeholder="Jl. Contoh No. 1"
                        value={editStreet}
                        onChange={(e) => setEditStreet(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Kelurahan / Kecamatan</Label>
                      <IconInput
                        icon={MapPinIcon}
                        className="glass-input h-11"
                        value={editRegion}
                        onChange={(e) => setEditRegion(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Kota / Kabupaten</Label>
                      <IconInput
                        icon={Building2Icon}
                        className="glass-input h-11"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Kode Pos</Label>
                      <IconInput
                        icon={HashIcon}
                        className="glass-input h-11"
                        value={editPostal}
                        onChange={(e) => setEditPostal(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="h-11 w-full gap-2 font-black sm:w-auto"
                      disabled={savingProfile}
                    >
                      {savingProfile ? (
                        <Loader2Icon size={15} className="animate-spin" />
                      ) : (
                        <UserIcon size={15} />
                      )}
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <Card className="glass-card rounded-lg">
              <CardContent className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div>
                  <Badge className="border-primary/25 bg-primary/10 px-3 py-1 font-black uppercase tracking-[0.16em] text-primary">
                    <KeyRoundIcon className="mr-2 h-3.5 w-3.5" />
                    Keamanan Akun
                  </Badge>
                  <h2 className="mt-4 text-xl font-black tracking-tight sm:text-2xl">
                    Ganti password nasabah
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Gunakan password yang mudah diingat tetapi tidak mudah
                    ditebak. Password lama tetap diperlukan untuk menjaga akun.
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="grid gap-4">
                  <PasswordField
                    label="Password Saat Ini"
                    placeholder="Password lama"
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    show={showCurrent}
                    onToggle={() => setShowCurrent((value) => !value)}
                    withToggle
                  />
                  <PasswordField
                    label="Password Baru"
                    placeholder="Min. 6 karakter"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    show={showNew}
                    onToggle={() => setShowNew((value) => !value)}
                    withToggle
                  />
                  <PasswordField
                    label="Konfirmasi Password Baru"
                    placeholder="Ulangi password baru"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="h-11 w-full gap-2 font-black"
                    disabled={savingPwd}
                  >
                    {savingPwd ? (
                      <Loader2Icon size={15} className="animate-spin" />
                    ) : (
                      <KeyRoundIcon size={15} />
                    )}
                    Perbarui Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
