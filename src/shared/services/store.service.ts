import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { IResponseApi } from '@/types/common/responseHttp.interface';
import { IRequestGetTransactionStoreDto, IResponseGetTransactionStoreDto, ITransactionStore } from '@/types/services/warehouseTransactionStore/getTransactionStore.interface';
import { IRequestCreateStore } from '@/types/services/store/createStore.interface';
import { IRequestGetStoreList, IResponseGetStorelist, IResponseStore } from '@/types/services/store/getStore.interface';
import { IRequestStoreLogs, IResponseStoreLogs } from '@/types/services/store/getStoreLogs.interface';
import { IRequestUpdateStore } from '@/types/services/store/updateStore.interface';

const BASE_URL = process.env.NEXT_PUBLIC_WAREHOUSE_SERVICE || 'http://localhost:3005/api';

export const createStore = async (dto: IRequestCreateStore): Promise<ITransactionStore[]> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<ITransactionStore[]>> = await axios.post(
      BASE_URL + '/store',
      {
        ...dto,
      },
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

export const getStoreList = async (dto: IRequestGetStoreList): Promise<IResponseGetStorelist> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseGetStorelist>> = await axios.get(BASE_URL + '/store', {
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

export const getStoreDetail = async (id: number): Promise<IResponseStore> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseStore>> = await axios.get(BASE_URL + '/store/'+ id, {
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

export const getStoreLogs = async (dto: IRequestStoreLogs): Promise<IResponseStoreLogs> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseStoreLogs>> = await axios.get(BASE_URL + '/store/logs/'+ dto.id, {
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

export const updateStore = async (dto: IRequestUpdateStore): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.patch(
      BASE_URL + '/store/' + dto.id,
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

export const deleteStore = async (id: number): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.delete(
      BASE_URL + '/store/' + id,
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
