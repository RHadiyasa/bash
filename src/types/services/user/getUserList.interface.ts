import { IRequestPagination } from "@/types/common/responsePaginatio.interface";

export interface IRequestGetUserList extends IRequestPagination {
    username?: string;
    email?: string;
    role_id?: number;
    ids?: number[]
}

export interface IResponseGetUserList {
    id: number
    name: string
    username: string
    email: string
    phone: string
    bank_id: number
    role: string
    is_temp_password: boolean
    is_email_verified: boolean
}