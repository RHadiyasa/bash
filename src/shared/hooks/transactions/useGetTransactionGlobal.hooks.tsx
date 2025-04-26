import { TransactionTypeEnum } from '@/constant/transactionType.enum';
import {
  getTopCustomer,
  getTotalBalance,
  getTotalBankBalance,
  getTotalTransaction,
} from '@/shared/services/transactions.service';
import { IRequestGetTopCustomer } from '@/types/services/transactions/getTopCustomer.dto';
import { IRequestGetTotalBalance } from '@/types/services/transactions/getTotalBalance.dto';
import { IRequestGetBankBalance } from '@/types/services/transactions/getTotalBankBalance.dto';
import { addToast } from '@heroui/toast';
import { useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';

export const useGetTotalBalance = (dto: IRequestGetTotalBalance) => {
  const query = useQuery({
    queryKey: ['transaction-total-balance', Object.values(dto)], // rename tag
    queryFn: () =>
      getTotalBalance({
        ...dto,
        start_date: subDays(new Date(), 7),
        end_date: new Date(),
        transaction_type_id: dto.transaction_type_id ?? TransactionTypeEnum.DEPOSIT,
      }), // masukin function
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

export const useGetTotalBankBalance = (dto: IRequestGetBankBalance) => {
  const query = useQuery({
    queryKey: ['transactions', 'total--bank-balance'], // rename tag
    queryFn: () => getTotalBankBalance(dto), // masukin function
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

export const useGetTopCustomers = (dto: IRequestGetTopCustomer) => {
  const query = useQuery({
    queryKey: ['transactions', 'top-customers'], // rename tag
    queryFn: () => getTopCustomer({
      ...dto,
      start_date: subDays(new Date(), 30),
      end_date: new Date(),
    }), // masukin function
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
