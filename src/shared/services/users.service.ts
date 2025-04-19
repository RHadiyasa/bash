import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { IResponsePagination } from '@/types/common/responsePaginatio.interface';
import { IRequestGetUserList, IResponseGetUserList } from '@/types/services/user/getUserList.interface';
import { IResponseApi } from '@/types/common/responseHttp.interface';
import {
  IRequestResetUserPassword,
  IResponseResetUserPassword,
} from '@/types/services/user/resetUserPassword.interface';
import { IRequestChangeUserPassword } from '@/types/services/user/changeUserPassword.interface';

const BASE_URL = process.env.NEXT_PUBLIC_USER_SERVICE || 'http://localhost:3003/api';

export type ResGetUserList = IResponsePagination<IResponseGetUserList>;
export const getListUser = async (dto: IRequestGetUserList): Promise<ResGetUserList> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<ResGetUserList>> = await axios.get(BASE_URL + '/user', {
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

export const getUserById = async (id: number): Promise<IResponseGetUserList> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseGetUserList>> = await axios.get(BASE_URL + '/user/' + id, {
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

export const resetUserPassword = async (dto: IRequestResetUserPassword): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseResetUserPassword>> = await axios.post(
      BASE_URL + '/user/reset-password',
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

export const getValidationUsernameOrEmail = async (usernameOrEmail: string): Promise<boolean> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<{ message: string }>> = await axios.get(
      BASE_URL + '/validate-email-username/' + usernameOrEmail,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    return response.data.responseCode == '200';
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

export const changeUserPassword = async (dto: IRequestChangeUserPassword): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseResetUserPassword>> = await axios.post(
      BASE_URL + '/user/change-password',
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
