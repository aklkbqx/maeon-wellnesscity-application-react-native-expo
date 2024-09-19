import { TouchableOpacity, Animated } from 'react-native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { router, Stack, useFocusEffect, useNavigation } from 'expo-router'
import TextTheme from '@/components/TextTheme'
import tw from "twrnc"
import { Ionicons } from '@expo/vector-icons'
import { tabbarStyle } from '@/helper/my-lib'
import { Image, View } from 'react-native-ui-lib'
import * as Animatable from 'react-native-animatable';

const RootHome = () => {
    const navigation = useNavigation()
    const tabBarAnimation = useRef(new Animated.Value(1)).current;
    const tabBarHeight = useRef(new Animated.Value(60)).current;
    const [showCalendar, setShowCalendar] = useState<boolean>(false);

    //TODO ทำระบบการเลื่อนปิด tabbar เมื่อมาถึงหน้าปฏิทิน

    const toggleView = useCallback(() => {
        router.navigate(!showCalendar ? "/selectdatatime" : "/");
        setShowCalendar((prev) => !prev)
    }, [showCalendar])

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', (e) => {
            const currentRoute = e.data.state.routes[e.data.state.index];
            const shouldHideTabBar = ["search"].includes(currentRoute.state?.routes[1]?.name as any);

            Animated.parallel([
                Animated.timing(tabBarAnimation, {
                    toValue: shouldHideTabBar ? 0 : 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(tabBarHeight, {
                    toValue: shouldHideTabBar ? 0 : 50,
                    duration: 300,
                    useNativeDriver: false,
                })
            ]).start();

            if (!shouldHideTabBar) {
                navigation.setOptions({
                    tabBarStyle: [{
                        transform: [{
                            translateY: tabBarAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [100, 0],
                            })
                        }],
                    }, tabbarStyle]
                });
            }
        });
        return unsubscribe;
    }, [navigation, tabBarAnimation, tabBarHeight]);

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTitleStyle: [tw`text-lg`, { fontFamily: "Prompt-SemiBold" }],
                headerTitleAlign: "center",
                headerShadowVisible: false,
                animation: "simple_push",
            }}
        >
            <Stack.Screen name='(index)' options={{
                headerShown: true,
                header: () => {
                    return (
                        <View style={tw`relative`}>
                            <View style={[tw`h-[160px] top-0 left-0 w-full absolute overflow-hidden`]}>
                                <Image source={require("@/assets/images/appHomeBg.png")} style={tw`w-full top-[-100px]`} />
                            </View>
                            <View style={tw`px-5 pt-10 pb-5`}>
                                <View style={tw`flex-row items-center gap-3`}>
                                    <View style={tw`bg-slate-200 h-25 w-25 rounded-full border-2 border-white justify-center items-center`}>
                                        <Image style={[tw`bg-slate-200 h-25 w-25 rounded-full border-2 border-white`, { objectFit: "cover" }]} />
                                    </View>
                                    <View style={tw`flex-col`}>
                                        <TextTheme size='lg' color='teal-600'>
                                            ยินดีต้อนรับ
                                        </TextTheme>
                                        <View style={tw`flex-row gap-2`}>
                                            <TouchableOpacity onPress={() => router.navigate("/(register)")} style={tw`bg-white p-1 px-2 rounded-xl shadow`}>
                                                <TextTheme size='lg' color='teal-900'>
                                                    ลงทะเบียน
                                                </TextTheme>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => router.navigate("/login")} style={tw`bg-teal-500 p-1 px-2 rounded-xl shadow`}>
                                                <TextTheme size='lg' color='white'>
                                                    เข้าสู่ระบบ
                                                </TextTheme>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => router.navigate("/search")} style={tw`bg-white absolute top-10 right-5 rounded-xl p-1.5`}>
                                    <Ionicons size={24} name='search' style={tw`text-black`} />
                                </TouchableOpacity>
                            </View>

                            <Animatable.View
                                animation={"fadeInRightBig"}
                                iterationCount={1}
                                direction="normal"
                                duration={1000}
                                style={[tw`absolute top-35 right-[-25px] p-3 px-4 pr-10 bg-white rounded-l-full z-99 shadow border-r-0 border-teal-500 shadow`]}
                            >
                                <TouchableOpacity style={tw`flex-row items-center gap-2`} onPress={toggleView}>
                                    {showCalendar ? <Ionicons name='arrow-undo' size={25} style={tw`text-teal-500`} />
                                        : <Ionicons name='airplane' size={25} style={tw`text-teal-500`} />}
                                    <TextTheme font='Prompt-Bold' style={tw`text-teal-500`} size='lg'>
                                        {showCalendar ? 'กลับสู่หน้าหลัก' : 'เริ่มจองทริปของคุณ'}
                                    </TextTheme>
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>
                    )
                }
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