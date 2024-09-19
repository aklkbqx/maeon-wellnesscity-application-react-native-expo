import { View, Text, Platform } from 'react-native'
import React from 'react'
import { useStatusBar } from '@/hooks/useStatusBar';
import tw from "twrnc"

const ForgotPassword = () => {
  useStatusBar(Platform.OS == "ios" ? "light-content" : "dark-content");
  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text>ForgotPassword</Text>
    </View>
  )
}

export default ForgotPassword;