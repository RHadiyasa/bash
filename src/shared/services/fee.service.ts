import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { IResponseApi } from '@/types/common/responseHttp.interface';
import { ITransactionStore } from '@/types/services/warehouseTransactionStore/getTransactionStore.interface';
import { IRequestGetFee } from '@/types/services/fee/getFee.interface';
import { IRequestUpdateFee } from '@/types/services/fee/updateFee.interface';

const BASE_URL = process.env.NEXT_PUBLIC_WAREHOUSE_SERVICE || 'http://localhost:3005/api';

export const getFeeWarehouse = async (dto: IRequestGetFee): Promise<ITransactionStore[]> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<ITransactionStore[]>> = await axios.get(BASE_URL + '/fee', {
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

export const getStoreList = async (dto: IRequestUpdateFee): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.patch(
      BASE_URL + '/fee/warehouse',
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
