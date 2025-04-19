import { IRequestPagination, IResponsePagination } from "@/types/common/responsePaginatio.interface";

export interface IRequestCategoryList extends IRequestPagination {
    name?: string;
}

export interface IResponseCategory {
    id: number
    name: string
    code: string
    description: string
    unit_id: number
    unit_name: string
}

export type IResponseCategoryList = IResponsePagination<IResponseCategory>