import React from 'react';
import { RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import TextTheme from '@/components/TextTheme';
import { useStatusBar } from '@/hooks/useStatusBar';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native-ui-lib';
import tw from "twrnc";

export default function HomeScreen() {
    useStatusBar("dark-content");
    return (
        <View style={tw`flex-1`}>
            <ScrollView
                style={tw`flex-1 bg-slate-100 px-5`}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => { }}
                        colors={[String(tw`text-teal-500`.color)]}
                        tintColor={String(tw`text-teal-500`.color)} />
                }>
                <View style={tw`mt-1 pb-3`}>
                    <TextTheme font='Prompt-SemiBold' size='2xl' style={tw`text-slate-700 pt-3`}>เยี่ยมชม</TextTheme>
                    <View style={tw`flex-row items-center gap-2`}>
                        <TextTheme font='Prompt-Light' size='base' style={tw`text-slate-700`}>สิ่งที่น่าสนใจและวางแผนการท่องเที่ยวของคุณ</TextTheme>
                        <Ionicons name='sparkles' size={15} style={tw`text-amber-500`} />
                    </View>
                </View>
                <View style={tw`flex-row flex-wrap justify-between`}>
                    {[...Array(6)].map((_, index) => (
                        <TouchableOpacity key={index} style={tw`w-[30%] items-center mb-5`}>
                            <View style={tw`w-[90%] h-[75px] bg-white rounded-xl justify-center items-center mb-2`} />
                            <TextTheme font='Prompt-Regular' size='sm'>เมนูที่ {index + 1}</TextTheme>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={tw`flex-row justify-between items-center mt-5`}>
                    <TextTheme font='Prompt-SemiBold' size='xl'>ยอดนิยม</TextTheme>
                    <TouchableOpacity style={tw`flex-row items-center`}>
                        <TextTheme font="Prompt-Regular" color="teal-500">ดูเพิ่มเติม</TextTheme>
                        <Ionicons name="arrow-forward-circle" size={25} color={String(tw`text-teal-500`.color)} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
