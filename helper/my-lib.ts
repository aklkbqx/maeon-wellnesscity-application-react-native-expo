import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImageManipulator from 'expo-image-manipulator';
import axios, { AxiosError } from 'axios';
import { Image } from 'react-native';
import useShowToast from '@/hooks/useShowToast';
import { router } from 'expo-router';

export const userTokenLogin = "userTokenLogin";

export const base64ToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const fileType = dataUrl.split('data:')[1].split(";")[0];
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: fileType });
}

export const resizeImage = async (uri: string, img_w: number, img_h: number): Promise<ImageManipulator.ImageResult> => {
    return new Promise((resolve, reject) => {
        Image.getSize(
            uri,
            async (width, height) => {
                const aspectRatio = width / height;
                const containerRatio = img_w / img_h;

                let resizeWidth, resizeHeight;
                if (containerRatio > aspectRatio) {
                    resizeWidth = img_w;
                    resizeHeight = img_w / aspectRatio;
                } else {
                    resizeHeight = img_h;
                    resizeWidth = img_h * aspectRatio;
                }

                try {
                    const manipulatedImage = await ImageManipulator.manipulateAsync(
                        uri,
                        [
                            {
                                resize: {
                                    width: resizeWidth,
                                    height: resizeHeight
                                }
                            },
                            {
                                crop: {
                                    originX: (resizeWidth - img_w) / 2,
                                    originY: (resizeHeight - img_h) / 2,
                                    width: img_w,
                                    height: img_h
                                }
                            }
                        ],
                        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
                    );
                    resolve(manipulatedImage);
                } catch (error) {
                    reject(error);
                }
            },
            (error) => {
                reject(error);
            }
        );
    });
};

export const saveTokenAndLogin = async (token: string) => {
    try {
        await AsyncStorage.setItem(userTokenLogin, token);
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

export const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${parseInt(year) + 543}`;
};

export const formatDateThai = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
};

export const formatEmail = (email: string) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (localPart.length > 3) {
        return `${localPart.substring(0, 3)}***@${domain}`;
    }
    return `${localPart}***@${domain}`;
};

export const formatPhoneNumber = (phoneNumber: string | null) => {
    if (!phoneNumber) return '';
    const formattedNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return formattedNumber;
};


export function getThaiDate() {
    const date = new Date();
    const timezoneOffset = 7 * 60;
    const thailandTime = new Date(date.getTime() + timezoneOffset * 60 * 1000);
    return thailandTime.toISOString();
}

export const handleErrorMessage = (error: unknown, errorPage?: boolean) => {
    console.log(error);
    useShowToast("error", "เกิดข้อผิดพลาด", error as string);
    if (errorPage) {
        router.replace({
            pathname: "/error-page",
            params: {
                error: error as string
            }
        });
    }
};



interface ErrorResponse {
    success: boolean;
    message: string;
    error?: string;
}

/**
 * Handles Axios errors and other errors, providing appropriate error messages.
 * 
 * @param error - The error object to handle
 * @param handleErrorMessage - A function to handle displaying error messages to the user
 * @returns The error message
 */
export const handleAxiosError = (error: unknown, handleErrorMessage: (message: string) => void): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
            console.error('Response data:', axiosError.response.data);
            console.error('Response status:', axiosError.response.status);
            console.error('Response headers:', axiosError.response.headers);

            const errorMessage = axiosError.response.data?.message || "เกิดข้อผิดพลาดในการดำเนินการ";

            if (errorMessage.includes("ข้อมูลผู้รับเงินไม่ตรงกับที่ระบุในระบบ")) {
                handleErrorMessage(errorMessage);
            } else {
                handleErrorMessage(errorMessage);
            }
            return errorMessage;
        } else if (axiosError.request) {
            console.error('Request error:', axiosError.request);
            const errorMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง";
            handleErrorMessage(errorMessage);
            return errorMessage;
        } else {
            console.error('Error message:', axiosError.message);
            const errorMessage = "เกิดข้อผิดพลาดในการส่งคำขอ กรุณาลองใหม่อีกครั้ง";
            handleErrorMessage(errorMessage);
            return errorMessage;
        }
    } else {
        console.error('Non-Axios error:', error);
        const errorMessage = "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง";
        handleErrorMessage(errorMessage);
        return errorMessage;
    }
};