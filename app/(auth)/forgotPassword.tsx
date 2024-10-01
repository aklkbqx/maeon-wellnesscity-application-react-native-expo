import { View, Text, Platform } from 'react-native'
import React from 'react'
import { useStatusBar } from '@/hooks/useStatusBar';
import tw from "twrnc"
import { TouchableOpacity } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ForgotPassword = () => {
  useStatusBar(Platform.OS == "ios" ? "light-content" : "dark-content");
  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <TouchableOpacity style={tw`absolute right-3 android:top-3 ios:top-3 mt-0 android:mt-4 z-10`} onPress={() => router.dismiss()}>
        <Ionicons name="close" size={35} style={tw`text-white`} />
      </TouchableOpacity>
    </View>
  )
}

export default ForgotPassword;