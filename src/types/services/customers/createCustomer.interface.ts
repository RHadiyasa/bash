export interface IRequestCreateCustomer {
    public_account_number?: string
    full_name: string
    name: string
    email: string
    identity_number?: string
    photo_url?: string
    province?: string
    regency?: string
    district?: string
    village?: string
    address?: string
    postal_code?: string
    phone?: string
}

export interface IResponseCreateCustomer {
    
}