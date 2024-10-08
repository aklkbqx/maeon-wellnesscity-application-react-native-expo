import { TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, Modal, ActivityIndicator, BackHandler } from 'react-native';
import React, { useState, useCallback } from 'react';
import { LogoMaeOn } from '@/components/SvgComponents';
import TextTheme from '@/components/TextTheme';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useStatusBar } from '@/hooks/useStatusBar';
import tw from "twrnc";
import { Ionicons } from '@expo/vector-icons';
import api from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';
import useShowToast from '@/hooks/useShowToast';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

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
    const { backToPage } = useLocalSearchParams<{ backToPage: any }>();
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
    const [loading, setLoading] = useState<boolean>(true);
    const [passwordVisibility, setPasswordVisibility] = useState<{ password: boolean; confirmPassword: boolean }>({ password: false, confirmPassword: false });
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const inputStyle = [tw`h-[50px] border-b border-slate-400 flex-1 text-blue-600 text-lg`, { fontFamily: "Prompt-Regular" }];

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
            const response = await api.post('/api/v1/auth/register', { firstname, lastname, tel, email: email.toLowerCase(), password });
            if (response.data.success) {
                if (backToPage) {
                    router.navigate({
                        pathname: "/optverify",
                        params: {
                            phone: tel,
                            backToPage
                        }
                    });
                } else {
                    router.navigate({
                        pathname: "/optverify",
                        params: { phone: tel }
                    });
                }

                useShowToast("success", "ลงทะเบียนสำเร็จ", "กรุณายืนยัน OTP ทางโทรศัพท์ของคุณ");
            } else {
                throw new Error(response.data.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
            }
        } catch (error) {
            handleErrorMessage("ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง");
            setModalVisible(false);
        } finally {
            setLoading(false);
            setModalVisible(false);
        }
    };

    const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
        setPasswordVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    };

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
        <View style={tw`flex-1 relative`}>
            <TouchableOpacity style={tw`absolute right-3 android:top-3 ios:top-3 mt-0 android:mt-4 z-10`} onPress={() => router.dismiss()}>
                <Ionicons name="close" size={35} style={tw`text-white`} />
            </TouchableOpacity>
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

            <LinearGradient
                style={tw`flex-1`}
                start={{
                    x: 0,
                    y: 0
                }}
                colors={[
                    String(tw.color("blue-900")),
                    String(tw.color("blue-700")),
                    String(tw.color("indigo-300")),
                ]}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <BlurView intensity={20} style={tw`flex-1 items-center justify-center`}>
                        <View style={tw`flex-row items-center gap-2`}>
                            <ActivityIndicator size="large" color={`${tw`text-blue-500`.color}`} />
                        </View>
                    </BlurView>
                </Modal>

                <View style={tw`android:pt-10 ios:pt-5 pb-5 px-5`}>
                    <View style={tw`flex-row gap-2`}>
                        <TextTheme font='Prompt-Bold' color='white' size='3xl'>ลงทะเบียน</TextTheme>
                    </View>
                    <View style={tw`flex-row gap-2`}>
                        <TextTheme font='Prompt-SemiBold' color='white' size='xl'>สร้างบัญชีของคุณ</TextTheme>
                    </View>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0} style={tw`flex-1`}>
                    <View style={tw`flex-1 bg-white rounded-t-[5]`}>
                        <ScrollView showsVerticalScrollIndicator={false} style={tw`p-5`}>

                            <View style={tw`justify-center flex-row`}>
                                <LogoMaeOn width={80} height={80} fill={String(tw.color("blue-500"))} style={tw`z-10`} />
                            </View>


                            <TextTheme style={tw`mt-2`} font='Prompt-SemiBold' color='blue-500'>ลงทะเบียน</TextTheme>
                            <View style={tw`flex-col gap-2`}>
                                <View style={[tw`flex-row gap-2 w-full`,]}>
                                    {(['firstname', 'lastname'] as const).map((field) => (
                                        <View key={field} style={[tw`flex-row`, { flex: 1 }]}>
                                            <TextInput
                                                style={[inputStyle, fieldValidation[field] && formErrors[field] ? tw`border-2 border-red-500` : {}]}
                                                placeholder={field === 'firstname' ? 'ชื่อ' : 'นามสกุล'}
                                                placeholderTextColor={"#71717a"}
                                                value={formData[field]}
                                                onChangeText={(text) => handleInputChange(field, text)}
                                                autoCapitalize="none"
                                            />
                                        </View>
                                    ))}
                                </View>
                                {(['tel', 'email', 'password', 'confirmPassword'] as const).map((field, index) => (
                                    <View key={`${field}-${index}`}>
                                        {fieldValidation[field] && formErrors[field] && (
                                            <TextTheme style={tw`text-red-500 text-sm`}>{formErrors[field]}</TextTheme>
                                        )}
                                        <View style={[tw`flex-row w-full`,]}>
                                            <TextInput
                                                style={[inputStyle, fieldValidation[field] && formErrors[field] ? tw`border-b border-red-500` : {}]}
                                                placeholder={field === 'tel' ? 'เบอร์โทรศัพท์' : field === 'email' ? 'อีเมล' : field === 'password' ? 'รหัสผ่าน' : 'ยืนยันรหัสผ่านอีกครั้ง'}
                                                placeholderTextColor={"#71717a"}
                                                value={formData[field]}
                                                onChangeText={(text) => handleInputChange(field, text)}
                                                autoCapitalize="none"
                                                secureTextEntry={(field === "password" || field === "confirmPassword") ? !passwordVisibility[field] : false}
                                                keyboardType={field === 'tel' ? 'numeric' : field === 'email' ? 'email-address' : 'default'}
                                                textContentType={'oneTimeCode'}
                                            />

                                            {fieldValidation["password"] && field === "password" || fieldValidation["confirmPassword"] && field === "confirmPassword" ? (
                                                <TouchableOpacity onPress={() => togglePasswordVisibility(field)} style={tw`absolute top-3 right-3 z-9 flex-row gap-2`}>
                                                    <Ionicons size={25} name={!passwordVisibility[field] ? "eye" : "eye-off"} style={tw`text-blue-600`} />
                                                </TouchableOpacity>
                                            ) : null}
                                        </View>
                                    </View>
                                ))}
                                <View style={[tw`flex-row w-full mt-2`]}>
                                    <TouchableOpacity
                                        style={[
                                            tw`w-full rounded-2xl flex-1 items-center justify-center`,
                                            (!isFormValid || loading) ? tw`opacity-80` : null
                                        ]}
                                        onPress={handleSubmitRegister}
                                        disabled={!isFormValid || loading}
                                    >
                                        <LinearGradient
                                            style={[
                                                tw` rounded-2xl items-center justify-center w-full py-2 ${(!isFormValid || loading) ? "opacity-70" : "border-2 border-blue-500"}`,
                                            ]}
                                            colors={[
                                                String(tw.color((!isFormValid || loading) ? "slate-200" : "slate-100")),
                                                String(tw.color((!isFormValid || loading) ? "slate-300" : "slate-200")),
                                            ]}>
                                            {loading ? <ActivityIndicator /> : (
                                                <TextTheme size={"xl"} color="blue-600" font="Prompt-Bold">
                                                    {loading ? 'กำลังโหลด..' : 'ลงทะเบียน'}
                                                </TextTheme>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                                <View style={tw`flex-col gap-2 items-center`}>
                                    <TextTheme children="ฉันมีบัญชีอยู่แล้ว?" color="slate-700" size='base' />
                                    <TouchableOpacity onPress={() => router.navigate("/login")}>
                                        <TextTheme children="เข้าสู่ระบบ" color="blue-600" style={[tw`underline`]} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
};

export default Register;