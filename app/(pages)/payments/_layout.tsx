import { BackHandler, Platform, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useNavigation } from 'expo-router'
import { Dialog, PanningProvider, TouchableOpacity } from 'react-native-ui-lib'
import tw from "twrnc"
import { Ionicons } from '@expo/vector-icons'
import TextTheme from '@/components/TextTheme'

const RootPayments = () => {
  const navigation = useNavigation()
  const [dialogBackToHome, setDialogBackToHome] = useState<boolean>(false);

  useEffect(() => {
    const preventGoingBack = () => {
      return true
    }
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      const currentRoute = e.data.action.target?.split('-')[0]
      if (currentRoute === 'index' || currentRoute === 'selectdatatime') {
        e.preventDefault()
      }
    })

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', preventGoingBack)
    }

    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress', preventGoingBack)
      }
      unsubscribe()
    }
  }, [navigation])
  return (
    <Stack>
      <Stack.Screen name='index' options={{
        headerShown: true,
        headerTitle: "การชำระเงิน",
        headerTitleStyle: { fontFamily: "Prompt-SemiBold", fontSize: 18, color: String(tw.color('black')) },
        headerShadowVisible: false,
        headerLeft: () => (
          <>
            <TouchableOpacity onPress={() => setDialogBackToHome(true)} style={tw`flex-row items-center`}>
              <Ionicons name="chevron-back" size={24} color={tw.color('black')} />
            </TouchableOpacity>
            <Dialog
              visible={dialogBackToHome}
              onDismiss={() => setDialogBackToHome(false)}
              panDirection={PanningProvider.Directions.LEFT}
            >
              <View style={tw`flex-row justify-center`}>
                <View style={tw`rounded-2xl overflow-hidden`}>
                  <View style={tw`border-b border-zinc-200 p-2 bg-white`}>
                    <TextTheme>แน่ใจไหม!</TextTheme>
                  </View>
                  <View style={tw`p-5 bg-slate-50`}>
                    <TextTheme style={tw`text-center`}>
                      {"คุณยังทำรายการชำระเงินไม่สำเร็จ"}
                      <TextTheme style={tw`text-center`}>{"ต้องการที่จะไปยังหน้าแรกใช่หรือไม่"}</TextTheme>
                    </TextTheme>
                  </View>
                  <View style={tw`border-t flex-row justify-between border-zinc-200 p-2 gap-2 bg-white`}>
                    <TouchableOpacity onPress={() => setDialogBackToHome(false)} style={tw`flex-1 bg-zinc-200 rounded-xl justify-center flex-row p-2`}>
                      <TextTheme style={tw`text-center`}>{"ชำระเงินต่อ"}</TextTheme>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.navigate("/activity")} style={tw`flex-1 bg-blue-500 rounded-xl justify-center flex-row p-2`}>
                      <TextTheme style={tw`text-white text-center`}>{"ไปยังหน้าแรก"}</TextTheme>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Dialog>
          </>
        ),
        headerTitleAlign: "center",
      }} />
      <Stack.Screen name='success' options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  )
}

export default RootPayments