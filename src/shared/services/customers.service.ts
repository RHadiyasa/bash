import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { IResponsePagination } from '@/types/common/responsePaginatio.interface';
import { IResponseApi } from '@/types/common/responseHttp.interface';
import { IRequestGetCustomerList, IResponseGetCustomerList } from '@/types/services/customers/getCustomerList.interface';

const BASE_URL = process.env.NEXT_PUBLIC_BANK_SERVICE || 'http://localhost:3003/api';

export type ResGetCustomerList = IResponsePagination<IResponseGetCustomerList>;
export const getCustomerList = async (dto: IRequestGetCustomerList): Promise<ResGetCustomerList> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<ResGetCustomerList>> = await axios.get(
      BASE_URL + '/customer',
      {
        params: {
          ...dto,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};