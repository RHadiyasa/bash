import { IResponseApi } from '@/types/common/responseHttp.interface';
import { IResponsePagination } from '@/types/common/responsePaginatio.interface';
import {
  IRequestGetTransactionList,
  IResponseTransaction,
} from '@/types/services/transactions/getTransactionList.interface';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_BANK_SERVICE || 'http://localhost:3004/api';

export type ResGetTransactionList = IResponsePagination<IResponseTransaction>;
export const getTransactionList = async (dto: IRequestGetTransactionList): Promise<ResGetTransactionList> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<ResGetTransactionList>> = await axios.get(BASE_URL + '/transaction', {
      params: {
        ...dto,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

export const getTotalBalance = async (): Promise<number> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<number>> = await axios.get(BASE_URL + '/transaction/total-balance', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

export const getTotalTransaction = async (): Promise<number> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<number>> = await axios.get(BASE_URL + '/transaction/total-transaction', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

