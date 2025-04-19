import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { IResponseApi } from '@/types/common/responseHttp.interface';
import { IRequestGetTransactionStoreDto, IResponseGetTransactionStoreDto, ITransactionStore } from '@/types/services/warehouseTransactionStore/getTransactionStore.interface';

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