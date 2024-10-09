import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Image } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import TextTheme from '@/components/TextTheme';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import api from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';
import * as ImagePicker from 'expo-image-picker';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '@/types/types';
import Loading from './Loading';

interface PaymentQRCodeProps {
    bookingId: number;
    paymentMethod: string;
    onClose: () => void;
    onConfirmPayment: (slipImage: string, refNbr: string) => Promise<void>;
}

const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({ bookingId, paymentMethod, onClose, onConfirmPayment }) => {
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(15 * 60);
    const [isLoading, setIsLoading] = useState(false);
    const [slipImage, setSlipImage] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const fetchQRCode = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.put("/api/v1/payments/initiate-payment", {
                booking_id: bookingId,
                payment_method: paymentMethod
            });

            if (response.data.success) {
                setQrCodeData(response.data.data.qr_code);
                setCountdown(15 * 60); // Reset countdown to 15 minutes
            } else {
                handleErrorMessage(response.data.message || "ไม่สามารถสร้าง QR Code ได้");
            }
        } catch (error) {
            handleErrorMessage("เกิดข้อผิดพลาดในการสร้าง QR Code");
        } finally {
            setIsLoading(false);
        }
    }, [bookingId, paymentMethod]);

    useEffect(() => {
        fetchQRCode();
    }, [fetchQRCode]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            fetchQRCode();
        }
    }, [countdown, fetchQRCode]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setSlipImage(result.assets[0].uri);
        }
    };

    const confirmPayment = async () => {
        if (!slipImage) {
            handleErrorMessage("กรุณาอัพโหลดสลิปการชำระเงิน", true);
            return;
        }
        setIsConfirming(true);
        try {
            const formQRCode = new FormData();
            formQRCode.append("file", {
                uri: slipImage,
                type: 'image/jpeg',
                name: "file.png",
            } as any);

            const qrserver = await axios.post("http://api.qrserver.com/v1/read-qr-code/", formQRCode, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (qrserver.data && qrserver.data[0].symbol[0].data) {
                await onConfirmPayment(slipImage, qrserver.data[0].symbol[0].data);
            } else {
                handleErrorMessage("ไม่สามารถอ่านข้อมูลจากสลิปได้ กรุณาลองใหม่อีกครั้ง");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ErrorResponse>;
                if (axiosError.response) {
                    const errorMessage = axiosError.response.data?.message || "เกิดข้อผิดพลาดในการยืนยันการชำระเงิน";
                    handleErrorMessage(errorMessage);
                }
            }
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <View style={tw`relative`}>
            <View style={tw`p-4`}>
                {isLoading ? (
                    <TextTheme>กำลังโหลด QR Code...</TextTheme>
                ) : qrCodeData ? (
                    <>
                        <View style={tw`flex-row justify-center`}>
                            <Image source={require("@/assets/images/PromptPay-logo.png")} style={[tw`h-10`, { objectFit: "contain" }]} />
                        </View>
                        <QRCodeGenerator
                            data={qrCodeData}
                            size={200}
                            logo={require("@/assets/images/icon-thaiqr.png")}
                        />
                        <TextTheme style={tw`text-center`}>QR Code จะหมดอายุใน: {formatTime(countdown)}</TextTheme>
                        {countdown === 0 && (
                            <View style={tw`flex-row justify-center`}>
                                <TouchableOpacity onPress={fetchQRCode} style={tw`mt-4 rounded-xl py-2 px-4 flex-row items-center gap-2`}>
                                    <TextTheme style={tw`text-blue-500`}>สร้าง QR Code ใหม่</TextTheme>
                                    <Ionicons name='reload' size={24} style={tw`text-blue-500`} />
                                </TouchableOpacity>
                            </View>
                        )}
                        <View style={tw`mt-4`}>
                            {slipImage && (
                                <View style={tw`flex-row justify-center`}>
                                    <Image source={{ uri: slipImage }} style={[tw`w-30 h-30 rounded-sm mb-2 border border-zinc-200`, { objectFit: "cover" }]} />
                                </View>
                            )}
                            <View style={tw`flex-row gap-2 items-center`}>
                                <TouchableOpacity onPress={pickImage} style={tw`bg-blue-500 flex-1 rounded-xl py-2 flex-row gap-2 items-center justify-center`}>
                                    <Ionicons name='image' size={20} color={"white"} />
                                    <TextTheme style={tw`text-white text-center`}>อัพโหลดสลิป</TextTheme>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={confirmPayment}
                                    style={tw`flex-1 bg-green-500 rounded-xl py-2 flex-row gap-2 items-center justify-center
                                        ${!slipImage ? "opacity-50" : ""}`}
                                    disabled={!slipImage || isConfirming}
                                >
                                    {isConfirming ? <Loading loading={isConfirming} size={'small'} color='white' /> : <Ionicons name='checkmark-circle' size={20} color={"white"} />}
                                    <TextTheme style={tw`text-white text-center`}>
                                        {isConfirming ? "กำลังยืนยัน..." : "ยืนยันชำระเงิน"}
                                    </TextTheme>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                ) : (
                    <TextTheme>ไม่สามารถสร้าง QR Code ได้</TextTheme>
                )}
                <TouchableOpacity onPress={onClose} style={tw`mt-4 absolute top-0 right-3`}>
                    <Ionicons name="close-circle" size={30} color={tw.color('red-500')} />
                </TouchableOpacity>
            </View>

            {/* Full screen loading overlay */}
            {isConfirming && (
                <View style={tw`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center`}>
                    <Loading loading={true} size='large' color='white' />
                    <TextTheme style={tw`text-white mt-4`}>กำลังยืนยันการชำระเงิน...</TextTheme>
                </View>
            )}
        </View>
    );
};

export default PaymentQRCode;