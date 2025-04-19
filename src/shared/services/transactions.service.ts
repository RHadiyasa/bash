import { IResponseApi } from '@/types/common/responseHttp.interface';
import { IResponsePagination } from '@/types/common/responsePaginatio.interface';
import { IRequestDepositThing, IResponseDepositThing } from '@/types/services/transactions/depositThing.dto';
import { IRequestGetTopCustomer, IResponseGetTopCustomer } from '@/types/services/transactions/getTopCustomer.dto';
import { IRequestGetTotalBalance, IResponseGetTotalBalance } from '@/types/services/transactions/getTotalBalance.dto';
import { IRequestGetBankBalance, IResponseBankBalance } from '@/types/services/transactions/getTotalBankBalance.dto';
import {
  IRequestGetTransactionList,
  IResponseTransaction,
} from '@/types/services/transactions/getTransactionList.interface';
import { IRequestWithdrawCash } from '@/types/services/transactions/withdrawCash.dto';
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

export const getTotalBalance = async (dto: IRequestGetTotalBalance): Promise<IResponseGetTotalBalance> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseGetTotalBalance>> = await axios.get(
      BASE_URL + '/transaction/total-balance',
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

export const getTotalBankBalance = async (dto: IRequestGetBankBalance): Promise<IResponseBankBalance> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseBankBalance>> = await axios.get(
      BASE_URL + '/transaction/total-bank-balance',
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

export const getTopCustomer = async (dto: IRequestGetTopCustomer): Promise<IResponseGetTopCustomer> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseGetTopCustomer>> = await axios.get(
      BASE_URL + '/transaction/best-customers',
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

export const depositThing = async (dto: IRequestDepositThing): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.post(
      BASE_URL + '/transaction/deposit/thing',
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

export const withdrawCash = async (dto: IRequestWithdrawCash): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.post(
      BASE_URL + '/transaction/withdraw/cash',
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
