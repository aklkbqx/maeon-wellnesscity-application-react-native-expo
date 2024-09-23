import { TextInput, TouchableOpacity, View, Dimensions, KeyboardAvoidingView, Platform, ScaledSize, ScrollView, Modal, ActivityIndicator, BackHandler } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { LogoMaeOn } from '@/components/SvgComponents';
import TextTheme from '@/components/TextTheme';
import { router, useFocusEffect } from 'expo-router';
import { useStatusBar } from '@/hooks/useStatusBar';
import tw from "twrnc";
import { Ionicons } from '@expo/vector-icons';
import { api, handleApiError } from '@/helper/api';
import useShowToast from '@/hooks/useShowToast';
import { BlurView } from 'expo-blur';

interface FormData {
    firstname: string;
    lastname: string;
    tel: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    firstname?: string;
    lastname?: string;
    tel?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

interface FieldValidation {
    firstname: boolean;
    lastname: boolean;
    tel: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
}

const Register: React.FC = () => {
    useStatusBar("light-content");
    const [formData, setFormData] = useState<FormData>({ firstname: '', lastname: '', tel: '', email: '', password: '', confirmPassword: '' });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [fieldValidation, setFieldValidation] = useState<FieldValidation>({
        firstname: false,
        lastname: false,
        tel: false,
        email: false,
        password: false,
        confirmPassword: false
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [dimensions, setDimensions] = useState<ScaledSize>(Dimensions.get('window'));
    const [passwordVisibility, setPasswordVisibility] = useState<{ password: boolean; confirmPassword: boolean }>({ password: false, confirmPassword: false });
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => setDimensions(window));
        return () => subscription?.remove();
    }, []);

    const isIPad = dimensions.width >= 768;
    const containerSize = isIPad ? 900 : 650;
    const inputWidth = isIPad ? 500 : 300;
    const logoSize = isIPad ? 150 : 80;
    const fontSize = isIPad ? 20 : 18;

    const inputStyle = [
        tw`px-[20px] h-[${isIPad ? 70 : 50}px] w-full rounded-3xl border-0 bg-slate-200 flex-1`,
        { fontFamily: 'Prompt-Regular', fontSize }
    ];

    const validateField = useCallback((field: keyof FormData, value: string) => {
        const errors: FormErrors = { ...formErrors };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        switch (field) {
            case 'firstname':
            case 'lastname':
                if (!value.trim()) errors[field] = `กรุณากรอก${field === 'firstname' ? 'ชื่อ' : 'นามสกุล'}`;
                else delete errors[field];
                break;
            case 'tel':
                if (!value.trim()) errors.tel = 'กรุณากรอกเบอร์โทรศัพท์';
                else if (!phoneRegex.test(value)) errors.tel = 'เบอร์โทรศัพท์ไม่ถูกต้อง';
                else delete errors.tel;
                break;
            case 'email':
                if (!value.trim()) errors.email = 'กรุณากรอกอีเมล';
                else if (!emailRegex.test(value)) errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
                else delete errors.email;
                break;
            case 'password':
                if (value.length < 6) errors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
                else delete errors.password;
                if (formData.confirmPassword && value !== formData.confirmPassword) {
                    errors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
                } else {
                    delete errors.confirmPassword;
                }
                break;
            case 'confirmPassword':
                if (value !== formData.password) errors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
                else delete errors.confirmPassword;
                break;
        }

        setFormErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0 && Object.values(formData).every(val => val.trim() !== ''));
    }, [formData, formErrors]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setFieldValidation(prev => ({ ...prev, [field]: value.trim() !== '' }));
        if (value.trim() !== '') {
            validateField(field, value);
        } else {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmitRegister = async () => {
        if (!isFormValid) {
            useShowToast("error", "ข้อมูลไม่ถูกต้อง", "กรุณาตรวจสอบข้อมูลให้ถูกต้องครบถ้วน");
            return;
        }
        setModalVisible(true);
        setLoading(true);
        const { firstname, lastname, tel, email, password } = formData;
        try {
            const response = await api.post('/api/v1/auth/register', { firstname, lastname, tel, email, password });
            if (response.data.success) {
                router.push({
                    pathname: "/optverify",
                    params: { phone: tel }
                });
                useShowToast("success", "ลงทะเบียนสำเร็จ", "กรุณายืนยัน OTP ทางโทรศัพท์ของคุณ");
            } else {
                throw new Error(response.data.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
            }
        } catch (error) {
            handleApiError(error);
            setModalVisible(false);
        } finally {
            setLoading(false);
            setModalVisible(false);
        }
    };

    const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
        setPasswordVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const [isScrollEnabled, setIsScrollEnabled] = useState<boolean>(false);

    const handleFocus = () => setIsScrollEnabled(true);
    const handleBlur = () => setIsScrollEnabled(false);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                router.back();
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

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
                        <ActivityIndicator size="large" color={`${tw`text-teal-600`.color}`} />
                    </View>
                </BlurView>
            </Modal>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw`flex-1 bg-teal-600 items-center justify-center flex-row`} keyboardVerticalOffset={0}>
                <TouchableOpacity style={tw`absolute left-2 android:top-2 ios:top-2 mt-0 android:mt-4 z-10`} onPress={() => router.dismiss()}>
                    <Ionicons name="close-circle" size={35} style={tw`text-white`} />
                </TouchableOpacity>

                <ScrollView scrollEnabled={isScrollEnabled} showsVerticalScrollIndicator={false}>
                    <View style={tw`flex-row justify-center`}>
                        <View style={[tw`flex-row items-center justify-center rounded-full bg-white my-2`, { width: containerSize, height: containerSize }]}>
                            <View style={tw`items-center`}>
                                <LogoMaeOn width={logoSize} height={logoSize} fill={`${tw`text-teal-600`.color}`} style={tw`z-10 mb-5`} />
                                <View style={tw`flex-col gap-5`}>
                                    <View style={[tw`flex-row gap-2`, { width: inputWidth }]}>
                                        {(['firstname', 'lastname'] as const).map((field) => (
                                            <View key={field} style={[tw`flex-row`, { flex: 1 }]}>
                                                <TextInput
                                                    style={[inputStyle, fieldValidation[field] && formErrors[field] ? tw`border-2 border-red-500` : {}]}
                                                    placeholder={field === 'firstname' ? 'ชื่อ' : 'นามสกุล'}
                                                    placeholderTextColor={"#71717a"}
                                                    value={formData[field]}
                                                    onChangeText={(text) => handleInputChange(field, text)}
                                                    autoCapitalize="none"
                                                    onFocus={handleFocus}
                                                    onBlur={handleBlur}
                                                />
                                            </View>
                                        ))}
                                    </View>
                                    {(['tel', 'email', 'password', 'confirmPassword'] as const).map((field, index) => (
                                        <View key={`${field}-${index}`}>
                                            {fieldValidation[field] && formErrors[field] && (
                                                <TextTheme style={tw`text-red-500 text-sm`}>{formErrors[field]}</TextTheme>
                                            )}
                                            <View style={[tw`flex-row`, { width: inputWidth }]}>
                                                <TextInput
                                                    style={[inputStyle, fieldValidation[field] && formErrors[field] ? tw`border-2 border-red-500` : {}]}
                                                    placeholder={field === 'tel' ? 'เบอร์โทรศัพท์' : field === 'email' ? 'อีเมล' : field === 'password' ? 'รหัสผ่าน' : 'ยืนยันรหัสผ่านอีกครั้ง'}
                                                    placeholderTextColor={"#71717a"}
                                                    value={formData[field]}
                                                    onChangeText={(text) => handleInputChange(field, text)}
                                                    autoCapitalize="none"
                                                    secureTextEntry={(field === "password" || field === "confirmPassword") ? !passwordVisibility[field] : false}
                                                    keyboardType={field === 'tel' ? 'numeric' : field === 'email' ? 'email-address' : 'default'}
                                                    textContentType={'oneTimeCode'}
                                                    onFocus={handleFocus}
                                                    onBlur={handleBlur}
                                                />

                                                {(field === "password" || field === "confirmPassword") && (
                                                    <TouchableOpacity onPress={() => togglePasswordVisibility(field)} style={tw`absolute top-3 right-3 z-9 flex-row gap-2`}>
                                                        <Ionicons size={25} name={!passwordVisibility[field] ? "eye" : "eye-off"} style={tw`text-teal-600`} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    ))}
                                    <View style={[tw`flex-row`, { width: inputWidth }]}>
                                        <TouchableOpacity
                                            onPress={handleSubmitRegister}
                                            disabled={loading || !isFormValid}
                                            style={[
                                                tw`px-[20px] h-[${isIPad ? 60 : 50}px] w-full rounded-3xl border-2 border-teal-600 bg-slate-200 flex-1 items-center justify-center`,
                                                { width: inputWidth },
                                                (!isFormValid || loading) ? tw`opacity-80` : null
                                            ]}
                                        >
                                            <TextTheme size={isIPad ? '3xl' : '2xl'} color="teal-600" font="Prompt-SemiBold">
                                                {loading ? 'กำลังโหลด..' : 'ลงทะเบียน'}
                                            </TextTheme>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={tw`flex-col gap-2 items-center`}>
                                        <TextTheme children="ฉันมีบัญชีอยู่แล้ว?" color="black" style={{ fontSize }} />
                                        <TouchableOpacity onPress={() => router.navigate("/login")}>
                                            <TextTheme children="เข้าสู่ระบบ" color="teal-600" style={[tw`underline`, { fontSize }]} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

export default Register;