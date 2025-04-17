export interface IResponseApi<T> {
    responseCode : string
    message : string
    data : T
}