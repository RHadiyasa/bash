import { addToast } from '@heroui/toast';
import { useMutation } from '@tanstack/react-query';
import { IRequestResetUserPassword } from '@/types/services/user/resetUserPassword.interface';
import { resetUserPassword } from '@/shared/services/users.service';

export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: (dto: IRequestResetUserPassword) => resetUserPassword(dto),
    onSuccess: () => {
      addToast({
        title: 'Success',
        description: 'Reset password success, temporary password has been sent to email address',
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
