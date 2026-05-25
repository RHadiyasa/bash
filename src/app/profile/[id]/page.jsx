"use client";

import RafiHadiyasa from "@/components/copyright";
import StatCard from "./_components/statCard";
import TrendChart from "./_components/charts/trendChart";
import CompositionChart from "./_components/charts/compositionChart";

import { useCallback, useEffect, useState } from "react";

import TableTransaksi from "./_components/table";
import formatRupiah from "@/lib/helpers/formatRupiah";
import HeaderPage from "@/components/header/header";
import useBankSampahData from "@/hooks/useBankSampahData";
import formatNumber from "@/lib/helpers/formatNumber";
import TopCustomers from "./_components/topCustomers";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Coins,
  Recycle,
  Users,
} from "lucide-react";

import { getAllCustomers } from "@/modules/services/customer.service";
import { getTransactions } from "@/modules/services/transaction.service";

const buildTrend = (transactions, days = 7) => {
  const today = new Date();
  const map = {};
  const buckets = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = {
      key,
      label: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      setor: 0,
      tarik: 0,
      sampah: 0,
    };
    map[key] = entry;
    buckets.push(entry);
  }

  (transactions || []).forEach((t) => {
    if (!t?.createdAt) return;
    const key = new Date(t.createdAt).toISOString().slice(0, 10);
    const entry = map[key];
    if (!entry) return;
    if (t.transactionType === "deposit") entry.setor += t.transactionAmount || 0;
    else if (t.transactionType === "withdraw") entry.tarik += t.transactionAmount || 0;
    entry.sampah += t.trashWeight || 0;
  });

  return buckets;
};

const ProfilePage = () => {
  const [customersData, setCustomersData] = useState([]);
  const [transactionsData, setTransactionsData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bankSampahProfile } = useBankSampahData();

  const calculateTopCustomers = useCallback((transactions) => {
    const customerMap = {};
    transactions.forEach((transaction) => {
      if (transaction.customer) {
        const customerId = transaction.customer._id;
        const customerName = transaction.customer.fullName;
        if (!customerMap[customerId]) {
          customerMap[customerId] = {
            id: customerId,
            name: customerName,
            totalWeight: 0,
          };
        }
        customerMap[customerId].totalWeight += transaction.trashWeight;
      }
    });
    return Object.entries(customerMap)
      .map(([id, customer]) => customer)
      .sort((a, b) => b.totalWeight - a.totalWeight)
      .slice(0, 10);
  }, []);

  const totalCustomerDeposit = (customersData || []).reduce(
    (total, c) => total + (c?.totalDeposit || 0),
    0
  );
  const totalCustomerWithdraw = (customersData || []).reduce(
    (total, c) => total + (c?.totalWithdraw || 0),
    0
  );
  const availableBalance = (customersData || []).reduce(
    (total, c) => total + (c?.balance || 0),
    0
  );
  const totalWeight =
    bankSampahProfile?.totalTrashWeight ??
    (customersData || []).reduce((t, c) => t + (c?.totalWeight || 0), 0);

  const trendData = buildTrend(transactionsData, 7);
  const setorSpark = trendData.map((d) => ({ v: d.setor }));
  const tarikSpark = trendData.map((d) => ({ v: d.tarik }));
  const sampahSpark = trendData.map((d) => ({ v: d.sampah }));
  let running = 0;
  const saldoSpark = trendData.map((d) => {
    running += d.setor - d.tarik;
    return { v: running };
  });

  const fetchAllData = useCallback(async () => {
    try {
      const dataCustomers = await getAllCustomers();
      const dataTransactions = await getTransactions();
      setTransactionsData(dataTransactions);
      setCustomersData(dataCustomers);
      setTopCustomers(calculateTopCustomers(dataTransactions));
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  }, [calculateTopCustomers]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <div className="min-h-screen bg-background dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Halo, {bankSampahProfile?.name || "Bank Sampah"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan operasional 7 hari terakhir
          </p>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          <StatCard
            title="Saldo"
            value={formatRupiah(availableBalance)}
            icon={<Coins size={18} />}
            trend={saldoSpark}
            color="#22c55e"
          />
          <StatCard
            title="Setor"
            value={formatRupiah(totalCustomerDeposit)}
            icon={<ArrowDownToLine size={18} />}
            trend={setorSpark}
            color="#22c55e"
          />
          <StatCard
            title="Tarik"
            value={formatRupiah(totalCustomerWithdraw)}
            icon={<ArrowUpFromLine size={18} />}
            trend={tarikSpark}
            color="#f59e0b"
          />
        </section>

        <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <StatCard
            title="Nasabah"
            value={formatNumber(customersData?.length ?? 0)}
            unit="orang"
            icon={<Users size={18} />}
          />
          <StatCard
            title="Sampah"
            value={formatNumber(totalWeight)}
            unit="kg"
            icon={<Recycle size={18} />}
            trend={sampahSpark}
            color="#0ea5e9"
          />
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <TrendChart data={trendData} />
          <CompositionChart
            deposit={totalCustomerDeposit}
            withdraw={totalCustomerWithdraw}
          />
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <TableTransaksi transactionData={transactionsData} isLoading={loading} />
          <TopCustomers topCustomers={topCustomers} />
        </section>

        <RafiHadiyasa />
      </main>
    </div>
  );
};

export default ProfilePage;
