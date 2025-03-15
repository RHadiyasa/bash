'use client';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import formatRupiah from '@/shared/utils/formatRupiah';
import { Spinner } from '@heroui/spinner';
import { useState, useEffect } from 'react';
import { useInfiniteScroll } from '@heroui/use-infinite-scroll';

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

  return (
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
        <TableColumn className="font-bold text-sm">Berat (kg)</TableColumn>
        <TableColumn className="font-bold text-sm">Nilai Transaksi</TableColumn>
        <TableColumn className="font-bold text-sm">Jenis</TableColumn>
      </TableHeader>
      <TableBody isLoading={isLoading} loadingContent={<Spinner label="Memuat data..." />}>
        {visibleTransactions?.map((transaction) => (
          <TableRow key={transaction._id}>
            <TableCell>{new Date(transaction.createdAt).toLocaleDateString('id-ID')}</TableCell>
            <TableCell>{transaction.customer?.fullName || 'Tidak ada nama'}</TableCell>
            <TableCell>{transaction.transactionType === 'deposit' ? `${transaction.trashWeight} kg` : '-'}</TableCell>
            <TableCell>{formatRupiah(transaction.transactionAmount)}</TableCell>
            <TableCell className={transaction.transactionType === 'deposit' ? 'text-green-500' : 'text-red-500'}>
              {transaction.transactionType}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
