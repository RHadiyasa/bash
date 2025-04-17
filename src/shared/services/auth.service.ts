import axios, { AxiosError, AxiosResponse } from 'axios';

import {
  IForgotRequest,
  IForgotResponse,
  ILoginRequest,
  ILoginResponse,
  ISignUpRequest,
  ISignUpResponse,
} from '@/types/authentication';
import { IResponseApi } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_USER_SERVICE || 'http://localhost:3003/api';

export const authLogin = async (dto: ILoginRequest): Promise<ILoginResponse>=> {
  try {
    const response: AxiosResponse<IResponseApi<ILoginResponse>> = await axios.post(BASE_URL + '/auth/login', {
      usernameOrEmail: dto.email,
      password: dto.password,
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

export const authForgot = async (dto: IForgotRequest): Promise<any> => {
  try {
    const response: AxiosResponse<ILoginResponse> = await axios.get(BASE_URL + '/users/login', {
      params: {
        email: dto.email,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

export const authSignUp = async (dto: ISignUpRequest): Promise<any> => {
  try {
    const response: AxiosResponse<ILoginResponse> = await axios.post(BASE_URL + '/users/login', {
      email: dto.email,
      username: dto.username,
      password: dto.password,
    });

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};
