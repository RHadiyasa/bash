import { addToast } from '@heroui/toast';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authVerifiedEmail } from '@/shared/services/auth.service';

export const useAuthVerifiedEmail = () => {
    const router = useRouter();
  
    return useMutation({
      mutationFn: (token_from_email: string) => authVerifiedEmail(token_from_email),
      onSuccess: async () => {
        addToast({
          title: 'Success',
          description: 'User account has been verified, please logged in',
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
  
  