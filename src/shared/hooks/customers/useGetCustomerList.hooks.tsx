import { getCustomerList } from '@/shared/services/customers.service';
import { IRequestGetCustomerList } from '@/types/services/customers/getCustomerList.interface';
import { addToast } from '@heroui/toast';
import { useQuery } from '@tanstack/react-query';

export const useGetCustomerList = (dto: IRequestGetCustomerList) => {
  const query = useQuery({
    queryKey: ['customers'], // rename tag
    queryFn: () => getCustomerList(dto), // masukin function
    staleTime: 1000 * 60 * 5,     // Keep data fresh for 5 minutes
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
