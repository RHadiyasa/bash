"use client";
import HeaderPage from "@/components/header/header";
import { getCustomerDetails } from "@/modules/services/customer.service";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams } from "next/navigation";
import LoadingPage from "@/components/loadingPage";
import DetailCustomer from "./_components/detailCustomer";
import NotFoundPage from "@/components/notFound";
import {
  ArrowLeftIcon,
  BanknoteIcon,
  HandCoinsIcon,
  InfoIcon,
  MapPinIcon,
  PanelRightOpenIcon,
  ReceiptTextIcon,
  ScaleIcon,
  SquareStackIcon,
  UserRoundIcon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";
import CustomerHistoryDetails from "./_components/customerHistoryDetails";
import CustomerTransactions from "./detailtransaction/_components/customerTransactions";
import { getTransactionHistoryByCustomerId } from "@/modules/services/transaction.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import formatRupiah from "@/lib/helpers/formatRupiah";
import formatDateToIndonesian from "@/lib/helpers/formatDate";

const CustomerSummaryPanel = ({
  address,
  balance,
  customer,
  summaryCards,
  totalTransactions,
}) => (
  <div className="grid gap-4">
    <div className="rounded-lg border border-border/60 bg-background/45 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
          <UserRoundIcon size={20} />
        </span>
        <div className="min-w-0">
          <div className="truncate text-lg font-black">
            {customer.fullName || "Nasabah"}
          </div>
          <p className="mt-1 truncate text-xs font-semibold text-muted-foreground">
            {customer.accountNumber || "-"} / @{customer.username || "nasabah"}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className="rounded-md border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-200"
        >
          {formatRupiah(balance)}
        </Badge>
        <Badge
          variant="outline"
          className="rounded-md border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-cyan-700 dark:text-cyan-200"
        >
          {totalTransactions} transaksi
        </Badge>
      </div>
      <Link href={`/transactions/withdraw?customerId=${customer._id}`}>
        <Button
          variant="outline"
          className="mt-4 h-10 w-full gap-2 border-amber-400/30 bg-amber-400/10 font-bold text-amber-700 hover:bg-amber-400/15 dark:text-amber-200"
        >
          <HandCoinsIcon size={16} />
          Tarik Saldo
        </Button>
      </Link>
    </div>

    <div className="grid gap-3">
      {summaryCards.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-lg border border-border/60 bg-background/45 p-4 shadow-sm backdrop-blur"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 truncate text-lg font-black tracking-tight">
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
    </div>

    <div className="rounded-lg border border-border/60 bg-background/45 p-4">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        <InfoIcon size={15} />
        Metadata Singkat
      </div>
      <div className="mt-3 grid gap-2">
        {[
          ["RT/RW", address.region || "-"],
          ["Telepon", customer.phone ? `+62 ${customer.phone}` : "-"],
          ["Bergabung", formatDateToIndonesian(customer.joinDate)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-background/55 px-3 py-2 text-xs"
          >
            <span className="font-bold text-muted-foreground">{label}</span>
            <span className="text-right font-extrabold">{value}</span>
          </div>
        ))}
      </div>
    </div>

  </div>
);

const CustomerPageDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [transactionHistories, setTransactionHistories] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [activeTab, setActiveTab] = useState("history");

  const loadCustomerDetail = useCallback(async () => {
    try {
      setLoading(true);
      const token = process.env.TOKEN_SECRET;
      const customerData = await getCustomerDetails(id, token);

      if (!customerData) {
        setNotFound(true);
        return;
      }
      setCustomer(customerData);
    } catch (error) {
      console.error("An error occurred while fetching customer data", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadTransactionHistory = useCallback(async (customerId) => {
    setLoadingTransactions(true);
    try {
      const token = process.env.TOKEN_SECRET;
      const customerTransactionHistory =
        await getTransactionHistoryByCustomerId(customerId, token);

      if (!customerTransactionHistory) {
        return;
      } else {
        setTotalTransactions(customerTransactionHistory.totalTransactions || 0);
        setTransactionHistories(customerTransactionHistory.transactions || []);
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching customer transaction history",
        error
      );
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  useEffect(() => {
    if (customer) {
      loadTransactionHistory(customer._id);
    }
  }, [customer, loadTransactionHistory]);

  useEffect(() => {
    loadCustomerDetail();
  }, [loadCustomerDetail]);

  const address = customer?.address?.[0] || {};
  const totalWeight = Number(customer?.totalWeight || 0);
  const balance = Number(customer?.balance || 0);
  const totalDeposit = Number(customer?.totalDeposit || 0);
  const totalWithdraw = Number(customer?.totalWithdraw || 0);

  const summaryCards = useMemo(
    () => [
      {
        label: "Saldo",
        value: formatRupiah(balance),
        caption: "Saldo tabungan aktif",
        icon: WalletIcon,
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
      },
      {
        label: "Transaksi",
        value: `${totalTransactions} transaksi`,
        caption: "Riwayat transaksi nasabah",
        icon: ReceiptTextIcon,
        className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-200",
      },
      {
        label: "Total Sampah",
        value: `${totalWeight.toFixed(2)} Kg`,
        caption: "Akumulasi setoran sampah",
        icon: ScaleIcon,
        className: "bg-amber-500/10 text-amber-700 dark:text-amber-200",
      },
      {
        label: "RT/RW",
        value: address.region || "-",
        caption: "Klasifikasi wilayah",
        icon: MapPinIcon,
        className: "bg-violet-500/10 text-violet-700 dark:text-violet-200",
      },
    ],
    [address.region, balance, totalTransactions, totalWeight]
  );

  const transactionSummaryCards = useMemo(
    () => [
      {
        label: "Total Setor",
        value: formatRupiah(totalDeposit),
        icon: BanknoteIcon,
        className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
      },
      {
        label: "Total Tarik",
        value: formatRupiah(totalWithdraw),
        icon: WalletIcon,
        className: "bg-amber-500/10 text-amber-700 dark:text-amber-200",
      },
    ],
    [totalDeposit, totalWithdraw]
  );

  if (notFound) {
    return <NotFoundPage />;
  }

  if (loading && !customer) {
    return <LoadingPage message={"Loading data..."} />;
  }

  if (!customer) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto grid w-full max-w-[1500px] gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid gap-6">
            <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href={`/customers`}>
                          Nasabah
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href={`#`}
                          className="font-semibold text-foreground"
                        >
                          {customer.fullName || "Detail Nasabah"}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    <UserRoundIcon size={14} />
                    Profil Nasabah
                  </div>
                  <h1 className="mt-3 break-words text-3xl font-black tracking-tight sm:text-4xl">
                    {customer.fullName || "Detail Nasabah"}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                    {customer.accountNumber || "-"} / @
                    {customer.username || "nasabah"}
                  </p>
                </div>
                <Link href={`/customers`} className="hidden xl:block">
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

            <Card className="glass-card overflow-hidden rounded-lg">
              <CardContent className="grid gap-5 p-4 sm:p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {transactionSummaryCards.map((item) => {
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
                      Pilih Tampilan Data
                    </div>
                    <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-lg border border-border/60 bg-background/60 p-1 shadow-inner">
                    <TabsTrigger
                      value="history"
                      className="rounded-md px-3 py-3 text-xs font-black data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm sm:text-sm"
                    >
                      Riwayat
                    </TabsTrigger>
                    <TabsTrigger
                      value="transactions"
                      className="rounded-md px-3 py-3 text-xs font-black data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm sm:text-sm"
                    >
                      Semua Transaksi
                    </TabsTrigger>
                    <TabsTrigger
                      value="profile"
                      className="rounded-md px-3 py-3 text-xs font-black data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm sm:text-sm"
                    >
                      Profil
                    </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="history" className="mt-5">
                    <CustomerHistoryDetails
                      customerData={customer}
                      transactionHistoryData={transactionHistories}
                      loading={loadingTransactions}
                      onShowAllTransactions={() => setActiveTab("transactions")}
                      featured
                    />
                  </TabsContent>
                  <TabsContent value="transactions" className="mt-5">
                    <div className="rounded-lg border border-border/60 bg-background/35 p-4">
                      <CustomerTransactions customer={customer} />
                    </div>
                  </TabsContent>
                  <TabsContent value="profile" className="mt-5">
                    <DetailCustomer
                      dataCustomer={customer}
                      onDataUpdated={loadCustomerDetail}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <aside className="hidden xl:block">
            <div className="glass-card sticky top-28 rounded-lg p-5 shadow-2xl">
              <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-primary">
                <PanelRightOpenIcon size={16} />
                Panel Ringkasan
              </div>
              <CustomerSummaryPanel
                address={address}
                balance={balance}
                customer={customer}
                summaryCards={summaryCards}
                totalTransactions={totalTransactions}
              />
            </div>
          </aside>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="fixed bottom-5 left-1/2 z-40 h-12 -translate-x-1/2 gap-2 rounded-full px-5 font-black shadow-2xl xl:hidden">
              <PanelRightOpenIcon size={18} />
              Ringkasan
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[82vh] overflow-y-auto rounded-t-2xl p-5"
          >
            <SheetHeader className="pr-8 text-left">
              <SheetTitle>Ringkasan Nasabah</SheetTitle>
              <SheetDescription>
                Panel ringkas untuk melihat metrik dan aksi cepat nasabah.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-5">
              <CustomerSummaryPanel
                address={address}
                balance={balance}
                customer={customer}
                summaryCards={summaryCards}
                totalTransactions={totalTransactions}
              />
            </div>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};

export default CustomerPageDetails;
