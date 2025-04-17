import { getListUser } from '@/shared/services/users.service';
import { IRequestGetUserList } from '@/types/services/user/getUserList.interface';
import { addToast } from '@heroui/toast';
import { useQuery } from '@tanstack/react-query';

export const useGetUserList = (dto: IRequestGetUserList) => {
  const query = useQuery({
    queryKey: ['users', dto.page, dto.take],
    queryFn: () => getListUser(dto),
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
