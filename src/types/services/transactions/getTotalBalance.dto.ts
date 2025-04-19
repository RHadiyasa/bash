import { TransactionTypeEnum } from "@/constant/transactionType.enum";

export interface IRequestGetTotalBalance {
    customer_account_number?: string;
    private_account_number?: string;
    start_date?: Date;
    end_date?: Date;
    transaction_type_id?: TransactionTypeEnum;
    bank_id?: number;
}

export interface IResponseGetTotalBalance {
    total_balance: number;
}

