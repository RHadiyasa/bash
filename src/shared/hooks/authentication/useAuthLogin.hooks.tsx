import { addToast } from '@heroui/toast';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authLogin } from '@/shared/services/auth.service';
import { IRequestAuthLogin } from '@/types/services/authentication/authLogin.interface';
import { useAuthenticationStore } from '@/shared/store/authentication.store';

export const useAuthLogin = () => {
  const router = useRouter();
  const { login } = useAuthenticationStore();

  return useMutation({
    mutationFn: (dto: IRequestAuthLogin) => authLogin(dto),
    onSuccess: async (data) => {
      await login(data);
      addToast({
        title: 'Success',
        description: 'You have successfully logged in',
        color: 'success',
        variant: 'flat',
      });
      router.push('/dashboard');
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
