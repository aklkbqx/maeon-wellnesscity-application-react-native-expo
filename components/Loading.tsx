import { View, ActivityIndicator, ActivityIndicatorProps } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc"
import { BlurView } from 'expo-blur';
import { Modal } from 'react-native-ui-lib';

interface LoadingProps extends Omit<ActivityIndicatorProps, 'color'> {
    type?: "full" | "component";
    color?: string;
    loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({
    type = "component",
    color = String(tw`text-blue-500`.color),
    loading,
    ...props
}) => {
    const indicator = <ActivityIndicator size={'large'} color={color} {...props} />;

    if (type === "full") {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={loading}
            >
                <BlurView intensity={5} style={tw`flex-1 items-center justify-center`}>
                    <View style={tw`flex-row items-center gap-2`}>
                        {indicator}
                    </View>
                </BlurView>
            </Modal>
        )
    }

    return indicator;
}

export default Loading