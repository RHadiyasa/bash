import { IResponsePagination } from "@/types/common/responsePaginatio.interface";

export interface IRequestGetStoreList {
    page: number;
    limit: number;
    name?: string;
    category_id?: number;
}

export interface IResponseStore {
    id: number
    name: string
    category_id: number
    category_name: string
    category_code: string
    category_description: string
    price: number
    unit_id: number
    unit_name: string
    unit_code: string
    is_default_fee: true,
    fee: number
    store_price: number
}

export type IResponseGetStorelist = IResponsePagination<IResponseStore>