'use client';

import { Card, CardBody } from '@heroui/card';
import { ScrollShadow } from '@heroui/scroll-shadow';
import CustomCard from '@/shared/components/customCard';
import TableTransaction from '@/shared/components/tableTransaction';

import formatRupiah from '@/shared/utils/formatRupiah';
import formatNumber from '@/shared/utils/formatNumber';
import { Spinner } from '@heroui/spinner';
import { useGetTopCustomers, useGetTotalBalance, useGetTotalBankBalance, useGetTotalTransaction } from '@/shared/hooks/transactions/useGetTransactionGlobal.hooks';
import { useGetCustomerList } from '@/shared/hooks/customers/useGetCustomerList.hooks';
import { useGetWarehouseTotal } from '@/shared/hooks/warehouseTransactionStore/useTransactionStore.hooks';
import { TransactionTypeEnum } from '@/constant/transactionType.enum';
import { useTransactionsData } from '@/shared/hooks/transactions/useGetTransaction.hooks';

export default function DashboardPage() {
  const {data: saldoNasabahData} = useGetTotalBankBalance({});
  const {data: customerListData} = useGetCustomerList({});
  const {data: totalBashData} = useGetWarehouseTotal({});
  const {data: totalWithdraw } = useGetTotalBalance({transaction_type_id: TransactionTypeEnum.WITHDRAW});
  const {data: totalDepositData } = useGetTotalBalance({transaction_type_id: TransactionTypeEnum.DEPOSIT});
  const {data: transactionData} = useTransactionsData({});
  const {data: topCustomers} = useGetTopCustomers({})

  const totalCustomerDeposit = totalDepositData?.total_balance ?? 0;
  const totalCustomerWithdraw = totalWithdraw?.total_balance ?? 0;
  const availableBalance = saldoNasabahData?.total_latest_amount ?? 0;
  const totalTrashWeight = totalBashData?.map(item => item.total_amount).reduce((acc, curr) => acc + curr, 0) ?? 0;

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
                number={customerListData?.meta.itemCount ?? 0}
                type={'Nasabah'}
                footer={'Nasabah terdaftar'}
              />
              <CustomCard
                title={'Total Transaksi'}
                number={transactionData?.meta.itemCount ?? 0}
                type={'Transaksi'}
                footer={'Transaksi tercatat'}
              />
            </div>
          </div>
          <div className="flex gap-5">
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
            <TableTransaction transactions={transactionData?.data} isLoading={false} />
          </div>
          <div className="w-1/4">
            <div className="py-5">
              <p className="font-semibold text-2xl">10 Nasabah Terbaik</p>
            </div>
            <ScrollShadow offset={60} hideScrollBar className="w-[300px] h-[600px] px-2" size={100}>
              {/* cetak top customer */}
              {topCustomers?.data?.map((customer, index) => (
                <div key={index} className="mb-2">
                  <Card>
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <p>{index + 1}.</p>
                          <p className="font-semibold">{customer.name}</p>
                        </div>
                        <p className="text-sm">Rp {formatNumber(customer.amount)}</p>
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