import { TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { router, Stack, useFocusEffect, useNavigation } from 'expo-router'
import TextTheme from '@/components/TextTheme'
import tw from "twrnc"
import { Ionicons } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { formatEmail } from '@/helper/my-lib'
import api from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';
import { Avatar, View } from 'react-native-ui-lib'
import { useStatusBar } from '@/hooks/useStatusBar'
import useUser from '@/hooks/useUser'
import { BlurView } from 'expo-blur'
import { USER_TYPE } from '@/types/userType'
import Loading from '@/components/Loading'

const SkeletonLoader: React.FC<{ width: number; height: number; borderRadius: number }> = ({ width, height, borderRadius }) => {
    return (
        <Animatable.View animation={"flash"} iterationCount="infinite" duration={5000}>
            <View style={[tw`bg-slate-100`, { width, height, borderRadius }]} />
        </Animatable.View>
    )
}

const RootHome = () => {
    useStatusBar("dark-content");

    // State
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const { checkLoginStatus, fetchUserData } = useUser();
    const [userData, setUserData] = useState<USER_TYPE | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    // Refs
    const profileImage = useRef("");

    const toggleView = useCallback(() => {
        router.navigate(!showCalendar ? "/selectdatatime" : "/");
        setShowCalendar((prev) => !prev)
    }, [showCalendar])

    const fetchUserProfile = useCallback(async (profile: string) => {
        try {
            const res = await api.get(`/images/user_images/${profile}`);
            setProfileImageUrl(res.request.responseURL);
            profileImage.current = profile
        } catch {
            handleErrorMessage("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้");
            setProfileImageUrl(null);
        }
    }, []);

    const initializeUserData = useCallback(async () => {
        setLoading(true);
        const { login } = await checkLoginStatus();
        if (login) {
            await fetchUserData(setUserData);
        }
        setLoading(false);
    }, [checkLoginStatus, fetchUserData]);

    useFocusEffect(
        useCallback(() => {
            initializeUserData();
        }, [initializeUserData])
    );

    useEffect(() => {
        if (userData && (profileImage.current !== userData.profile_picture)) {
            fetchUserProfile(userData.profile_picture);
        }
    }, [userData])

    const renderContent = () => {
        if (loading) {
            return (
                <View style={tw`flex-row items-center gap-3`}>
                    <SkeletonLoader width={68} height={68} borderRadius={50} />
                    <View style={tw`flex-col gap-2`}>
                        <SkeletonLoader width={100} height={12} borderRadius={5} />
                        <SkeletonLoader width={128} height={10} borderRadius={5} />
                        <SkeletonLoader width={115} height={10} borderRadius={5} />
                    </View>
                </View>
            )
        }

        return (
            <View style={tw`flex-row items-center gap-3`}>
                <View style={tw` h-17 w-17 rounded-full bg-slate-200 justify-center items-center`}>
                    {userData && profileImageUrl ? (
                        <Avatar
                            size={63}
                            badgePosition='BOTTOM_RIGHT'
                            badgeProps={{ backgroundColor: String(tw`text-green-500`.color), size: 15, borderWidth: 1, borderColor: "white" }}
                            source={{ uri: profileImageUrl }}
                        />
                    ) : (
                        <Avatar
                            size={63}
                            source={require("@/assets/images/default-profile.jpg")}
                        />)
                    }
                </View>
                <View style={tw`flex-col`}>
                    <TextTheme size='sm' font='Prompt-Bold' color='slate-900'>ยินดีต้อนรับ</TextTheme>
                    {userData ? (
                        <View style={tw`flex-col`}>
                            <TextTheme font='Prompt-SemiBold' size='sm' color='slate-600' style={tw.style("w-[220px]")} >
                                {userData?.firstname} {userData?.lastname}
                            </TextTheme>
                            <TextTheme size='xs' color='zinc-600'>
                                {formatEmail(String(userData?.email))}
                            </TextTheme>
                        </View>
                    ) : (
                        <View style={tw`flex-row gap-2`}>
                            <TouchableOpacity onPress={() => router.navigate("/register")}>
                                <LinearGradient style={tw`p-1 px-2 rounded-xl`} colors={[String(tw.color("white")), String(tw.color("slate-200"))]}>
                                    <TextTheme size='base' color='slate-700'>
                                        ลงทะเบียน
                                    </TextTheme>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.navigate("/login")}>
                                <LinearGradient style={tw`p-1 px-2 rounded-xl`} colors={[String(tw.color("blue-400")), String(tw.color("blue-500"))]}>
                                    <TextTheme size='base' color='white'>
                                        เข้าสู่ระบบ
                                    </TextTheme>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        )
    }

    return (
        <Stack screenOptions={{
            headerTitleStyle: [tw`text-lg`, { fontFamily: "Prompt-SemiBold" }],
            headerTitleAlign: "center",
            animation: "fade",
        }}
        >
            <Stack.Screen name='(index)' options={{
                header: () => (
                    <View style={[tw`ios:bg-slate-200`]}>
                        <Animatable.View animation={"fadeInDown"}
                            iterationCount={1}
                            direction="normal"
                            duration={1000}
                            style={[tw`relative android:pt-11 ios:pt-13`]}>

                            <LinearGradient
                                start={{ x: 0.4, y: 0.2 }}
                                colors={[
                                    String(tw.color("blue-50")),
                                    String(tw.color("white")),
                                    String(tw.color("blue-50")),
                                ]}
                                style={[tw`ios:h-[135px] android:h-[130px] top-0 left-0 w-full absolute rounded-b-2xl ios:shadow-lg android:shadow-sm`]}
                            >
                            </LinearGradient>

                            <View style={tw`px-5 pb-5`}>
                                {renderContent()}
                                <TouchableOpacity onPress={() => router.navigate("/search")} style={tw`bg-white absolute flex-row items-center top-0 right-5 rounded-xl p-1.5 shadow`}>
                                    <Ionicons size={24} name='search' style={tw`text-black`} />
                                </TouchableOpacity>
                            </View>

                            <Animatable.View
                                animation={showCalendar ? "fadeInRightBig" : "pulse"}
                                iterationCount={showCalendar ? 1 : "infinite"}
                                direction="normal"
                                duration={showCalendar ? 1000 : 3000}
                                style={[tw`absolute top-30 ios:top-32 right-[-25px]`]}
                            >
                                <TouchableOpacity onPress={toggleView} style={tw`ios:shadow-md android:shadow-sm rounded-l-3xl border border-slate-200`}>
                                    {!showCalendar ? (
                                        <View style={tw`relative z-999`}>
                                            <View style={tw`absolute z-999 bg-red-500 w-4 h-4 rounded-full top-[-2px] left-[-2px]`} />
                                        </View>
                                    ) : null}
                                    <LinearGradient style={tw`flex-row items-center gap-2 p-3 px-4 pr-10 relative rounded-l-3xl border border-slate-200`}
                                        colors={[String(tw.color("slate-50")), String(tw.color("slate-100"))]}>
                                        {showCalendar ? <Ionicons name='arrow-undo' size={25} style={tw`text-blue-500`} />
                                            : (<Ionicons name='car' size={25} style={tw`text-blue-500`} />)}
                                        <TextTheme font='Prompt-Bold' style={tw`text-blue-500`} size='base'>
                                            {showCalendar ? 'กลับสู่หน้าหลัก' : 'เริ่มจองทริปของคุณ'}
                                        </TextTheme>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animatable.View>

                        </Animatable.View>
                    </View>
                )
            }} />
            <Stack.Screen name='search' options={{
                title: "",
                presentation: "card",
                headerLeft: () => (
                    <TouchableOpacity style={tw`flex-row gap-1 web:p-5 items-center`} onPress={() => router.back()}>
                        <Ionicons size={25} name='chevron-back' />
                        <TextTheme children="กลับ" size='lg' font='Prompt-SemiBold' />
                    </TouchableOpacity>
                ),
                headerStyle: tw`bg-slate-100`,
                contentStyle: tw`bg-slate-100`,
            }} />
        </Stack>
    )
}

export default RootHome