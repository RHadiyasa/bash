import { getUserById } from '@/shared/services/users.service';
import { addToast } from '@heroui/toast';
import { useQuery } from '@tanstack/react-query';

export const useGetUserById = (id: number) => {
  const query = useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(id),
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
