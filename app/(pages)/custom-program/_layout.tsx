import React from 'react';
import { TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import tw from "twrnc";
import TimelineBottomSheet from '@/components/TimelineBottomSheet';
import { BottomSheetProvider, useBottomSheet } from '@/context/BottomSheetContext';

const RootCustomTourProgram = () => {
    return (
        <BottomSheetProvider>
            <RootContent />
        </BottomSheetProvider>
    );
};

const RootContent = () => {
    const { toggleBottomSheet } = useBottomSheet();

    return (
        <>
            <Stack>
                <Stack.Screen
                    name='category'
                    options={{
                        headerShown: true,
                        headerTitle: "เลือหมวดหมู่",
                        headerTitleStyle: { fontFamily: "Prompt-SemiBold", fontSize: 18, color: String(tw.color('black')) },
                        headerShadowVisible: false,
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center`}>
                                <Ionicons name="chevron-back" size={24} color={tw.color('black')} />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <TouchableOpacity onPress={toggleBottomSheet} style={tw`flex-row items-center`}>
                                <Ionicons name="time-outline" size={24} color={tw.color('black')} />
                            </TouchableOpacity>
                        ),
                        headerTitleAlign: "center",
                    }}
                />
                <Stack.Screen
                    name='manage'
                    options={{
                        headerShown: true,
                        headerTitle: "",
                        headerTitleStyle: { fontFamily: "Prompt-SemiBold", fontSize: 18, color: String(tw.color('black')) },
                        headerShadowVisible: false,
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center`}>
                                <Ionicons name="chevron-back" size={24} color={tw.color('black')} />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <TouchableOpacity onPress={toggleBottomSheet} style={tw`flex-row items-center`}>
                                <Ionicons name="time-outline" size={24} color={tw.color('black')} />
                            </TouchableOpacity>
                        ),
                        headerTitleAlign: "center",
                    }}
                />
                <Stack.Screen
                    name='subdistrict'
                    options={{
                        headerShown: true,
                        headerTitle: "",
                        headerTitleStyle: { fontFamily: "Prompt-SemiBold", fontSize: 18, color: String(tw.color('black')) },
                        headerShadowVisible: false,
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center`}>
                                <Ionicons name="chevron-back" size={24} color={tw.color('black')} />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <TouchableOpacity onPress={toggleBottomSheet} style={tw`flex-row items-center`}>
                                <Ionicons name="time-outline" size={24} color={tw.color('black')} />
                            </TouchableOpacity>
                        ),
                        headerTitleAlign: "center",
                    }}
                />
            </Stack>
            <TimelineBottomSheet />
        </>
    );
};

export default RootCustomTourProgram;