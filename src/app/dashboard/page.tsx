'use client';

import { Card, CardBody } from '@heroui/card';
import { ScrollShadow } from '@heroui/scroll-shadow';
import CustomCard from '@/shared/components/customCard';
import TableTransaction from '@/shared/components/tableTransaction';

import formatRupiah from '@/shared/utils/formatRupiah';
import formatNumber from '@/shared/utils/formatNumber';
import {
  useGetTopCustomers,
  useGetTotalBalance,
  useGetTotalBankBalance,
  useGetTotalTransaction,
} from '@/shared/hooks/transactions/useGetTransactionGlobal.hooks';
import { useGetCustomerList } from '@/shared/hooks/customers/useGetCustomerList.hooks';
import { useGetWarehouseTotal } from '@/shared/hooks/warehouseTransactionStore/useTransactionStore.hooks';
import { TransactionTypeEnum } from '@/constant/transactionType.enum';
import { useTransactionsData } from '@/shared/hooks/transactions/useGetTransaction.hooks';
import { Skeleton } from '@heroui/skeleton';

export default function DashboardPage() {
  const { data: saldoNasabahData, isLoading } = useGetTotalBankBalance({});
  const { data: customerListData } = useGetCustomerList({});
  const { data: totalBashData } = useGetWarehouseTotal({});
  const { data: totalWithdraw } = useGetTotalBalance({ transaction_type_id: TransactionTypeEnum.WITHDRAW });
  const { data: totalDepositData } = useGetTotalBalance({ transaction_type_id: TransactionTypeEnum.DEPOSIT });
  const { data: transactionData, isLoading: transactionLoading } = useTransactionsData({});
  const { data: topCustomers, isLoading: topCustomerLoading } = useGetTopCustomers({});

  const totalCustomerDeposit = totalDepositData?.total_balance ?? 0;
  const totalCustomerWithdraw = totalWithdraw?.total_balance ?? 0;
  const availableBalance = saldoNasabahData?.total_latest_amount ?? 0;
  const totalTrashWeight = totalBashData?.map((item) => item.total_amount).reduce((acc, curr) => acc + curr, 0) ?? 0;

  return (
    <div className="w-full md:w-full lg:w-3/4 p-5">
      <div className="grid gap-5">
        <div className="grid gap-5">
          <div className="flex gap-5">
            <div className="w-full">
              <CustomCard
                loading={isLoading}
                title={'Saldo Nasabah'}
                number={formatRupiah(availableBalance)}
                type={',-'}
                footer={'Saldo nasabah yang tersedia di bank Sampah'}
              />
            </div>
            <div className="flex gap-5 w-full">
              <CustomCard
                loading={isLoading}
                title={'Total Nasabah'}
                number={customerListData?.meta.itemCount ?? 0}
                type={'Nasabah'}
                footer={'Nasabah terdaftar'}
              />
              <CustomCard
                loading={isLoading}
                title={'Total Transaksi'}
                number={transactionData?.meta.itemCount ?? 0}
                type={'Transaksi'}
                footer={'Transaksi tercatat'}
              />
            </div>
          </div>
          <div className="flex gap-5">
            <CustomCard
              loading={isLoading}
              title={'Total Sampah'}
              number={formatNumber(totalTrashWeight)}
              type={'Kilogram'}
              footer={'Akumulasi Sampah'}
            />
            <CustomCard
              loading={isLoading}
              title={'Total Tarik Tunai'}
              number={formatRupiah(totalCustomerWithdraw)}
              type={',-'}
              footer={'Akumulasi Tarik Tunai'}
            />
            <CustomCard
              loading={isLoading}
              title={'Total Deposit'}
              number={formatRupiah(totalCustomerDeposit)}
              type={'.-'}
              footer={'Deposit Nasabah'}
            />
          </div>
        </div>
        <div className="grid lg:flex lg:gap-5">
          <div className="lg:w-3/4">
            <TableTransaction transactions={transactionData?.data} isLoading={transactionLoading} />
          </div>
          <div className="w-1/4">
            <div className="py-5">
              <p className="font-semibold text-2xl">10 Nasabah Terbaik</p>
            </div>
            {topCustomerLoading ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="rounded-lg mt-2 mx-4">
                  <div className="h-16 w-full rounded-lg bg-default-200" />
                </Skeleton>
              ))
            ) : (
              <ScrollShadow offset={60} hideScrollBar className="w-[300px] h-[600px] p-2" size={100}>
                {/* cetak top customer */}
                {topCustomers?.data?.map((customer, index) => (
                  <div key={index} className="mb-2">
                    <Card className="p-2">
                      <CardBody className="flex">
                        <div className="flex items-center justify-start gap-5">
                          <p className="pl-2 font-bold">{index + 1}</p>
                          <div className="grid">
                            <p className="font-semibold">{customer.name.toUpperCase()}</p>
                            <p className="text-sm">Total : Rp {formatNumber(customer.amount)}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </ScrollShadow>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
