import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, RefreshControl } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import tw from "twrnc";
import TextTheme from '@/components/TextTheme';
import { resizeImage } from '@/helper/my-lib';
import { useStatusBar } from '@/hooks/useStatusBar';
import useUser from '@/hooks/useUser';
import api from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';
import useShowToast from '@/hooks/useShowToast';
import ProfileSection from '@/components/edit-account/ProfileSection';
import UserInfoSection from '@/components/edit-account/UserInfoSection';
import ActionButtons from '@/components/edit-account/ActionButtons';
import OverlayComponents from '@/components/edit-account/OverlayComponents';
import { USER_TYPE } from '@/types/userType';
import { FormDataInput } from '@/types/types';
import Loading from '@/components/Loading';

interface PreparedImage {
    uri: string;
    type: string;
    name: string;
};

const AccountSetting: React.FC = () => {
    useStatusBar("dark-content");
    const scrollViewRef = useRef<ScrollView>(null);
    const [prepareProfileImage, setPrepareProfileImage] = useState<PreparedImage | null>(null);
    const [formDataInput, setFormDataInput] = useState<FormDataInput>({
        firstname: "", lastname: "", tel: "", currentPassword: "", newPassword: "", confirmPassword: ""
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState({
        currentPassword: false, newPassword: false, confirmPassword: false
    });
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    // User & Profile
    const { checkLoginStatus, fetchUserData } = useUser();
    const [userData, setUserData] = useState<USER_TYPE | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    const fetchUserProfile = useCallback(async (profile: string) => {
        try {
            const res = await api.get(`/images/user_images/${profile}`);
            setProfileImageUrl(res.request.responseURL);
        } catch {
            handleErrorMessage("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้");
            setProfileImageUrl(null);
        }
    }, []);

    const initializeUserData = useCallback(async () => {
        setLoading(true)
        const { login } = await checkLoginStatus();
        if (login) {
            await fetchUserData(setUserData);
        }
        setLoading(false)
    }, [])

    useFocusEffect(useCallback(() => {
        initializeUserData();
    }, [initializeUserData]));

    const setDefaultUserData = useCallback((user: USER_TYPE) => {
        setFormDataInput({
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            tel: user.tel || '',
            currentPassword: '', newPassword: '', confirmPassword: ''
        });
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (userData && !profileImageUrl) {
                await fetchUserProfile(userData.profile_picture);
            }
        };
        fetchProfile();
        if (userData) {
            setDefaultUserData(userData)
        }
    }, [userData, profileImageUrl]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await initializeUserData();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        setPasswordsMatch(formDataInput.newPassword === formDataInput.confirmPassword);
    }, [formDataInput.newPassword, formDataInput.confirmPassword]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const resizedImage = await resizeImage(result.assets[0].uri, 256, 256);
            await prepareImageForUpload(resizedImage.uri);
            setProfileImageUrl(resizedImage.uri);
        }
    };

    const prepareImageForUpload = async (uri: string) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error("File does not exist");
            }
            const fileName = `profileImage_${Date.now()}.jpg`;
            const preparedImage = {
                uri: fileInfo.uri,
                type: 'image/jpeg',
                name: fileName,
            };
            setPrepareProfileImage(preparedImage as any);
        } catch (error) {
            console.error("Error preparing image:", error);
            useShowToast("error", "เกิดข้อผิดพลาด", "ไม่สามารถเตรียมรูปภาพได้");
        }
    };

    const handleSaveProfile = async () => {
        if (formDataInput.newPassword !== formDataInput.confirmPassword) {
            useShowToast("error", "เกิดข้อผิดพลาด", "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน!");
            return;
        }

        setTimeout(() => scrollViewRef.current?.scrollTo({ y: 0, animated: true }), 500);

        const formData = new FormData();
        formData.append('firstname', formDataInput.firstname);
        formData.append('lastname', formDataInput.lastname);
        formData.append('tel', formDataInput.tel);

        if (userData?.email) {
            formData.append('email', userData.email);
        }
        if (prepareProfileImage) {
            formData.append('profile_picture', prepareProfileImage as any);
        }

        if (formDataInput.currentPassword && formDataInput.newPassword) {
            formData.append('currentPassword', formDataInput.currentPassword);
            formData.append('newPassword', formDataInput.newPassword);
        }

        try {
            const response = await api.put("/api/v1/users/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.data.success) {
                setModalVisible(true);

                if (response.data.user) {
                    await fetchUserData(setUserData);
                }

                if (prepareProfileImage) {
                    setProfileImageUrl(prepareProfileImage.uri);
                }

                setPrepareProfileImage(null);

                setFormDataInput(prev => ({
                    ...prev,
                    firstname: response.data.user.firstname || prev.firstname,
                    lastname: response.data.user.lastname || prev.lastname,
                    tel: response.data.user.tel || prev.tel,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));

                setTimeout(() => {
                    setModalVisible(false);
                    useShowToast("success", "บันทึกแล้ว", response.data.message);
                }, 500);
            } else {
                useShowToast("error", "เกิดข้อผิดพลาด", response.data.message);
            }
        } catch (error) {
            handleErrorMessage("ไม่สามารถโหลดข้อมูลโปรไฟล์ของคุณได้");
        }
    };

    const handleCancel = async () => {
        setModalVisible(true);
        setTimeout(() => scrollViewRef.current?.scrollTo({ y: 0, animated: true }), 500);
        setLoadingCancel(true);
        setProfileImageUrl(null);
        setPrepareProfileImage(null);
        await initializeUserData();
        if (userData) {
            setDefaultUserData(userData);
        }
        setLoadingCancel(false);
        setModalVisible(false)
    };

    const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
        setPasswordVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChangeText = (field: keyof FormDataInput, text: string) => {
        setFormDataInput(prev => ({ ...prev, [field]: text }));
    };

    const getInputStyle = (field: 'newPassword' | 'confirmPassword') => {
        let baseStyle = "p-3 px-5 bg-slate-100 text-left";
        if ((field === 'newPassword' || field === 'confirmPassword') && !passwordsMatch) {
            baseStyle += " border-2 border-red-300 rounded-xl";
        }
        return tw`${baseStyle}`;
    };

    const [showLoading, setShowLoading] = useState(false);
    useEffect(() => {
        let timer: any;
        if (loading) {
            timer = setTimeout(() => {
                setShowLoading(true);
            }, 1000);
        } else {
            setShowLoading(false);
        }

        return () => clearTimeout(timer);
    }, [loading, 1000]);


    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Loading loading={loading} />
            </View>
        )
    } else {
        return (
            <>
                {/* {loading ? <Loading loading={loading} type='full' /> : null} */}
                <KeyboardAvoidingView behavior="padding" style={tw`bg-white flex-1`} keyboardVerticalOffset={85}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        ref={scrollViewRef}
                        style={tw`px-5`}
                        scrollEventThrottle={16}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[tw.color("text-blue-600") as string]}
                                tintColor={tw.color("text-blue-600") as string}
                            />
                        }
                    >
                        <ProfileSection profileImageUrl={profileImageUrl} pickImage={pickImage} userData={userData} />
                        <UserInfoSection formDataInput={formDataInput} setFormDataInput={setFormDataInput} userData={userData} />
                        <View style={tw`mt-2`}>
                            <View style={tw`flex-row gap-2`}>
                                <Ionicons name='lock-closed' size={20} />
                                <TextTheme font='Prompt-SemiBold' size='xl'>เปลี่ยนรหัสผ่าน</TextTheme>
                            </View>
                            <View style={tw`overflow-hidden rounded-2xl gap-1 mt-2`}>
                                {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field, index) => (
                                    <View key={`${field}-${index}`} style={tw`relative`}>
                                        <TextInput
                                            style={[getInputStyle(field as 'newPassword' | 'confirmPassword'), { fontFamily: "Prompt-Regular" }]}
                                            placeholder={field === 'currentPassword' ? 'รหัสผ่านเดิม' : (field === 'newPassword' ? 'รหัสผ่านใหม่' : 'ยืนยันรหัสผ่านอีกครั้ง')}
                                            placeholderTextColor="#a1a1aa"
                                            value={formDataInput[field]}
                                            onChangeText={(text) => handleChangeText(field, text)}
                                            autoCapitalize="none"
                                            secureTextEntry={!passwordVisibility[field]}
                                            textContentType='oneTimeCode'
                                        />
                                        {formDataInput[field] && (
                                            <TouchableOpacity onPress={() => togglePasswordVisibility(field)} style={tw`absolute top-3 right-3 z-9 flex-row gap-2`}>
                                                <Ionicons size={25} name={!passwordVisibility[field] ? "eye" : "eye-off"} style={tw`text-blue-700`} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                                {!passwordsMatch && (
                                    <View style={tw`mt-1 ml-1`}>
                                        <TextTheme style={tw`text-red-500 text-sm`}>รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน</TextTheme>
                                    </View>
                                )}
                            </View>
                        </View>
                        <ActionButtons
                            handleCancel={handleCancel}
                            handleSaveProfile={handleSaveProfile}
                            loadingCancel={loadingCancel}
                            modalVisible={modalVisible}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
                <OverlayComponents refreshing={refreshing} modalVisible={modalVisible} setModalVisible={setModalVisible} />
            </>
        );
    }
};

export default AccountSetting;