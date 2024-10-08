import { View } from 'react-native'
import React from 'react'
import tw from "twrnc"
import { TouchableOpacity } from 'react-native-gesture-handler'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import TextTheme from '@/components/TextTheme'

const Error_Page = () => {
    const { error } = useLocalSearchParams();
    return (
        <View style={tw`flex-1 relative`}>
            <View style={tw`flex-1 justify-center items-center`}>
                <Ionicons name='warning' size={100} style={[tw`text-red-500/40 absolute top-15 left-[-20px]`, { transform: [{ rotateZ: '20deg' }] }]} />
                <Ionicons name='alert-circle' size={180} style={[tw`text-red-500/10 absolute bottom-30 right-[-40px]`, { transform: [{ rotateZ: '-25deg' }] }]} />
                <Ionicons name='alert-circle' size={100} style={[tw`text-red-500/10 absolute bottom-[-25] left-[-20px]`, { transform: [{ rotateZ: '25deg' }] }]} />
                <View style={tw`flex-col items-center gap-5`}>
                    <View style={tw`text-red-500 w-full flex-col flex-wrap`}>
                        <TextTheme font="Prompt-Regular" size="2xl" style={tw`text-red-700`}>
                            เกิดข้อผิดพลาด!
                        </TextTheme>
                        <View style={tw`w-[80%] flex-row flex-wrap`}>
                            <TextTheme font="Prompt-Regular" size="base" style={tw`text-red-500 text-justify`}>
                                {error}
                            </TextTheme>
                        </View>
                    </View>
                </View>
            </View>
            <View style={tw`flex-row justify-center`}>
                <TouchableOpacity onPress={() => router.replace("/")} style={tw`flex-row items-center m-10 rounded-2xl bg-red-500 p-2`}>
                    <Ionicons name='home' style={tw`text-xl text-white`} />
                    <Ionicons name='chevron-back' style={tw`text-xl text-white`} />
                    <TextTheme font="Prompt-Regular" size="base" style={tw`text-white`}>
                        กลับไปยังหน้าแรก
                    </TextTheme>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Error_Page