import { addToast } from '@heroui/toast';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { changeUserPassword } from '@/shared/services/users.service';
import { IRequestChangeUserPassword } from '@/types/services/user/changeUserPassword.interface';

export const useChangeUserPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: IRequestChangeUserPassword) => changeUserPassword(dto),
    onSuccess: async () => {
      addToast({
        title: 'Success',
        description: 'change password success, please login',
        color: 'success',
        variant: 'flat',
      });
      router.push('/login');
    },
    onError: (error) => {
      addToast({
        title: 'Error',
        description: error?.message || 'Something went wrong',
        color: 'danger',
        variant: 'flat',
      });
    },
  });
};
