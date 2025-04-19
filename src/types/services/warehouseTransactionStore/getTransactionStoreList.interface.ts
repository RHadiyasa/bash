import { TransactionStatusEnum } from "@/constant/transactionStatus.enum";
import { TransactionTypeEnum } from "@/constant/transactionType.enum";
import { IRequestPagination } from "@/types/common/responsePaginatio.interface";

export interface IRequestTransactionStoreList extends IRequestPagination {
    transaction_bank_id: string
    store_ids: number[]
    category_store_ids: number[]
    start_date: Date
    end_date: Date
    transaction_type_ids: TransactionTypeEnum[]
    transaction_status_ids: TransactionStatusEnum[]
}

export interface IResponseTransactionStoreList {

}