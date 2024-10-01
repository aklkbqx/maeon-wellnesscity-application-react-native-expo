import { View, Text } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native-ui-lib'
import { Ionicons } from '@expo/vector-icons'
import tw from "twrnc"

const RootCustomTourProgram = () => {
    return (
        <Stack>
            <Stack.Screen name='select-category' options={{
                headerShown: true,
                headerTitle: "เลือหมวดหมู่",
                headerTitleStyle: { fontFamily: "Prompt-SemiBold", fontSize: 18, color: String(tw.color('black')) },
                headerShadowVisible: false,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center`}>
                        <Ionicons name="chevron-back" size={24} color={tw.color('black')} />
                    </TouchableOpacity>
                ),
                headerTitleAlign: "center",
            }} />
            <Stack.Screen name='program-management' options={{
                headerShown: true,
                headerTitle: "",
                headerTitleStyle: { fontFamily: "Prompt-SemiBold", fontSize: 18, color: String(tw.color('black')) },
                headerShadowVisible: false,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center`}>
                        <Ionicons name="chevron-back" size={24} color={tw.color('black')} />
                    </TouchableOpacity>
                ),
                headerTitleAlign: "center",
            }} />
        </Stack>
    )
}

export default RootCustomTourProgram