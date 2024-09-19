import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImageManipulator from 'expo-image-manipulator';
import tw from "twrnc"

export const base64ToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const fileType = dataUrl.split('data:')[1].split(";")[0];
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: fileType });
}


export const resizeImage = async (uri: string, img_w: number, img_h: number) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [
            {
                resize: {
                    width: img_w,
                    height: img_h
                }
            },
            {
                crop: {
                    originX: 0,
                    originY: 0,
                    width: img_w,
                    height: img_h
                }
            }
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipulatedImage;
};

export const saveTokenAndLogin = async (token: string) => {
    try {
        await AsyncStorage.setItem('userToken', token);
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

export const tabbarStyle = [{
    position: "absolute",
    width: "90%",
    height: 60,
    bottom: 20,
    left: "5%",
    borderRadius: 25,
    borderTopWidth: 0
}, tw`shadow bg-teal-600`];