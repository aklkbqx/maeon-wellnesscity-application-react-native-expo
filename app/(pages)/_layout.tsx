import React, { useState } from 'react'
import { router, Stack } from 'expo-router'
import { Dialog, PanningProvider, TouchableOpacity, View } from 'react-native-ui-lib'
import { Ionicons } from '@expo/vector-icons'
import TextTheme from '@/components/TextTheme'
import tw from "twrnc"
import { Alert } from 'react-native'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function RootPages() {
  const [dialogMessage, setDialogMessage] = useState<boolean>(false);
  // 
  // เตือน

  // Alert.alert("", "",
  //   [{ text: "ยกเลิก" }, {
  //     text: "ตกลง", onPress: async () => {
  //       router.navigate("/selectdatatime")
  //       const lastItinerary = await AsyncStorage.getItem('lastTravelItinerary');
  //       if (lastItinerary) {
  //         await AsyncStorage.removeItem('lastTravelItinerary');
  //       }
  //     }
  //   }]
  // )
  return (
    <>
      <Stack>
        <Stack.Screen name='travel-itinerary' options={{
          headerShown: true,
          headerTitle: "จัดการเวลาการท่องเที่ยว",
          headerTitleStyle: { fontFamily: "Prompt-Bold", fontSize: 18, color: String(tw.color('black')) },
          headerShadowVisible: false,
          headerLeft: () => (
            <>
              <TouchableOpacity onPress={() => setDialogMessage(!dialogMessage)} style={tw`flex-row items-center`}>
                <Ionicons name="chevron-back" size={24} color={tw.color('black')} />
              </TouchableOpacity>
              <Dialog
                visible={dialogMessage}
                onDismiss={() => setDialogMessage(false)}
                panDirection={PanningProvider.Directions.LEFT}
              >
                <View style={tw`flex-row justify-center`}>
                  <View style={tw`w-[70%] rounded-2xl overflow-hidden`}>
                    <View style={tw`border-b border-zinc-200 p-2 bg-white`}>
                      <TextTheme>คำเตือน!</TextTheme>
                    </View>
                    <View style={tw`p-5 bg-slate-50`}>
                      <TextTheme style={tw`text-center`}>
                        {"แน่ใจไหมที่จะย้อนกลับ "}
                        <TextTheme style={tw`text-center`}>{"การจัดเวลาการท่องเที่ยวทั้งหมดของคุณ"}</TextTheme>
                      </TextTheme>

                      <TextTheme style={tw`text-center text-red-500 underline`}>{"จะหายไป!"}</TextTheme>
                    </View>
                    <View style={tw`border-t flex-row justify-between border-zinc-200 p-2 gap-2 bg-white`}>
                      <TouchableOpacity onPress={() => setDialogMessage(false)} style={tw`flex-1 bg-zinc-200 rounded-xl justify-center flex-row p-1`}>
                        <TextTheme>ยกเลิก</TextTheme>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={async () => {
                        const lastItinerary = await AsyncStorage.getItem('lastTravelItinerary');
                        if (lastItinerary) {
                          await AsyncStorage.removeItem('lastTravelItinerary');
                        }
                        router.navigate("/selectdatatime")
                      }} style={tw`flex-1 bg-blue-500 rounded-xl justify-center flex-row p-1`}>
                        <TextTheme style={tw`text-white`}>ตกลง</TextTheme>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Dialog>
            </>
          ),
          headerTitleAlign: "left",
        }} />
        <Stack.Screen name='main-tour-program' options={{
          headerShown: true
        }} />
        <Stack.Screen name='tour-program-selection' options={{
          headerShown: true,
          headerTitle: "",
          headerTitleStyle: { fontFamily: "Prompt-Bold", fontSize: 18, color: String(tw.color('black')) },
          headerShadowVisible: false,
          gestureEnabled: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center`}>
              <Ionicons name="chevron-back" size={24} color={tw.color('black')} />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",

        }} />
        <Stack.Screen name='(custom-tour-program)' options={{
          headerShown: false,
          headerTitle: "",
        }} />
        <Stack.Screen name='detail-program' options={{ headerShown: false }} />
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
      <Toast />
    </>
  )
}
