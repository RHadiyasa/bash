'use client';

import { useEffect, useState } from 'react';
import { useListCustomers } from '@/shared/hooks/customers/useListCustomer';
import { useTransactionsData } from '@/shared/hooks/transactions/useTransactions';
import { Card, CardBody } from '@heroui/card';
import { ScrollShadow } from '@heroui/scroll-shadow';
import CustomCard from '@/shared/components/customCard';
import TableTransaction from '@/shared/components/tableTransaction';

import formatRupiah from '@/shared/utils/formatRupiah';
import formatNumber from '@/shared/utils/formatNumber';

export default function DashboardPage() {
  const { data: customerData, isLoading, isError } = useListCustomers();
  const { data: transactionsData, isLoading: transactionLoading } = useTransactionsData();
  const [topCustomers, setTopCustomers] = useState<any[]>([]);

  useEffect(() => {
    if (transactionsData) {
      setTopCustomers(calculateTopCustomers(transactionsData));
    }
  }, [transactionsData]);

  if (isLoading || transactionLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const calculateTopCustomers = (transactions: any[]) => {
    const customerMap: Record<string, { id: string; name: string; totalWeight: number }> = {};

    transactions.forEach((transaction) => {
      if (transaction.customer) {
        const { _id, fullName } = transaction.customer;
        if (!customerMap[_id]) {
          customerMap[_id] = { id: _id, name: fullName, totalWeight: 0 };
        }
        customerMap[_id].totalWeight += transaction.trashWeight;
      }
    });

    return Object.values(customerMap)
      .sort((a, b) => b.totalWeight - a.totalWeight)
      .slice(0, 10);
  };

  const totalCustomerDeposit =
    customerData?.reduce((total: any, deposit: { totalDeposit: any }) => total + (deposit?.totalDeposit || 0), 0) || 0;
  const totalCustomerWithdraw =
    customerData?.reduce((total: any, withdraw: { totalWithdraw: any }) => total + (withdraw?.totalWithdraw || 0), 0) ||
    0;
  const availableBalance =
    customerData?.reduce((total: any, balance: { balance: any }) => total + (balance?.balance || 0), 0) || 0;
  const totalTrashWeight =
    transactionsData?.reduce(
      (total: any, transaction: { trashWeight: any }) => total + (transaction.trashWeight || 0),
      0,
    ) || 0;

  return (
    <div className="w-full md:w-full lg:w-3/4 p-5">
      <div className="grid gap-5">
        <div className="grid gap-5">
          <div className="flex gap-5">
            <div className="w-full">
              <CustomCard
                title={'Saldo Nasabah'}
                number={formatRupiah(availableBalance)}
                type={',-'}
                footer={'Saldo nasabah yang tersedia di bank Sampah'}
              />
            </div>
            <div className="flex gap-5 w-full">
              <CustomCard
                title={'Total Nasabah'}
                number={customerData?.length}
                type={'Nasabah'}
                footer={'Nasabah terdaftar'}
              />
              <CustomCard
                title={'Total Transaksi'}
                number={transactionsData?.length}
                type={'Transaksi'}
                footer={'Transaksi tercatat'}
              />
            </div>
          </div>
          <div className='flex gap-5'>
            <CustomCard
              title={'Total Sampah'}
              number={formatNumber(totalTrashWeight)}
              type={'Kilogram'}
              footer={'Akumulasi Sampah'}
            />
            <CustomCard
              title={'Total Tarik Tunai'}
              number={formatRupiah(totalCustomerWithdraw)}
              type={',-'}
              footer={'Akumulasi Tarik Tunai'}
            />
            <CustomCard
              title={'Total Deposit'}
              number={formatRupiah(totalCustomerDeposit)}
              type={'.-'}
              footer={'Deposit Nasabah'}
            />
          </div>
        </div>
        <div className="grid lg:flex lg:gap-5">
          <div className="lg:w-3/4">
            <TableTransaction transactions={transactionsData} isLoading={transactionLoading} />
          </div>
          <div className="w-1/4">
            <div className="py-5">
              <p className="font-semibold text-2xl">10 Nasabah Terbaik</p>
            </div>
            <ScrollShadow offset={60} hideScrollBar className="w-[300px] h-[400px] bg-transparent p-5" size={100}>
              {/* cetak top customer */}
              {topCustomers?.map((customer, index) => (
                <div key={index} className="mb-2">
                  <Card>
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <p>{index + 1}.</p>
                          <p className="font-semibold">{customer.name}</p>
                        </div>
                        <p className="text-sm">{formatNumber(customer.totalWeight)} Kg</p>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </ScrollShadow>
          </div>
        </div>
      </div>
    </div>
  );
}
