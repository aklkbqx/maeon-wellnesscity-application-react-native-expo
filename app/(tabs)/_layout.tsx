import React from 'react'
import { router, Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import tw from "twrnc"
import { TabBarProvider, tabbarStyle, useTabBar } from '@/context/TabBarContext'
import AppUsageTracker from '@/components/AppUsageTracker'
import useUser from '@/hooks/useUser'
import useShowToast from '@/hooks/useShowToast'

const TabNavigator = () => {
  const { tabBarStyle } = useTabBar();
  const { isLogin } = useUser();
  return (
    <>
      <Tabs screenOptions={{
        tabBarLabelStyle: { fontFamily: "Prompt-Regular" },
        tabBarStyle: tabBarStyle,
        tabBarActiveTintColor: String(tw.color("blue-500")),
        tabBarInactiveTintColor: String(tw.color("blue-400")),
        tabBarActiveBackgroundColor: `${tw`text-blue-50`.color}`,
        tabBarItemStyle: tw`rounded-[5] m-[7px]`,
        headerShadowVisible: true,
      }}
        safeAreaInsets={{ bottom: 0, left: 0, right: 0, top: 0 }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            headerShown: false,
            title: 'หน้าแรก',
            tabBarIcon: ({ color, focused }) => <Ionicons size={24} name={focused ? 'home' : 'home-outline'} color={color} />,
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            headerShown: true,
            headerTitle: "สถานะการเดินทางของฉัน",
            title: 'รายการล่าสุด',
            tabBarIcon: ({ color, focused }) => <Ionicons size={24} name={focused ? 'newspaper' : 'newspaper-outline'} color={color} />,
            headerTitleStyle: [tw`text-black text-xl`, { fontFamily: "Prompt-SemiBold" }],
            headerTitleAlign: "center",
            headerStyle: [tw`android:h-20 ios:h-24 bg-white android:border-b android:border-zinc-200`]
          }}
          listeners={{
            tabPress: (event) => {
              if (!isLogin) {
                event.preventDefault()
                router.navigate({
                  pathname: "/login",
                  params: {
                    backToPage: "/activity"
                  }
                })
                useShowToast("info", "", "กรุณาทำการเข้าสู่ระบบก่อน!");
              }
            }
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            headerShown: true,
            headerTitle: "รายการแจ้งเตือน",
            title: 'แจ้งเตือน',
            tabBarIcon: ({ color, focused }) => <Ionicons size={24} name={focused ? 'notifications' : 'notifications-outline'} color={color} />,
            headerTitleStyle: [tw`text-black text-xl`, { fontFamily: "Prompt-SemiBold" }],
            headerTitleAlign: "center",
            headerStyle: [tw`android:h-20 ios:h-24 bg-white android:border-b android:border-zinc-200`],
          }}
        />
        <Tabs.Screen
          name="my-account"
          options={{
            headerShown: true,
            headerTitle: "จัดการบัญชี",
            title: 'บัญชี',
            tabBarIcon: ({ color, focused }) => <Ionicons size={24} name={focused ? 'person' : 'person-outline'} color={color} />,
            headerTitleStyle: [tw`text-black text-xl`, { fontFamily: "Prompt-SemiBold" }],
            headerTitleAlign: "center",
            headerStyle: [tw`android:h-20 ios:h-24 bg-white android:border-b android:border-zinc-200`],
          }}
        />
      </Tabs>
    </>
  )
}

const RootHome = () => {
  return (
    <TabBarProvider defaultStyle={tabbarStyle}>
      <TabNavigator />
      <AppUsageTracker />
    </TabBarProvider>
  );
};

export default RootHome
