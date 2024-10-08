import { View } from "react-native-ui-lib";
import tw from "twrnc"
import TextTheme from "../TextTheme";
import Loading from "../Loading";
import { formatDistance, getTurnIcon } from "@/helper/utiles";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { RouteInfo } from "../MapTracking";

interface RenderRouteDetails_Type {
    routeInfo?: RouteInfo;
    placeNames: { start: string; destination: string };
    currentStepIndex: number
}

const RenderRouteDetails: React.FC<RenderRouteDetails_Type> = ({ routeInfo, placeNames, currentStepIndex }) => {
    if (!routeInfo) {
        return (
            <View style={tw`p-4 justify-center items-center`}>
                <TextTheme>กำลังโหลดข้อมูลเส้นทาง...</TextTheme>
                <Loading loading={true} />
            </View>
        );
    }

    const totalDistance = routeInfo.distance / 1000;
    const totalDuration = Math.round(routeInfo.interval / 60);

    return (
        <View style={tw`px-4`}>
            <View style={tw`bg-white p-4 mb-4 rounded-lg border-b border-zinc-200`}>
                <View style={tw`flex-col mb-2`}>
                    <TextTheme font='Prompt-SemiBold' size='lg'>{totalDuration} นาที ({formatDistance(totalDistance)})</TextTheme>
                    <View style={tw`mt-2`}>
                        <TextTheme size='sm' font='Prompt-SemiBold'>
                            ระยะทางที่เหลือ: {formatDistance(totalDistance)}
                        </TextTheme>
                    </View>
                </View>
                <View style={tw`flex-row items-center mb-2`}>
                    <FontAwesome5 name="dot-circle" size={20} color="green" />
                    <TextTheme style={tw`ml-2 flex-shrink`} numberOfLines={1}>{placeNames.start}</TextTheme>
                </View>
                <View style={tw`flex-row items-center`}>
                    <FontAwesome5 name="map-marker-alt" size={20} color="red" />
                    <TextTheme style={tw`ml-2 flex-shrink`} numberOfLines={1}>{placeNames.destination}</TextTheme>
                </View>
            </View>
            {routeInfo.guide.map((step, index) => (
                <View key={index} style={tw`flex-row mb-4`}>
                    <View style={tw`w-1/6 items-center`}>
                        {getTurnIcon(step.turn, index < currentStepIndex)}
                    </View>
                    <View style={tw`w-5/6 ${index < currentStepIndex ? 'bg-green-100' : ''} p-2 rounded`}>
                        <TextTheme font='Prompt-SemiBold' style={tw`${index < currentStepIndex ? 'text-green-700' : ''}`}>{step.name}</TextTheme>
                        <TextTheme style={tw`${index < currentStepIndex ? 'text-green-600' : 'text-gray-600'}`}>
                            {formatDistance(step.distance / 1000)}
                        </TextTheme>
                    </View>
                </View>
            ))}
            <View style={tw`flex-row mb-4`}>
                <View style={tw`w-1/6 items-center`}>
                    <FontAwesome5 name="flag-checkered" size={24} color="red" />
                </View>
                <View style={tw`w-5/6`}>
                    <TextTheme font='Prompt-SemiBold'>ถึงจุดหมายปลายทาง</TextTheme>
                    <TextTheme style={tw`text-gray-600`}>{placeNames.destination}</TextTheme>
                </View>
            </View>
            <View style={tw`pb-20`} />
        </View>
    );
};

export default RenderRouteDetails