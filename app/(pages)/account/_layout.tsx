import React from 'react'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native-ui-lib'
import tw from "twrnc"
import { Ionicons } from '@expo/vector-icons'

const RootAccount = () => {
    return (
        <Stack>
            <Stack.Screen name='edit-account' options={{
                headerShown: true,
                headerTitle: "ข้อมูลส่วนตัว",
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

export default RootAccount