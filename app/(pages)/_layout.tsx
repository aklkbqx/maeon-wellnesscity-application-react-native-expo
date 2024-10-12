import React from 'react'
import { Stack } from 'expo-router'


export default function RootPages() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='travel-schedules' />
      <Stack.Screen name='main-program' />
      <Stack.Screen name='custom-program' />
      <Stack.Screen name='account' />
      <Stack.Screen name='payments' options={{
        gestureEnabled: false,
      }} />
      <Stack.Screen name='map' />
    </Stack>
  )
}
