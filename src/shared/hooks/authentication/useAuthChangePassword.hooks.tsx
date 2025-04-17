import { addToast } from '@heroui/toast';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authChangePassword } from '@/shared/services/auth.service';
import { IRequestChangePassword } from '@/types/services/authentication/authChangePassword.interface';

export const useAuthChangePassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (params: IRequestChangePassword) => authChangePassword(params),
    onSuccess: async () => {
      addToast({
        title: 'Success',
        description: 'Password changed successfully, please logged in',
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