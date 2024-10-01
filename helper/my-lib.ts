import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImageManipulator from 'expo-image-manipulator';
import tw from "twrnc"
import { Image } from 'react-native';

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

export const tabbarStyle = tw`shadow bg-white rounded-t-3xl absolute w-full h-[80px] bottom-0 border-t-0`;

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