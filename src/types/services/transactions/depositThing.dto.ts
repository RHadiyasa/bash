export interface IDetailTransaction {
    store_id: number;
    amount: number;
}

export interface IRequestDepositThing {
    customer_id: number;
    message: string
    detail_transaction: IDetailTransaction[]
}

export interface IResponseDepositThing {
    
}