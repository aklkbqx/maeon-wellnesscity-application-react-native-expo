import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import TextTheme from '@/components/TextTheme';
import { useStatusBar } from '@/hooks/useStatusBar';
// import useShowToast from '@/hook/useShowToast';
import tw from "twrnc"


const Logout: React.FC = () => {
  useStatusBar("dark-content");
  
  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      await AsyncStorage.removeItem('userToken');
      setTimeout(() => {
        router.replace("/");
        // useShowToast("success", "สำเร็จ!", "ออกจากระบบแล้ว 👋");
      }, 1000);
    } else {
      setTimeout(() => {
        router.replace("/");
      }, 1000);
    }
  }

  useEffect(() => {
    checkToken()
  }, [checkToken])

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <View style={tw`flex-row gap-3`}>
        <TextTheme font='Prompt-SemiBold' size='2xl' children="กำลังออกจากระบบ.." />
        <ActivityIndicator size="large" color={tw`text-teal-500`.color as any} />
      </View>
    </View>
  );
};

export default Logout;