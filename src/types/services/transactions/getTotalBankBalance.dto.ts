export interface IRequestGetBankBalance {
    bank_id?: number;
}

export interface IResponseBankBalance {
    total_latest_amount: number;
}