import { IRequestPagination, IResponsePagination } from "@/types/common/responsePaginatio.interface"

export interface IRequestGetFee extends IRequestPagination {

}

export interface IGetFee {
    id: number
    store_name: string | null
    percentage: number
    warehouse_name: string
    bank_id: number
    warehouse_id: number
}

export type IResponseGetFee = IResponsePagination<IGetFee>