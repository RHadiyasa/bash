import { getTransactionList } from '@/shared/services/transactions.service';
import { IRequestGetTransactionList } from '@/types/services/transactions/getTransactionList.interface';
import { addToast } from '@heroui/toast';
import { useQuery } from '@tanstack/react-query';

export const useTransactionsData = (dto: IRequestGetTransactionList) => {
  const query = useQuery({
    queryKey: ['transactions', dto.page, dto.take], // rename tag
    queryFn: () => getTransactionList(dto), // masukin function
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
  });

  if (query.isError) {
    addToast({
      title: 'Error',
      description: query.error?.message || 'Something went wrong',
      color: 'danger',
      variant: 'flat',
    });
  }

  return query;
};
