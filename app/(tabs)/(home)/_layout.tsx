import { TouchableOpacity } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { router, Stack, useNavigation } from 'expo-router'
import TextTheme from '@/components/TextTheme'
import tw from "twrnc"
import { Ionicons } from '@expo/vector-icons'
import { Avatar, Image, View } from 'react-native-ui-lib'
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient'

const RootHome = () => {
    const navigation = useNavigation()
    const [showCalendar, setShowCalendar] = useState<boolean>(false);

    const toggleView = useCallback(() => {
        router.navigate(!showCalendar ? "/selectdatatime" : "/");
        setShowCalendar((prev) => !prev)
    }, [showCalendar])

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', (e) => {
            const currentRoute = e.data.state.routes[e.data.state.index];
            const routeToHideTabBar = ["search"].includes(currentRoute.state?.routes[1]?.name as any);
            routeToHideTabBar
        });
        return unsubscribe;
    }, [])

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTitleStyle: [tw`text-lg`, { fontFamily: "Prompt-SemiBold" }],
                headerTitleAlign: "center",
                headerShadowVisible: false,
                animation: "simple_push"
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
                                    <View style={tw`bg-slate-100 h-25 w-25 rounded-full border-2 border-slate-100 justify-center items-center`}>
                                        <Avatar
                                            size={95}
                                            badgeProps={{ backgroundColor: String(tw`text-green-500`.color), size: 20 }}
                                            source={require("@/assets/images/default-profile.jpg")}
                                        // onImageLoadStart={() => console.log('Image load started')}
                                        // onImageLoadEnd={() => console.log('Image load ended')}
                                        // onImageLoadError={() => console.log('Image load failed')}
                                        />
                                    </View>
                                    <View style={tw`flex-col`}>
                                        <TextTheme size='lg' color='teal-600'>
                                            ยินดีต้อนรับ
                                        </TextTheme>
                                        <View style={tw`flex-row gap-2`}>
                                            <TouchableOpacity onPress={() => router.navigate("/(register)")}>
                                                <LinearGradient style={tw`p-1 px-2 rounded-xl`} colors={[String(tw.color("white")), String(tw.color("slate-200"))]}>
                                                    <TextTheme size='lg' color='black'>
                                                        ลงทะเบียน
                                                    </TextTheme>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => router.navigate("/login")}>
                                                <LinearGradient style={tw`p-1 px-2 rounded-xl`} colors={[String(tw.color("teal-400")), String(tw.color("teal-500"))]}>
                                                    <TextTheme size='lg' color='white'>
                                                        เข้าสู่ระบบ
                                                    </TextTheme>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => router.navigate("/search")} style={tw`bg-white absolute top-10 right-5 rounded-xl p-1.5`}>
                                    <Ionicons size={24} name='search' style={tw`text-black`} />
                                </TouchableOpacity>
                            </View>

                            <Animatable.View
                                animation={showCalendar ? "fadeInRightBig" : "pulse"}
                                iterationCount={showCalendar ? 1 : "infinite"}
                                direction="normal"
                                duration={showCalendar ? 1000 : 3000}
                                style={[tw`absolute top-33 right-[-25px]`]}
                            >
                                <TouchableOpacity onPress={toggleView} style={tw`shadow rounded-l-full border border-teal-100`}>
                                    {!showCalendar ? (
                                        <View style={tw`relative z-999`}>
                                            <View style={tw`absolute z-999 bg-red-400 w-3.5 h-3.5 rounded-full`} />
                                        </View>
                                    ) : null}
                                    <LinearGradient style={tw`flex-row items-center gap-2 p-3 px-4 pr-10 relative rounded-l-full`}
                                        colors={[String(tw.color("white")), String(tw.color("slate-100"))]}>
                                        {showCalendar ? <Ionicons name='arrow-undo' size={25} style={tw`text-teal-500`} />
                                            : (<Ionicons name='car' size={30} style={tw`text-teal-500`} />)}
                                        <TextTheme font='Prompt-Bold' style={tw`text-teal-500`} size='lg'>
                                            {showCalendar ? 'กลับสู่หน้าหลัก' : 'เริ่มจองทริปของคุณ'}
                                        </TextTheme>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>
                    )
                }
            }} />
            < Stack.Screen name='search' options={{
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
        </Stack >
    )
}

export default RootHome