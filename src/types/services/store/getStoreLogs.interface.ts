import { IRequestPagination, IResponsePagination } from "@/types/common/responsePaginatio.interface";

export interface IRequestStoreLogs extends IRequestPagination {
    id: number;
    start_date?: Date;
    end_date?: Date;
}

export interface IStoreLogs {
    id: string | null
    last_logs_id: string | null
    store_id: number | null
    name: string | null
    category_id: number | null
    category_name: string | null
    price: number | null
    fee: number | null
    created_at: string | null
}

export type IResponseStoreLogs = IResponsePagination<IStoreLogs>