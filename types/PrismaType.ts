export enum AccountStatus {
    DELETE = "DELETE",
    ACTIVE = "ACTIVE",
    SUSPEND = "SUSPEND",
}

export enum UsageStatus {
    OFFLINE = "OFFLINE",
    ONLINE = "ONLINE",
}

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
    HOSPITAL = "HOSPITAL",
    MERCHANT = "MERCHANT",
    TOUR = "TOUR",
    LEARNING_RESOURCE = "LEARNING_RESOURCE",
    HOTEL = "HOTEL",
    SEASONAL_TRAVEL = "SEASONAL_TRAVEL",
}

export enum PaymentsStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    PENDING_VERIFICATION = "PENDING_VERIFICATION",
    REJECTED = "REJECTED",
}

export enum BookingsStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
}

export enum PaymentsPaymentMethod {
    PROMPTPAY = "PROMPTPAY",
    BANK_ACCOUNT_NUMBER = "BANK_ACCOUNT_NUMBER",
}

export interface Activities {
    id: number;
    name: string;
    description?: string | null;
    duration?: number | null;
    cost?: number | null;
    location_id: number;
    created_at?: Date | null;
    updated_at?: Date | null;
    locations: Locations;
}

export interface Locations {
    id: number;
    name: string;
    type: number;
    description?: string | null;
    address?: string | null;
    subdistrict_id?: number | null;
    website?: string | null;
    location_map: string;
    time_slots: string;
    owner_id: number;
    isActive: boolean;
    created_at?: Date | null;
    updated_at?: Date | null;
    activities: Activities[];
    locationtype: LocationTypes;
    subdistricts?: Subdistricts | null;
    users: Users;
}

export interface Programs {
    id: number;
    type: number;
    name: string;
    description: string;
    schedules: string;
    total_price: number;
    wellness_dimensions?: string | null;
    created_by?: number | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    program_images: ProgramImages[];
    programtypes: ProgramTypes;
    users?: Users | null;
}

export interface Subdistricts {
    id: number;
    name: string;
    created_at?: Date | null;
    updated_at?: Date | null;
    locations: Locations[];
}

export interface Users {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    tel: string;
    profile_picture?: string | null;
    role?: UserRole | null;
    usage_status?: UsageStatus | null;
    status_last_update?: Date | null;
    account_status?: AccountStatus | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    bookings: Bookings[];
    locations: Locations[];
    programs: Programs[];
}

export interface LocationTypes {
    id: number;
    name: string;
    created_at?: Date | null;
    updated_at?: Date | null;
    locations: Locations[];
}

export interface ProgramTypes {
    id: number;
    name: string;
    description: string;
    created_at?: Date | null;
    updated_at?: Date | null;
    programs: Programs[];
}

export interface ProgramImages {
    id: number;
    program_id: number;
    image_name_data: string;
    created_at?: Date | null;
    updated_at?: Date | null;
    programs: Programs;
}

export interface Payments {
    id: number;
    booking_id: number;
    amount: number;
    payment_method?: PaymentsPaymentMethod | null;
    payment_data?: string | null;
    slip_image?: string | null;
    status: PaymentsStatus;
    transaction_id?: string | null;
    payment_date?: Date | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    expires_at?: Date | null;
    program_bookings: Bookings;
}

export interface Bookings {
    id: number;
    user_id: number;
    booking_detail: string;
    booking_date: Date;
    start_date: Date;
    end_date: Date;
    people: number;
    total_price: number;
    status: BookingsStatus;
    created_at?: Date | null;
    updated_at?: Date | null;
    users: Users;
    payments?: Payments | null;
}
