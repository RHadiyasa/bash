import { IRequestPagination } from "@/types/common/responsePaginatio.interface";

export interface IRequestGetTransactionList extends IRequestPagination {
    customer_account_number?: string;
    private_account_number?: string;
    start_date?: string;
    end_date?: string;
    transaction_types?: number[];
    transaction_status?: number[];
    transaction_category?: number[];
}

export interface IResponseTransaction {
    id: string
    customer_id: number
    bank_id: number
    customer_account_number: string
    amount: number
    fee_amount: number
    final_amount: number
    message: string
    transaction_type_id: number
    transaction_type_name: string
    transaction_status_id: number
    transacion_status_name: string
    last_transaction_id: string
    created_at: string
    transaction_detail: ITransactionDetail[]
}

export interface ITransactionDetail {
    "id": string
    "created_by": number
    "created_at": string
    "updated_by": number
    "updated_at": string
    "trx_id": null,
    "transaction_id": string
    "store_id": number
    "store_price": "900",
    "amount": "1.3",
    "final_price": "1170",
    "category_id": number
    "category_name": string
    "category_code": string
    "unit_id": number
    "unit_name": string
    "unit_code": string
    "transaction_type_id": number
    "transaction_status_id": number
    "bank_id": number
    "warehouse_id": number
}