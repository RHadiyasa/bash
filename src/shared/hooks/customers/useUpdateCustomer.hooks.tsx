import { addToast } from '@heroui/toast';
import { useMutation } from '@tanstack/react-query';
import { updateCustomerDetail } from '@/shared/services/customers.service';
import { IRequestCustomerDetail } from '@/types/services/customers/updateCustomerDetail.interface';

export const useUpdateCustomerDetail = () => {
  return useMutation({
    mutationFn: (dto: IRequestCustomerDetail) => updateCustomerDetail(dto),
    onSuccess: async () => {
      addToast({
        title: 'Success',
        description: 'Customer has been updated',
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
