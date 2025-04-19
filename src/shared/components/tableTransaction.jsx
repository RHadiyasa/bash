'use client';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import formatRupiah from '@/shared/utils/formatRupiah';
import { Spinner } from '@heroui/spinner';
import { useState, useEffect } from 'react';
import { useInfiniteScroll } from '@heroui/use-infinite-scroll';
import { Button } from '@heroui/button';

export default function TableTransaction({ transactions, isLoading }) {
  // Filter transaksi yang valid
  const validTransactions = transactions?.filter(
    (t) => (t.customer?.fullName && t.transactionStatus === 'completed') || t.transactionStatus === 'pending',
  );

  // Urutkan transaksi berdasarkan tanggal terbaru
  const sortedTransactions = validTransactions?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // State untuk menyimpan transaksi yang terlihat di layar
  const [visibleTransactions, setVisibleTransactions] = useState(sortedTransactions?.slice(0, 50));
  const [hasMore, setHasMore] = useState(sortedTransactions?.length > 50);

  // Update visibleTransactions jika transactions berubah
  useEffect(() => {
    setVisibleTransactions(sortedTransactions?.slice(0, 50));
    setHasMore(sortedTransactions?.length > 50);
  }, [transactions]);

  // Infinite Scroll Handler
  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore,
    onLoadMore: () => {
      const newVisibleCount = visibleTransactions?.length + 50;
      setVisibleTransactions(sortedTransactions?.slice(0, newVisibleCount));
      setHasMore(newVisibleCount < sortedTransactions?.length);
    },
  });

  console.log({transactions})

  return (
    <div>
      <div className="p-3 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">Transaksi Terbaru</h1>
          <p className="text-sm">Transaksi terbaru nasabah</p>
        </div>
        <div>
          <Button as="a" href="/transactions">Lihat semua transaksi</Button>
        </div>
      </div>
      <Table
        isHeaderSticky
        isStriped
        isVirtualized
        rowHeight={60}
        ref={scrollerRef}
        aria-label="Transaction Table"
        bottomContent={
          hasMore ? (
            <div className="flex w-full justify-center">
              <Spinner ref={loaderRef} color="white" />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn className="font-bold text-sm">Tanggal</TableColumn>
          <TableColumn className="font-bold text-sm">Nama</TableColumn>
          {/* <TableColumn className="font-bold text-sm">Berat (kg)</TableColumn> */}
          <TableColumn className="font-bold text-sm">Nilai Transaksi</TableColumn>
          <TableColumn className="font-bold text-sm">Jenis</TableColumn>
        </TableHeader>
        <TableBody isLoading={isLoading} loadingContent={<Spinner label="Memuat data..." />}>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.created_at).toLocaleDateString('id-ID')}</TableCell>
              <TableCell>{transaction.customer_account_number || 'Tidak ada nama'}</TableCell>
              {/* <TableCell>{transaction.transaction_type_name === 'deposit' ? `Rp. ${transaction.final_amount}` : '-'}</TableCell> */}
              <TableCell>{formatRupiah(transaction.final_amount)}</TableCell>
              <TableCell className={transaction.transaction_type_name === 'deposit' ? 'text-green-500' : 'text-red-500'}>
                {transaction.transaction_type_name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
