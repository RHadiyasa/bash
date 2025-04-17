import { getTotalBalance, getTotalTransaction } from '@/shared/services/transactions.service';
import { addToast } from '@heroui/toast';
import { useQuery } from '@tanstack/react-query';

export const useGetTotalBalance = () => {
  const query = useQuery({
    queryKey: ['transactions', 'total-balance'], // rename tag
    queryFn: () => getTotalBalance(), // masukin function
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

export const useGetTotalTransaction = () => {
    const query = useQuery({
      queryKey: ['transactions', 'total-transaction'], // rename tag
      queryFn: () => getTotalTransaction(), // masukin function
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
  