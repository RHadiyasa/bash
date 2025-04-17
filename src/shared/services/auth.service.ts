import axios, { AxiosError, AxiosResponse } from 'axios';

import { IRequestAuthLogin, IResponseAuthLogin } from '@/types/services/authentication/authLogin.interface';
import { IResponseApi } from '@/types/common/responseHttp.interface';
import { IRequestAuthForgot, IResponseAuthForgot } from '@/types/services/authentication/authForgot.interface';
import { IRequestChangePassword, IResponseChangePassword } from '@/types/services/authentication/authChangePassword.interface';
import { IRequestVerifiedEmail, IResponseVerfifiedEmail } from '@/types/services/authentication/authVerifiedEmail.interface';

const BASE_URL = process.env.NEXT_PUBLIC_USER_SERVICE || 'http://localhost:3003/api';

export const authLogin = async (dto: IRequestAuthLogin): Promise<IResponseAuthLogin>=> {
  try {
    const response: AxiosResponse<IResponseApi<IResponseAuthLogin>> = await axios.post(BASE_URL + '/auth/login', {
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

export const authForgot = async (dto: IRequestAuthForgot): Promise<void> => {
  try {
    const response: AxiosResponse<IResponseApi<IResponseAuthForgot>> = await axios.post(BASE_URL + '/auth/forgot-password', {
      email: dto.email,
    });

    // return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

export const authChangePassword = async (dto: IRequestChangePassword): Promise<void> => {
  try {
    const response: AxiosResponse<IResponseApi<IResponseChangePassword>> = await axios.post(BASE_URL + '/auth/change-password', {
      token_from_email: dto.token_from_email,
      new_password: dto.new_password,
    });

    // return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

export const authVerifiedEmail = async (token_from_email: string): Promise<void> => {
  try {
    const response: AxiosResponse<IResponseApi<IResponseVerfifiedEmail>> = await axios.post(BASE_URL + '/auth/verified-email', {
      token_from_email: token_from_email,
    });

    // return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};