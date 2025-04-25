"use client"
import Cookies, { CookieAttributes } from 'js-cookie';
import { create } from 'zustand';
import { useEffect } from 'react';
import { COOKIES_TOKEN, COOKIES_USER } from '@/constant/token.constant';
import { IRequestAuthLogin, IResponseAuthLogin } from '@/types/services/authentication/authLogin.interface';

interface IUserPayload {
  userId?: string;
  email?: string;
  isAdmin?: boolean;
  name?: string;
}

interface IAuthenticationState {
  payload: IUserPayload;
  isLogin: boolean;
  login: (dto: IResponseAuthLogin) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}
export const useAuthenticationStore = create<IAuthenticationState>((set) => ({
  payload: {},
  isLogin: false,
  login: async (dto) => {
    const optionsCookies: CookieAttributes = {
      expires: 1 / 3, // 8 hours
      secure: true,
      sameSite: 'Strict',
    }

    Cookies.set( COOKIES_TOKEN , dto.jwt!, optionsCookies);
    
    const userPayload = {
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
    }

    Cookies.set( COOKIES_USER, JSON.stringify(userPayload) , optionsCookies);

    set(() => ({
      payload: userPayload,
      isLogin: true,
    }));
  },
  logout: () =>
    set(() => {
      Cookies.remove( COOKIES_TOKEN );
      Cookies.remove(COOKIES_USER);

      return {
        payload: {},
        isLogin: false,
      };
    }),
  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get( COOKIES_TOKEN );
      const userData = Cookies.get(COOKIES_USER);
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
