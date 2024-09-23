import { Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Dimensions, Alert, ScaledSize, Platform, ActivityIndicator, Modal, BackHandler } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LogoMaeOn } from '@/components/SvgComponents'
import TextTheme from '@/components/TextTheme'
import { router, useFocusEffect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AxiosError } from 'axios'
import { useStatusBar } from '@/hooks/useStatusBar';
import { BlurView } from 'expo-blur';
import tw from "twrnc"
import { Ionicons } from '@expo/vector-icons'
import useShowToast from '@/hooks/useShowToast'
import { api, handleApiError } from '@/helper/api'
import useRoleNavigation from '@/hooks/useRoleNavigation'
import { saveTokenAndLogin } from '@/helper/my-lib'

const Login = () => {
    useStatusBar(Platform.OS === "ios" ? "light-content" : "dark-content");
    const passwordInputRef = useRef<TextInput>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [dimensions, setDimensions] = useState<ScaledSize>(Dimensions.get('window'));
    const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setPasswordVisibility(prevState => !prevState);
    }

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions(window);
        });
        return () => subscription?.remove();
    }, []);

    useEffect(() => {
        if (email !== "") {
            validateForm();
        } else {
            setEmailError("");
        }
    }, [email, password]);

    const isIPad = dimensions.width >= 768;
    const containerSize = isIPad ? 750 : 550;
    const inputWidth = isIPad ? 500 : 300;
    const logoSize = isIPad ? 150 : 100;
    const fontSize = isIPad ? 20 : 18;

    const inputStyle = [tw`px-[20px] pl-10 h-[50px] web:h-[70px] w-full rounded-3xl border border-white bg-slate-200 flex-1 text-teal-600`, { fontFamily: "Prompt-Regular", fontSize }];

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;

        if (!email.trim()) {
            setEmailError('กรุณากรอกอีเมล');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError('รูปแบบอีเมลไม่ถูกต้อง');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password.trim()) {
            isValid = false;
        }

        setIsFormValid(isValid);
    };

    const handleSubmitLogin = async () => {
        if (!isFormValid) {
            useShowToast("error", "ข้อมูลไม่ถูกต้อง", "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
            return;
        }
        setModalVisible(true);
        setLoading(true);
        try {
            const response = await api.post("/api/v1/auth/login", {
                email: email,
                password: password
            });
            setTimeout(async () => {
                if (response.data.success) {
                    const { token } = response.data;
                    await saveTokenAndLogin(token);
                    const responseAuth = await api.get('/api/v1/users/me');
                    useRoleNavigation(responseAuth.data.role);
                    useShowToast("success", "สำเร็จ!", "เข้าสู่ระบบเรียบร้อยแล้ว 👋");
                } else {
                    throw new Error(response.data);
                }
            }, 1000);
        } catch (error) {
            handleApiError(error);
            setModalVisible(false);
            setLoading(false);
        } finally {
            setLoading(false);
            setModalVisible(false);
        }
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
        <View style={tw`flex-1`}>
            <TouchableOpacity style={tw`absolute left-2 android:top-2 ios:top-2 mt-0 android:mt-4 z-10`} onPress={() => router.dismiss()}>
                <Ionicons name="close-circle" size={35} style={tw`text-teal-600`} />
            </TouchableOpacity>
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

            <TouchableWithoutFeedback onPress={Platform.OS !== "web" ? Keyboard.dismiss : Keyboard.isVisible} accessible={false}>
                <View style={[tw`flex-1 justify-center items-center`]}>
                    <View style={[tw`justify-center rounded-full`,
                    { height: containerSize, width: containerSize }, tw`bg-teal-600`]}>
                        <View style={tw`items-center`}>
                            <LogoMaeOn width={logoSize} height={logoSize} fill={"#fff"} style={tw`z-10 mb-5`} />
                            <View style={tw`flex-col gap-3`}>

                                <View style={[tw`flex-col`, { width: inputWidth }]}>
                                    <View style={tw`flex-row relative`}>
                                        <View style={tw`absolute top-3 left-2 z-99`}>
                                            <Ionicons size={25} name={"mail"} style={tw`text-teal-600`} />
                                        </View>
                                        <TextInput
                                            style={[inputStyle, emailError ? tw`border-red-500` : {}]}
                                            placeholder="อีเมล"
                                            placeholderTextColor={"#71717a"}
                                            returnKeyType="next"
                                            onSubmitEditing={() => passwordInputRef.current?.focus()}
                                            blurOnSubmit={false}
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType='email-address'
                                        />
                                    </View>
                                    {emailError ? <TextTheme style={tw`text-red-500 text-sm mt-1`}>{emailError}</TextTheme> : null}
                                </View>
                                <View style={[tw`flex-row relative`, { width: inputWidth }]}>
                                    <View style={tw`absolute top-3 left-2 z-99`}>
                                        <Ionicons size={25} name={"lock-closed"} style={tw`text-teal-600`} />
                                    </View>
                                    <TextInput
                                        ref={passwordInputRef}
                                        style={[inputStyle]}
                                        placeholder="รหัสผ่าน"
                                        placeholderTextColor={"#71717a"}
                                        returnKeyType="done"
                                        secureTextEntry={!passwordVisibility}
                                        value={password}
                                        onChangeText={setPassword}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={togglePasswordVisibility} style={tw`absolute top-3 right-3 z-9 flex-row gap-2`}>
                                        <Ionicons size={25} name={!passwordVisibility ? "eye" : "eye-off"} style={tw`text-teal-600`} />
                                    </TouchableOpacity>
                                </View>

                                <View style={[tw`flex-row justify-end`, { width: inputWidth }]}>
                                    <TouchableOpacity onPress={() => router.navigate("/forgotPassword")}>
                                        <TextTheme children="ลืมรหัสผ่าน?" color='slate-200' style={[tw`underline`, { fontSize }]} />
                                    </TouchableOpacity>
                                </View>

                                <View style={[tw`flex-row`, { width: inputWidth }]}>
                                    <TouchableOpacity
                                        style={[
                                            tw`px-[20px] h-[${isIPad ? 60 : 50}px] bg-slate-200 w-full rounded-3xl border border-white flex-1 items-center justify-center`,
                                            { width: inputWidth },
                                            (!isFormValid || loading) ? tw`opacity-80` : null
                                        ]}
                                        onPress={handleSubmitLogin}
                                        disabled={!isFormValid || loading}
                                    >
                                        {loading ? <ActivityIndicator /> : (
                                            <TextTheme size={isIPad ? '2xl' : 'xl'} color={isFormValid ? 'teal-700' : 'gray-600'} font='Prompt-SemiBold' children={"เข้าสู่ระบบ"} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View style={tw`flex-col gap-2 items-center`}>
                                    <TextTheme children="ยังไม่มีบัญชีใช่หรือไม่?" color='slate-50' style={{ fontSize }} />
                                    <TouchableOpacity onPress={() => router.navigate("/(register)")}>
                                        <TextTheme children="สมัครมาชิก" font='Prompt-SemiBold' color='white' style={[tw`underline`, { fontSize }]} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback >
        </View>
    )
}

export default Login;