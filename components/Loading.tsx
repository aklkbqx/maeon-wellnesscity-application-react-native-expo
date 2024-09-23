import { View, ActivityIndicator, ActivityIndicatorProps } from 'react-native'
import React from 'react'
import tw from "twrnc"

interface LoadingProps extends Omit<ActivityIndicatorProps, 'color'> {
    type?: "full" | "component";
    color?: string;
}

const Loading: React.FC<LoadingProps> = ({
    type = "component",
    color = String(tw`text-teal-500`.color),
    ...props
}) => {
    const indicator = <ActivityIndicator color={color} {...props} />;

    if (type === "full") {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                {indicator}
            </View>
        )
    }

    return indicator;
}

export default Loading