import React from 'react'
import { Stack } from 'expo-router'
import Toast from 'react-native-toast-message'

const RootRegister = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='optverify' />
    </Stack>
  )
}

export default RootRegister