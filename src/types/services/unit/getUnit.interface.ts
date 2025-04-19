import { IRequestPagination, IResponsePagination } from "@/types/common/responsePaginatio.interface";

export interface IRequestGetUnit extends IRequestPagination {
    name?: string;
}

export interface IResponseGetUnit {
    id: number;
    name: string;
    code: string;
    description?: string;
}

export type IResponseGetUnitList = IResponsePagination<IResponseGetUnit>