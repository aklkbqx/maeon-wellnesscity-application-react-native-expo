import React from 'react'
import { router, Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native-ui-lib'
import tw from "twrnc"
import TextTheme from '@/components/TextTheme'
import { tabbarStyle } from '@/helper/my-lib'

const RootHome = () => {
  return (
    <>
      <Tabs screenOptions={{
        tabBarLabelStyle: { fontFamily: "Prompt-Regular" },
        tabBarStyle: tabbarStyle,
        tabBarActiveTintColor: `${tw`text-teal-600`.color}`,
        tabBarInactiveTintColor: `${tw`text-white`.color}`,
        tabBarActiveBackgroundColor: `${tw`text-white`.color}`,
        tabBarItemStyle: { borderRadius: 20, margin: 7 },
        headerShadowVisible: false,
      }}
        safeAreaInsets={{ bottom: 0, left: 0, right: 0, top: 0 }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            headerShown: false,
            title: 'หน้าแรก',
            tabBarIcon: ({ color, focused }) => <Ionicons size={30} name={focused ? 'home' : 'home-outline'} color={color} />,
          }}
        />
        <Tabs.Screen
          name="travel"
          options={{
            headerShown: true,
            headerTitle: "สถานะการเดินทาง",
            title: 'เดินทาง',
            tabBarIcon: ({ color, focused }) => <Ionicons size={30} name={focused ? 'map' : 'map-outline'} color={color} />,
            headerTitleStyle: [tw`text-white text-xl`, { fontFamily: "Prompt-SemiBold" }],
            headerTitleAlign: "left",
            headerStyle: [tw`android:h-20 ios:h-23 bg-teal-600`],
            headerRight: () => (
              <TouchableOpacity onPress={() => router.navigate("/")} style={tw`pr-4 absolute right-0`}>
                <View style={tw`items-center gap-1 flex-row bg-slate-100 rounded-3 p-1.5 px-3`}>
                  <TextTheme color='teal-600' font='Prompt-SemiBold' size='sm' children='ประวัติ' />
                  <Ionicons name='time' size={20} style={tw`text-teal-600`} />
                </View>
              </TouchableOpacity>
            )
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            headerShown: true,
            headerTitle: "รายการแจ้งเตือน",
            title: 'แจ้งเตือน',
            tabBarIcon: ({ color, focused }) => <Ionicons size={30} name={focused ? 'notifications' : 'notifications-outline'} color={color} />,
            headerTitleStyle: [tw`text-white text-xl`, { fontFamily: "Prompt-SemiBold" }],
            headerTitleAlign: "center",
            headerStyle: [tw`android:h-20 ios:h-23 bg-teal-600`],
          }}
        />
        <Tabs.Screen
          name="my-account"
          options={{
            headerShown: true,
            headerTitle: "จัดการบัญชี",
            title: 'บัญชี',
            tabBarIcon: ({ color, focused }) => <Ionicons size={30} name={focused ? 'person' : 'person-outline'} color={color} />,
            headerTitleStyle: [tw`text-white text-xl`, { fontFamily: "Prompt-SemiBold" }],
            headerTitleAlign: "center",
            headerStyle: [tw`android:h-20 ios:h-23 bg-teal-600`],
          }}
        />
      </Tabs>
    </>
  )
}

export default RootHome