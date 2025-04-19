import { addToast } from '@heroui/toast';
import { useMutation } from '@tanstack/react-query';
import { IRequestCreateCustomer } from '@/types/services/customers/createCustomer.interface';
import { createCustomer } from '@/shared/services/customers.service';

export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: (dto: IRequestCreateCustomer) => createCustomer(dto),
    onSuccess: async () => {
      addToast({
        title: 'Success',
        description: 'New Customer has been created',
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
