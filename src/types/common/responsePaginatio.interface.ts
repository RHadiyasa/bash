export interface IResponsePagination<T> {
    data: T[]
    meta: IPagination
}

export interface IPagination {
    page: number
    offset: number
    itemCount: number
    pageCount: number
}

export interface IRequestPagination {
    take: number
    page: number
}