import { addToast } from '@heroui/toast';
import { useMutation } from '@tanstack/react-query';
import { authForgot } from '@/shared/services/auth.service';
import { IRequestAuthForgot } from '@/types/services/authentication/authForgot.interface';

export const useAuthForgot = () => {
  return useMutation({
    mutationFn: (dto: IRequestAuthForgot) => authForgot(dto),
    onSuccess: () => {
      addToast({
        title: 'Success',
        description: 'change password link has been sent to your email address',
        color: 'success',
        variant: 'flat',
      });
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
