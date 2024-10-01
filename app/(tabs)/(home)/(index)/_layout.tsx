import React from 'react'
import { Stack } from 'expo-router'

const RootHome = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "fade_from_bottom",
                gestureEnabled: false
            }}
        >
            <Stack.Screen name='index' />
            <Stack.Screen name='selectdatatime' />
        </Stack>
    )
}

export default RootHome