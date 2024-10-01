import React, { useCallback, useState } from 'react';
import { FlatList, Image, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import TextTheme from '@/components/TextTheme';
import { useStatusBar } from '@/hooks/useStatusBar';
import { Ionicons } from '@expo/vector-icons';
import { Carousel, View } from 'react-native-ui-lib';
import tw from "twrnc";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface TourItem {
    image: string;
    name: string;
    description: string;
    price: string;
}

export default function HomeScreen() {
    useStatusBar("dark-content");
    
    const renderPopularTour = ({ item }: { item: TourItem }) => (
        <View style={tw`flex-row bg-white items-center gap-3 rounded-xl shadow-md mb-3 border border-slate-200 overflow-hidden`}>
            <Image source={{ uri: item.image }} style={tw`w-20 h-20`} />
            <View style={tw`flex-1`}>
                <TextTheme style={tw`text-sm`}>{item.name}</TextTheme>
                <TextTheme style={tw`text-xs text-gray-600`}>{item.description}</TextTheme>
                <TextTheme style={tw`text-sm text-green-600`}>{item.price}</TextTheme>
            </View>
        </View>
    );

    const popularTours = [
        { name: 'Thailand', description: '3 nights tour around...', price: '$245.50', image: 'https://i.natgeofe.com/k/8dc7401d-fac9-43c5-a6d4-d056401f7779/kuala-lumpur.jpg?wp=1&w=1084.125&h=721.875' },
        { name: 'Cuba', description: '4 nights four tourist...', price: '$495.99', image: 'https://cdn.britannica.com/49/102749-050-B4874C95/Kuala-Lumpur-Malaysia.jpg' },
        { name: 'Dominicos', description: '3 nights four tourist...', price: '$295.99', image: 'https://www.eyeonasia.gov.sg/images/asean-countries/Malaysia%20snapshot%20cover%20iso.jpg' },
    ];
    return (
        <LinearGradient colors={[String(tw.color("white")), String(tw.color("slate-200"))]} style={tw`flex-1 bg-white`}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={tw`flex-1`}>
                <View style={tw`mt-1 pb-3 px-5`}>
                    <TextTheme font='Prompt-SemiBold' size='2xl' style={tw`text-black pt-3`}>เยี่ยมชม</TextTheme>
                    <View style={tw`flex-row items-center gap-2`}>
                        <TextTheme font='Prompt-Light' size='base' style={tw`text-zinc-500`}>สิ่งที่น่าสนใจและวางแผนการท่องเที่ยวของคุณ</TextTheme>
                        <Ionicons name='sparkles' size={15} style={tw`text-amber-500`} />
                    </View>
                </View>
                <View style={tw`flex-row flex-wrap justify-between px-5`}>
                    {[...Array(6)].map((_, index) => (
                        <TouchableOpacity key={index} style={tw`w-[30%] items-center mb-5`}>
                            <View style={tw`w-[90%] h-[70px] bg-white shadow rounded-2xl justify-center items-center mb-2`} />
                            <TextTheme size='sm'>{index + 1}</TextTheme>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={tw`flex-row justify-between items-center mt-2 px-5`}>
                    <TextTheme font='Prompt-SemiBold' size='xl'>ยอดนิยม</TextTheme>
                    <TouchableOpacity style={tw`flex-row items-center`}>
                        <TextTheme color="black">ดูเพิ่มเติม</TextTheme>
                        <Ionicons name="arrow-forward-circle" size={25} color={String(tw`text-black`.color)} />
                    </TouchableOpacity>
                </View>

                <Carousel pageControlProps={{ size: 6, spacing: 8 }} pageWidth={200} style={tw`mt-2`}>
                    {popularTours.map((tour, index) => (
                        <View key={`tour-${index}`} style={tw`rounded-xl h-50 relative`}>
                            <Image source={{ uri: tour.image }} style={tw`w-full h-50 rounded-2xl`} />
                            <BlurView intensity={10} style={tw`absolute bottom-2 left-2 px-2 rounded-xl overflow-hidden`}>
                                <TextTheme font="Prompt-Medium" size="lg" color='white'>{tour.name}</TextTheme>
                                <TextTheme font="Prompt-Medium" size="xs" color='white'>{tour.price}</TextTheme>
                            </BlurView>
                        </View>
                    ))}
                </Carousel>

                <View style={tw`mx-5 mt-2 mb-20`}>
                    <TextTheme font="Prompt-Medium" size="lg" style={tw`mb-3`}>โปรแกรมฟื้นฟูสุขภาพ (Long-day trip)</TextTheme>
                    <FlatList
                        data={popularTours}
                        renderItem={renderPopularTour}
                        keyExtractor={(item) => item.name}
                        scrollEnabled={false}
                    />
                </View>

            </ScrollView>
        </LinearGradient>
    );
}
