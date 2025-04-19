import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { IResponsePagination } from '@/types/common/responsePaginatio.interface';
import { IResponseApi } from '@/types/common/responseHttp.interface';
import { IRequestGetCustomerList, IResponseGetCustomerList } from '@/types/services/customers/getCustomerList.interface';
import { IResponseGetCustomerDetail } from '@/types/services/customers/getCustomerDetail.interface';
import { IRequestCustomerDetail } from '@/types/services/customers/updateCustomerDetail.interface';
import { IRequestCreateCustomer } from '@/types/services/customers/createCustomer.interface';

const BASE_URL = process.env.NEXT_PUBLIC_BANK_SERVICE || 'http://localhost:3003/api';


export const createCustomer = async (dto: IRequestCreateCustomer): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.post(
      BASE_URL + '/customer/',
      {
        ...dto,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

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

export const getCustomerDetail = async (id: number): Promise<IResponseGetCustomerDetail> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseGetCustomerDetail>> = await axios.get(
      BASE_URL + '/customer/' + id,
      {
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

export const updateCustomerDetail = async (dto: IRequestCustomerDetail): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.patch(
      BASE_URL + '/customer/' + dto.id,
      {
        ...dto,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};
