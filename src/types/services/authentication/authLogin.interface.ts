export interface IResponseAuthLogin {
    payload: IAuthLoginPayload;
    jwt: string;
}

export interface IAuthLoginPayload {
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

export interface IRequestAuthLogin {
    email: string;
    password: string;
}