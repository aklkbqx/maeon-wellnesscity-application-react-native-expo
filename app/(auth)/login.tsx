import { Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Dimensions, Alert, ScaledSize, Platform, ActivityIndicator, Modal, BackHandler } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LogoMaeOn } from '@/components/SvgComponents'
import TextTheme from '@/components/TextTheme'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useStatusBar } from '@/hooks/useStatusBar';
import { BlurView } from 'expo-blur';
import tw from "twrnc"
import { Ionicons } from '@expo/vector-icons'
import useShowToast from '@/hooks/useShowToast'
import api from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';
import useRoleNavigation from '@/hooks/useRoleNavigation'
import { saveTokenAndLogin } from '@/helper/my-lib'
import { LinearGradient } from 'expo-linear-gradient'

const Login = () => {
    useStatusBar(Platform.OS === "ios" ? "light-content" : "light-content");
    const { backToPage } = useLocalSearchParams();
    const passwordInputRef = useRef<TextInput>(null);
    const [loading, setLoading] = useState<boolean>(true);
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
        if (email !== "") {
            validateForm();
        } else {
            setEmailError("");
        }
    }, [email, password]);

    const inputStyle = [tw`h-[50px] pl-10 border-b border-slate-400 flex-1 text-blue-600 text-lg`, { fontFamily: "Prompt-Regular" }];

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
                email: email.toLowerCase(),
                password: password
            });
            setTimeout(async () => {
                if (response.data.success) {
                    const { token } = response.data;
                    await saveTokenAndLogin(token);
                    const responseAuth = await api.get('/api/v1/users/me');
                    if (backToPage) {
                        router.navigate(backToPage as any);
                    } else {
                        useRoleNavigation(responseAuth.data.role);
                    }
                    useShowToast("success", "สำเร็จ!", "เข้าสู่ระบบเรียบร้อยแล้ว 👋");
                } else {
                    throw new Error(response.data);
                }
            }, 1000);
        } catch (error) {
            handleErrorMessage("ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง");
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
        }, [backToPage])
    );

    const handleToRegister = () => {
        if (backToPage) {
            router.navigate({
                pathname: "/(register)",
                params: { backToPage }
            })
        } else {
            router.navigate("/(register)")
        }
    }


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
                        <ActivityIndicator size="large" color={`${tw`text-blue-500`.color}`} />
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
                    String(tw.color("blue-500")),
                    String(tw.color("indigo-300")),
                ]}>
                <View style={tw`android:pt-10 ios:pt-5 pb-5 px-5`}>
                    <View style={tw`flex-row gap-2`}>
                        <TextTheme font='Prompt-Bold' color='white' size='3xl'>สวัสดี</TextTheme>
                        <TextTheme font='Prompt-Bold' color='white' size='3xl'>👋🏻</TextTheme>
                    </View>
                    <View style={tw`flex-row gap-2`}>
                        <Ionicons name='lock-closed' size={25} color={"white"} />
                        <TextTheme font='Prompt-SemiBold' color='white' size='xl'>เข้าสู่ระบบของคุณ</TextTheme>
                    </View>
                </View>

                <TouchableWithoutFeedback onPress={Platform.OS !== "web" ? Keyboard.dismiss : Keyboard.isVisible} accessible={false}>
                    <View style={tw`flex-1 bg-white rounded-t-[5] p-5`}>

                        <View style={tw`justify-center flex-row`}>
                            <LogoMaeOn width={80} height={80} fill={String(tw.color("blue-500"))} style={tw`z-10`} />
                        </View>

                        <View style={tw``}>
                            <TextTheme style={tw`mt-2`} font='Prompt-SemiBold' color='blue-500'>เข้าสู่ระบบ</TextTheme>
                            <View style={tw`flex-col gap-3`}>
                                <View style={[tw`flex-col`]}>
                                    <View style={tw`flex-row relative w-full`}>
                                        <View style={tw`absolute top-3 left-2 z-99`}>
                                            <Ionicons size={25} name={"mail"} style={tw`text-blue-500`} />
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
                                <View style={[tw`flex-row relative w-full`]}>
                                    <View style={tw`absolute top-3 left-2 z-99`}>
                                        <Ionicons size={25} name={"lock-closed"} style={tw`text-blue-500`} />
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
                                    {password ? (
                                        <TouchableOpacity onPress={togglePasswordVisibility} style={tw`absolute top-3 right-3 z-9 flex-row gap-2`}>
                                            <Ionicons size={25} name={!passwordVisibility ? "eye" : "eye-off"} style={tw`text-blue-500`} />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>

                                <View style={[tw`flex-row justify-end w-full`]}>
                                    <TouchableOpacity onPress={() => router.navigate("/forgotPassword")}>
                                        <TextTheme children="ลืมรหัสผ่าน?" color='blue-500' style={[tw`underline`]} />
                                    </TouchableOpacity>
                                </View>

                                <View style={[tw`flex-row w-full`]}>
                                    <TouchableOpacity
                                        style={[
                                            tw`w-full rounded-2xl flex-1 items-center justify-center`,
                                            (!isFormValid || loading) ? tw`opacity-80` : null
                                        ]}
                                        onPress={handleSubmitLogin}
                                        disabled={!isFormValid || loading}
                                    >
                                        <LinearGradient
                                            style={[
                                                tw` rounded-2xl items-center justify-center w-full py-2`,
                                                (!isFormValid || loading) ? tw`opacity-70` : null
                                            ]}
                                            colors={[
                                                String(tw.color((!isFormValid || loading) ? "slate-200" : "blue-300")),
                                                String(tw.color((!isFormValid || loading) ? "slate-300" : "blue-500")),
                                            ]}>
                                            {loading ? <ActivityIndicator size={"large"} /> : (
                                                // <TextTheme size={isIPad ? '2xl' : 'xl'} color={isFormValid ? 'white' : 'white'} font='Prompt-SemiBold' children={"เข้าสู่ระบบ"} />
                                                <TextTheme size={"xl"} color={(!isFormValid || loading) ? "blue-400" : "white"} font="Prompt-SemiBold">
                                                    {loading ? 'กำลังโหลด..' : 'เข้าสู่ระบบ'}
                                                </TextTheme>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>

                                <View style={tw`flex-col gap-2 items-center mt-5`}>
                                    <TextTheme children="ยังไม่มีบัญชีใช่หรือไม่?" color='slate-700' />
                                    <TouchableOpacity onPress={handleToRegister}>
                                        <TextTheme children="ลงทะเบียน" font='Prompt-SemiBold' color='blue-600' style={[tw`underline`]} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </LinearGradient>
        </View>
    )
}

export default Login;