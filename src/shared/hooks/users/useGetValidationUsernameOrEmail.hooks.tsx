import { getValidationUsernameOrEmail } from '@/shared/services/users.service';
import { addToast } from '@heroui/toast';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

export const useGetValidationUsernameOrEmail = (usernameOrEmail: string) => {
  const [debouncedSearch] = useDebounce(usernameOrEmail, 500);
  const query = useQuery({
    queryKey: ['users', usernameOrEmail],
    queryFn: () => getValidationUsernameOrEmail(debouncedSearch),
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
