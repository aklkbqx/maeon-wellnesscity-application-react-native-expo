import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import tw from 'twrnc';
import TextTheme from '@/components/TextTheme';
import api from '@/helper/api';
import { handleAxiosError, handleErrorMessage } from '@/helper/my-lib';
import useShowToast from '@/hooks/useShowToast';
import { saveTokenAndLogin } from '@/helper/my-lib';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


const OTPInput: React.FC<{ onOtpChange: (otp: string) => void }> = ({ onOtpChange }) => {
    const [otp, setOtp] = useState<string>('');
    const inputRef = useRef<TextInput>(null);

    const handleOtpChange = (value: string) => {
        const newOtp = value.replace(/[^0-9]/g, '').slice(0, 6);
        setOtp(newOtp);
        onOtpChange(newOtp);
    };

    const handlePress = () => {
        inputRef.current?.focus();
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={1} style={tw`flex-1`}>
            <View style={tw`flex-row justify-between mb-6`}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                    <View key={index} style={tw`w-12 h-12 border-2 border-gray-300 rounded-lg justify-center items-center`}>
                        <TextTheme size="xl">{otp[index] || ''}</TextTheme>
                    </View>
                ))}
            </View>
            <TextInput
                ref={inputRef}
                value={otp}
                onChangeText={handleOtpChange}
                keyboardType="number-pad"
                style={tw`absolute opacity-0 h-12 w-full`}
                maxLength={6}
                cursorColor={"#fff"}
            />
        </TouchableOpacity>
    );
};


const OTPVerification: React.FC = () => {
    const { phone, backToPage } = useLocalSearchParams<{ phone: string; backToPage: any }>();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [loading, setLoading] = useState<boolean>(false);
    const inputRefs = useRef<TextInput[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleOtpChange = (newOtp: string) => {
        setOtp(newOtp.split(''));
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        setModalVisible(true);
        const otpString = otp.join('');
        try {
            const response = await api.post('/api/v1/auth/verify-otp', { phone, otp: otpString });
            if (response.data.success) {
                const { token } = response.data;
                await saveTokenAndLogin(token);
                useShowToast("success", "สำเร็จ!", "ยืนยัน OTP เรียบร้อยแล้ว");
                setTimeout(() => {
                    if (backToPage) {
                        router.navigate(backToPage as any);
                    } else {
                        router.replace("/(home)");
                    }
                    useShowToast("success", "สำเร็จ!", "เข้าสู่ระบบสำเร็จแล้ว");
                }, 1500)
            } else {
                throw new Error(response.data.error || 'เกิดข้อผิดพลาดในการยืนยัน OTP');
            }
        } catch (error) {
            handleAxiosError(error, (message) => {
                handleErrorMessage(message);
            });
            setModalVisible(false);
        } finally {
            setLoading(false);
            setModalVisible(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            await api.post('/api/v1/auth/resend-otp', { phone });
            useShowToast("success", "ส่ง OTP ใหม่แล้ว", "กรุณาตรวจสอบ SMS ของคุณ");
        } catch (error) {
            handleAxiosError(error, (message) => {
                handleErrorMessage(message);
            });
        }
    };

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <BlurView intensity={20} style={tw`flex-1 items-center justify-center`}>
                    <View style={tw`flex-row items-center gap-2`}>
                        <ActivityIndicator size="large" color={`${tw`text-blue-600`.color}`} />
                    </View>
                </BlurView>
            </Modal>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1`}
            >
                <LinearGradient style={tw`flex-1`} colors={[String(tw.color("blue-500")), String(tw.color("blue-600"))]}>

                    <ScrollView contentContainerStyle={tw`flex-grow justify-center items-center p-4`}>
                        <View style={tw`bg-white p-6 rounded-2xl w-full max-w-sm`}>
                            <TextTheme size="2xl" font="Prompt-Bold" style={tw`text-center mb-4`}>
                                ยืนยัน OTP
                            </TextTheme>
                            <TextTheme style={tw`text-center mb-6`}>
                                กรุณากรอกรหัส OTP ที่ส่ง SMS ไปยังเบอร์ {phone}
                            </TextTheme>
                            <View style={tw`flex-row justify-between`}>
                                <OTPInput onOtpChange={handleOtpChange} />
                            </View>
                            <TouchableOpacity
                                onPress={handleVerifyOTP}
                                disabled={loading || otp.some(digit => !digit)}
                                style={tw`bg-blue-600 py-3 rounded-xl ${(loading || otp.some(digit => !digit)) ? 'opacity-50' : ''}`}
                            >
                                <TextTheme color="white" size="lg" font="Prompt-SemiBold" style={tw`text-center`}>
                                    {loading ? 'กำลังตรวจสอบ...' : 'ยืนยัน OTP'}
                                </TextTheme>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleResendOTP} style={tw`mt-4`}>
                                <TextTheme color="blue-600" style={tw`text-center`}>
                                    ส่ง OTP อีกครั้ง
                                </TextTheme>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.back()} style={tw`flex-row mt-2 justify-center items-center`}>
                                <Ionicons name='chevron-back' size={20} color={`${tw`text-blue-600`.color}`} />
                                <TextTheme color="blue-600">
                                    ย้อนกลับ
                                </TextTheme>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </LinearGradient>
            </KeyboardAvoidingView>
        </>
    );
};

export default OTPVerification;