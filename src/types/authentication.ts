export interface ILoginResponse {
  payload: ILoginPayload;
  jwt: string;
}

export interface ILoginPayload {
  id: string;
  name: string;
  username: string;
  email: string;
  role_id: string;
  bank_id: string;
  is_temp_password: string;
  is_email_verified: string;
  warehouse_id: string;
  trx_id: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IForgotResponse {
  message: string;
  success: boolean;
  userId?: string;
  email?: string;
  token?: string;
}

export interface IForgotRequest {
  email?: string;
}

export interface ISignUpResponse {
  message: string;
  success: boolean;
  userId?: string;
  email?: string;
  token?: string;
}

export interface ISignUpRequest {
  username?: string;
  email?: string;
  password?: string;
}
