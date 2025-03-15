'use client';

import { useListCustomers } from '@/shared/hooks/customers/useListCustomer';
import { useTransactionsData } from '@/shared/hooks/transactions/useTransactions';
import TableTransaction from '@/shared/components/tableTransaction';
import CustomCard from '@/shared/components/customCard';

export default function DashboardPage() {
  const { data: customerData, isLoading, isError } = useListCustomers();
  const { data: transactionsData, isLoading: transactionLoading } = useTransactionsData();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="w-full md:w-full lg:w-2/3 p-5">
      <div className="grid gap-5">
        <CustomCard
          title={'Saldo Bank Sampah'}
          number={'IDR 18,000,000'}
          type={'Kg'}
          footer={'Saldo nasabah yang tersedia di bank Sampah'}
        />
        <div className='grid gap-2'>
          <h1 className="font-semibold text-xl">Transaksi Terbaru</h1>
          <TableTransaction transactions={transactionsData} isLoading={transactionLoading}/>
        </div>
      </div>
    </div>
  );
}
