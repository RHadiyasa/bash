import { IRequestPagination } from "@/types/common/responsePaginatio.interface";

export interface IRequestGetCustomerList extends IRequestPagination {
    name?: string;
    identity_number?: string;
    public_account_number?: string;
}

export interface IResponseGetCustomerList {
    id: number,
    user_id: number
    private_account_number: string
    public_account_number: string
    full_name: string
    name: string
    identity_number: string
    phone: string
    province: string
    regency: string
    district: string
    village: string
    address: string
    postal_code: string
}