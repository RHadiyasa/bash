import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { IResponseApi } from '@/types/common/responseHttp.interface';
import { IRequestGetTransactionStoreDto, ITransactionStore } from '@/types/services/warehouseTransactionStore/getTransactionStore.interface';
import { IRequestUpdateTransactionStoreStatus } from '@/types/services/warehouseTransactionStore/updateTransactionStoreStatus.interface';
import { IRequestTransactionStoreList, IResponseTransactionStoreList } from '@/types/services/warehouseTransactionStore/getTransactionStoreList.interface';

const BASE_URL = process.env.NEXT_PUBLIC_WAREHOUSE_SERVICE || 'http://localhost:3005/api';

export const getWarehouseTransactionTotalStore = async (dto: IRequestGetTransactionStoreDto): Promise<ITransactionStore[]> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<ITransactionStore[]>> = await axios.get(
      BASE_URL + '/transaction-store/total-by-store',
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


export const getWarehouseTransactionStoreList = async (dto: IRequestTransactionStoreList): Promise<IResponseTransactionStoreList> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseTransactionStoreList>> = await axios.get(
      BASE_URL + '/transaction-store',
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


export const completeTransactionStore = async (dto: IRequestUpdateTransactionStoreStatus): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.patch(
      BASE_URL + '/transaction_store/complete',
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


export const cancelTransactionStore = async (dto: IRequestUpdateTransactionStoreStatus): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.patch(
      BASE_URL + '/transaction_store/complete',
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