import { TransactionStatusEnum } from "@/constant/transactionStatus.enum";

export interface IRequestGetTransactionStoreDto {
    transaction_status_ids?: TransactionStatusEnum[];
    warehouse_id?: number;
    start_date?: Date;
    end_date?: Date;
}

export interface ITransactionStore {
    id: number
    name: string
    category_id: number
    category_name: string
    unit_id: number
    unit_name: string
    unit_code: string
    total_amount: number
}

export type IResponseGetTransactionStoreDto = ITransactionStore[]