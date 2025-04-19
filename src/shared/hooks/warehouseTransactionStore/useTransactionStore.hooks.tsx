import { TransactionStatusEnum } from '@/constant/transactionStatus.enum';
import { getWarehouseTransactionTotalStore } from '@/shared/services/transaction-store.service';
import { IRequestGetTransactionStoreDto } from '@/types/services/warehouseTransactionStore/getTransactionStore.interface';
import { addToast } from '@heroui/toast';
import { useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';

export const useGetWarehouseTotal = (dto: IRequestGetTransactionStoreDto) => {
  const query = useQuery({
    queryKey: ['transaction-store-total', Object.values(dto)], // rename tag
    queryFn: () =>
        getWarehouseTransactionTotalStore({
        ...dto,
        start_date: subDays(new Date(), 30),
        end_date: new Date(),
        transaction_status_ids: dto.transaction_status_ids?.length ? dto.transaction_status_ids : [TransactionStatusEnum.SUCCESS]
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
