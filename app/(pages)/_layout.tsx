import React from 'react'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native-ui-lib'
import { Ionicons } from '@expo/vector-icons'
import TextTheme from '@/components/TextTheme'
import tw from "twrnc"
import { Alert } from 'react-native'

export default function RootPages() {
  return (
    <Stack>
      <Stack.Screen name='travel-itinerary' options={{
        headerShown: true,
        headerTitle: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity onPress={() => Alert.alert("เตือน", "แน่ใจไหมที่จะย้อนกลับ การจัดเวลาการท่องเที่ยวทั้งหมดของคุณจะหายไป",
            [{ text: "ยกเลิก" }, { text: "ตกลง", onPress: () => router.navigate("/selectdatatime") }]
          )} style={tw`flex-row items-center p-4 pb-0 bg-white`}>
            <Ionicons name="chevron-back" size={24} color={tw.color('teal-500')} />
            <TextTheme font="Prompt-SemiBold" size="xl" style={tw`ml-2 text-teal-500`}>กลับ</TextTheme>
          </TouchableOpacity>
        )
      }} />
      <Stack.Screen name='main-tour-program' options={{
        headerShown: true,
        headerTitle: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center p-4 pb-0 bg-white`}>
            <Ionicons name="chevron-back" size={24} color={tw.color('teal-500')} />
            <TextTheme font="Prompt-SemiBold" size="xl" style={tw`ml-2 text-teal-500`}>กลับ</TextTheme>
          </TouchableOpacity>
        )
      }} />
      <Stack.Screen name='custom-tour-program' options={{
        headerShown: true,
        headerTitle: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center p-4 pb-0 bg-white`}>
            <Ionicons name="chevron-back" size={24} color={tw.color('teal-500')} />
            <TextTheme font="Prompt-SemiBold" size="xl" style={tw`ml-2 text-teal-500`}>กลับ</TextTheme>
          </TouchableOpacity>
        )
      }} />
      <Stack.Screen name='detail-program' options={{
        headerShown: true,
        headerTitle: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center p-4 pb-0 bg-white`}>
            <Ionicons name="chevron-back" size={24} color={tw.color('teal-500')} />
            <TextTheme font="Prompt-SemiBold" size="xl" style={tw`ml-2 text-teal-500`}>กลับ</TextTheme>
          </TouchableOpacity>
        )
      }} />
    </Stack>
  )
}
