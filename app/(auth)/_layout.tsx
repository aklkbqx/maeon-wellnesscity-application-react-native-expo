import React from 'react'
import { Stack } from 'expo-router'
import Toast from 'react-native-toast-message'

const RootAuthenticator = () => {
    return (
        <>
            <Stack screenOptions={{ headerShown: false, presentation: "modal" }}>
                <Stack.Screen name="login" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="logout" options={{ animation: "slide_from_bottom", headerTransparent: true }} />
                <Stack.Screen name="(register)" options={{ animation: "slide_from_bottom" }} />
                <Stack.Screen name="forgotPassword" options={{ animation: "slide_from_bottom" }} />
            </Stack>
            <Toast />
        </>
    )
}

export default RootAuthenticator