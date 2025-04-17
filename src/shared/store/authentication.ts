import Cookies from 'js-cookie';
import { create } from 'zustand';
import { useEffect } from 'react';

import { getUserDetail } from '../services/users.service';

import { ILoginResponse } from '@/types/authentication';

interface IUserPayload {
  userId?: string;
  email?: string;
  isAdmin?: boolean;
  name?: string;
}

interface IAuthenticationState {
  payload: IUserPayload;
  isLogin: boolean;
  login: (dto: ILoginResponse) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}
export const useAuthenticationStore = create<IAuthenticationState>((set) => ({
  payload: {},
  isLogin: false,
  login: async (dto) => {
    Cookies.set('token', dto.jwt!, {
      expires: 1 / 3, // 8 hours
      secure: true,
      sameSite: 'Strict',
    });
    // const userDetail = await getUserDetail();

    Cookies.set(
      'user',
      JSON.stringify({
        id: dto.payload.id,
        name: dto.payload.name,
        username: dto.payload.username,
        email: dto.payload.email,
        role_id: dto.payload.role_id,
        bank_id: dto.payload.bank_id,
        is_temp_password: dto.payload.is_temp_password,
        is_email_verified: dto.payload.is_email_verified,
        warehouse_id: dto.payload.warehouse_id,
        trx_id: dto.payload.trx_id,
      }),
      {
        expires: 1 / 3, // 8 hours
        secure: true,
        sameSite: 'Strict',
      },
    );

    set(() => ({
      payload: {
        id: dto.payload.id,
        name: dto.payload.name,
        username: dto.payload.username,
        email: dto.payload.email,
        role_id: dto.payload.role_id,
        bank_id: dto.payload.bank_id,
        is_temp_password: dto.payload.is_temp_password,
        is_email_verified: dto.payload.is_email_verified,
        warehouse_id: dto.payload.warehouse_id,
        trx_id: dto.payload.trx_id,
      },
      isLogin: true,
    }));
  },
  logout: () =>
    set(() => {
      Cookies.remove('token');
      Cookies.remove('user');

      return {
        payload: {},
        isLogin: false,
      };
    }),
  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('token');
      const userData = Cookies.get('user');
      const initialPayload: IUserPayload = JSON.parse(userData ?? '{}');

      set({
        isLogin: !!token,
        payload: initialPayload,
      });
    }
  },
}));

// Hook to call `initializeAuth` on mount
export const useInitializeAuth = () => {
  const initializeAuth = useAuthenticationStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
};
