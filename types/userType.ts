export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    HOSPITAL = "HOSPITAL",
    MERCHANT = "MERCHANT",
    TOUR = "TOUR",
    LEARNING_RESOURCE = "LEARNING_RESOURCE",
    HOTEL = "HOTEL",
    SEASONAL_TRAVEL = "SEASONAL_TRAVEL"
}

export enum Usage_Status {
    OFFLINE = "OFFLINE",
    ONLINE = "ONLINE"
}

export enum Account_Status {
    DELETE = "DELETE",
    ACTIVE = "ACTIVE",
    SUSPEND = "SUSPEND"
}

export interface USER_TYPE {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    tel: string;
    profile_picture: string;
    role: Role;
    usage_status: Usage_Status;
    status_last_update: Date;
    account_status: Account_Status;
    created_at: Date
    updated_at: Date
}
