import { IResponsePagination } from "@/types/common/responsePaginatio.interface";

export interface IRequestGetTopCustomer {
    start_date?: Date;
    end_date?: Date;
    bank_id?: number;
    take?: number;
    page?: number;
}

export interface ITopCustomer {
    id: number
    full_name: string
    customer_account_number: string
    name: string
    amount: number
}

export type IResponseGetTopCustomer = IResponsePagination<ITopCustomer>