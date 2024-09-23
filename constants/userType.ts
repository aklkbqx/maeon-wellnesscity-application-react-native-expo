export enum ROLE {
    USER = 'USER',
    ADMIN = 'ADMIN',
    HOSPITAL = 'HOSPITAL',
    MERCHANT = 'MERCHANT',
    TOUR = 'TOUR',
    LEARNING_RESOURCE = 'LEARNING_RESOURCE',
    HOTEL = 'HOTEL',
    SEASONAL_TRAVEL = 'SEASONAL_TRAVEL'
}

export enum USAGE_STATUS {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE"
}

export enum ACCOUNT_STATUS {
    ACTIVE = "ACTIVE",
    SUSPEND = "SUSPEND",
    DELETE = "DELETE"
}

export interface USER_TYPE {
    user_id: number;
    name: string;
    email: string;
    tel: string;
    profile: string;
    role: ROLE;
    usage_status: USAGE_STATUS;
    account_status: ACCOUNT_STATUS;
}