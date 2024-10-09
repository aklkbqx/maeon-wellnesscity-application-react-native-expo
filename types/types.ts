export interface FormDataInput {
    firstname: string;
    lastname: string;
    tel: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ErrorResponse {
    success: boolean;
    message: string;
    error?: string;
}