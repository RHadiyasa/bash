export interface IRequestCreateStore {
    name: string
    price: number
    category_id: number
    is_custom_fee?: boolean
    is_default_fee?: boolean
    custom_fee: number
}

export interface IResponseCreateStore {

}