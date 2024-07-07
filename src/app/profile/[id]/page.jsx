"use client";

import RafiHadiyasa from "@/components/copyright";
import DashboardCard from "../_components/dashboard-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  CoinsIcon,
  HandCoinsIcon,
  PackageOpen,
  Users2Icon,
} from "lucide-react";
import TableTransaksi from "../_components/table";
import { useEffect, useState } from "react";
import { getAllCustomers } from "@/modules/users/services/customer.service";
import { getAllTransactions } from "@/modules/users/services/transaction.service";
import formatRupiah from "@/lib/helpers/formatRupiah";
import TopCustomers from "@/app/profile/_components/topCustomers";
import { MdOutlineRecycling } from "react-icons/md";
import HeaderPage from "@/components/header/header";

const ProfilePage = () => {
  const [customersData, setCustomersData] = useState([]);
  const [transactionsData, setTransactionsData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk menghitung total berat sampah per customer dan mengambil top 5
  const calculateTopCustomers = (transactions) => {
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

    const sortedCustomers = Object.entries(customerMap)
      .map(([id, customer]) => customer)
      .sort((a, b) => b.totalWeight - a.totalWeight)
      .slice(0, 5);

    return sortedCustomers;
  };

  // Customer Deposit -> Jumlah deposit yang sudah dilakukan customers
  const totalCustomerDeposit = (customersData || []).reduce(
    (total, deposit) => {
      return total + (deposit.totalDeposit || 0);
    },
    0
  );

  // Jumlah withdraw yang dilakukan oleh customers
  const totalCustomerWithdraw = (customersData || []).reduce(
    (total, withdraw) => {
      return total + (withdraw.totalWithdraw || 0);
    },
    0
  );
  // Jumlah saldo customer yang tersedia di bank Sampah
  const availableBalance = (customersData || []).reduce((total, balance) => {
    return total + (balance.balance || 0);
  }, 0);

  const totalTrashWeight = (transactionsData || []).reduce(
    (total, currentWeight) => {
      return total + (currentWeight.trashWeight || 0);
    },
    0
  );

  const fetchAllData = async () => {
    try {
      const dataCustomers = await getAllCustomers();
      const dataTransactions = await getAllTransactions();
      setTransactionsData(dataTransactions);
      setCustomersData(dataCustomers);

      // Hitung top 5 customer berdasarkan berat sampah
      const topCustomersData = calculateTopCustomers(dataTransactions);
      setTopCustomers(topCustomersData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="bg-[#151518] min-h-screen">
      <HeaderPage />
      <div className="grid md:flex items-center pt-7 px-10 gap-3">
        <div className="pt-5 w-full md:w-2/3">
          <DashboardCard
            title={"Saldo Bank Sampah"}
            number={formatRupiah(availableBalance)}
            type={",-"}
            icon={<CoinsIcon />}
            footer={"Saldo nasabah yang tersedia di bank Sampah"}
          />
        </div>
        <div className="py-5 flex justify-center sm:w-full md:w-1/2 lg:w-1/3">
          <div className="flex items-center gap-5">
            <MdOutlineRecycling size={120} />
            <div>
              <div className="text-3xl font-bold text-red-400">Reduce</div>
              <div className="text-3xl font-bold text-blue-400">Reuse</div>
              <div className="text-3xl font-bold text-green-400">Recycle</div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:w-auto xl:flex-row py-5 gap-5">
          <DashboardCard
            title={"Akumulasi Deposit"}
            number={formatRupiah(totalCustomerDeposit)}
            type={",-"}
            footer={"Nilai setor tunai yang sudah dilakukan oleh nasabah"}
            icon={<CoinsIcon />}
          />
          <DashboardCard
            title={"Akumulasi Tarik Tunai"}
            number={formatRupiah(totalCustomerWithdraw)}
            type={",-"}
            icon={<CoinsIcon />}
            footer={"Tarik tunai yang sudah dilakukan oleh nasabah"}
          />
          <DashboardCard
            title={"Akumulasi Sampah"}
            number={totalTrashWeight}
            type={"kilogram"}
            icon={<PackageOpen />}
            footer={"Total sampah yang berhasil dikurangi"}
          />
        </div>
        <div className="flex flex-col xl:flex-row justify-between gap-5 mt-5">
          <div className="basis-2/3">
            <TableTransaksi
              transactionData={transactionsData}
              isLoading={loading}
            />
          </div>
          <div className="basis-1/3">
            <div className="grid md:flex xl:grid gap-2 pb-2">
              <div className="flex md:w-1/2 lg:w-full gap-3">
                <DashboardCard
                  title={"Total Nasabah"}
                  number={customersData?.length}
                  type={"Nasabah"}
                  icon={<Users2Icon />}
                />
                <DashboardCard
                  title={"Total Transaksi"}
                  number={transactionsData.length}
                  type={"Transaksi"}
                  icon={<HandCoinsIcon />}
                />
              </div>
              <Card className="bg-[#09090B] md:w-1/2 lg:w-full">
                <CardHeader>
                  <CardTitle>Top 10</CardTitle>
                  <CardDescription>5 Nasabah terbaik</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent>
                  {topCustomers.map((customer, index) => (
                    <TopCustomers
                      key={index}
                      no={index + 1}
                      name={customer.name}
                      id={customer.id} // Jika Anda ingin menampilkan email, tambahkan properti email di calculateTopCustomers
                      transaction={`${customer.totalWeight} kg`}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <RafiHadiyasa />
      </div>
    </div>
  );
};

export default ProfilePage;
