import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, TouchableOpacity } from 'react-native';
import TextTheme from '@/components/TextTheme';
import { useStatusBar } from '@/hooks/useStatusBar';
import { Ionicons } from '@expo/vector-icons';
import { Carousel, View } from 'react-native-ui-lib';
import tw from "twrnc";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import api from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';

interface LocationType {
    id: string;
    name: string;
}

interface TourItem {
    image: string;
    name: string;
    description: string;
}

const Menu: React.FC<{ locationTypes: LocationType[] }> = ({ locationTypes }) => {
    const getIconName = (name: string): keyof typeof Ionicons.glyphMap => {
        switch (name) {
            case "สถานที่ท่องเที่ยว": return "earth";
            case "ที่พัก": return "bed";
            case "แหล่งเรียนรู้": return "school";
            case "ร้านอาหารและของฝาก": return "restaurant";
            case "ท่องเที่ยวตามฤดูกาล": return "calendar";
            default: return "alert";
        }
    };

    const getIconColor = (index: number): string => {
        const colors = ["rose-500", "sky-500", "purple-500", "amber-500", "fuchsia-500"];
        return colors[index % colors.length];
    };

    return (
        <View style={tw`gap-2 flex-col mb-2`}>
            <View style={tw`flex-row flex-wrap px-5`}>
                {locationTypes.slice(0, 2).map((type, index) => (
                    <View style={tw`items-center basis-[50%] px-2 flex-col`} key={`menu1-2${index}`}>
                        <TouchableOpacity style={tw`w-full h-[70px] mb-1`}>
                            <LinearGradient colors={["#fff", String(tw.color(getIconColor(index).replace("-500", "-50")))]}
                                style={tw`w-full justify-center items-center h-full rounded-2xl border border-[${String(tw.color(getIconColor(index).replace("-500", "-100")))}]`}>
                                <Ionicons name={getIconName(type.name)} size={45} color={String(tw.color(getIconColor(index)))} />
                            </LinearGradient>
                        </TouchableOpacity>
                        <TextTheme size='sm'>{type.name}</TextTheme>
                    </View>
                ))}
            </View>
            <View style={tw`flex-row flex-wrap px-5`}>
                {locationTypes.slice(2, 5).map((type, index) => (
                    <View style={tw`items-center basis-[33.3%] px-2 flex-col`} key={`menu2-5${index}`}>
                        <TouchableOpacity style={tw`w-full h-[70px] mb-1`}>
                            <LinearGradient colors={["#fff", String(tw.color(getIconColor(index + 2).replace("-500", "-50")))]}
                                style={tw`w-full justify-center items-center h-full rounded-2xl border border-[${String(tw.color(getIconColor(index + 2).replace("-500", "-100")))}]`}>
                                <Ionicons name={getIconName(type.name)} size={40} color={String(tw.color(getIconColor(index + 2)))} />
                            </LinearGradient>
                        </TouchableOpacity>
                        <TextTheme size='sm' style={tw`text-center w-[80%]`}>{type.name}</TextTheme>
                    </View>
                ))}
            </View>
        </View>
    )
}

const HomeScreen: React.FC = () => {
    useStatusBar("dark-content");
    const [locationTypes, setLocationTypes] = useState<LocationType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchLocationTypes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/v1/locations/types");
            if (response.data.success && response.data.location_type) {
                setLocationTypes(response.data.location_type);
            }
        } catch (error) {
            handleErrorMessage("ไม่สามารถดึงข้อมูลหมวดหมู่ได้ โปรดลองอีกครั้ง", true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLocationTypes();
    }, [fetchLocationTypes]);

    const renderPopularTour = ({ item }: { item: TourItem }) => {
        const height = "h-21";
        return (
            <TouchableOpacity style={tw`flex-row bg-white items-start rounded-xl mb-3 overflow-hidden ${height}`}>
                <Image source={{ uri: item.image }} style={tw`w-20 ${height}`} />
                <View style={tw`flex-1 p-2`}>
                    <TextTheme font='Prompt-Regular' size='sm'>{item.name}</TextTheme>
                    <TextTheme numberOfLines={3} font='Prompt-Light' size='xs' style={tw` text-gray-600`}>{item.description}</TextTheme>
                </View>
            </TouchableOpacity>
        )
    };

    const popularTours = [
        { name: 'หมู่บ้านแม่กำปอง', description: 'บ้านแม่กำปอง หมู่บ้านที่ซ่อนตัวอยู่ในหุบเขา เนื่องจากภูมิประเทศส่วนใหญ่เป็นดอนและมีความสูงกว่าระดับน้ำทะเลถึง 1,300 เมตร จึงทำให้ที่นี่มีอากาศเย็น', image: 'https://cms.dmpcdn.com/travel/2021/07/29/31b47440-f028-11eb-8217-8759e1bcd621_webp_original.jpg' },
        { name: 'น้ําตกแม่กำปอง', description: '', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtxcron-Jb7a_3RiMyunIzxmAtGXE5GHzxYA&s' },
        { name: 'โรงพยาบาลแม่ออน', description: '', image: 'https://www.maeonhospital.go.th/wp-content/uploads/2019/04/maeon2-1600x1064.jpg' },
        { name: 'น้ำพุร้อนสันกำแพง', description: 'น้ำพุร้อนสันกำแพง แหล่งท่องเที่ยวธรรมชาติ และสถานที่บำบัดโรคชื่อดังของ จังหวัดเชียงใหม่ เดิมอยู่ใน อำเภอสันกำแพง แต่ปัจจุบันได้จัดให้อยู่ใน อำเภอแม่ออน', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOe3uCMbSKwiTXi8BKLXS_mzPKywaRJcfGYw&s' },
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
                {!loading && <Menu locationTypes={locationTypes} />}
                <View style={tw`flex-row justify-between items-center mt-2 px-5`}>
                    <TextTheme font='Prompt-SemiBold' size='xl'>แนะนำ</TextTheme>
                    <TouchableOpacity style={tw`flex-row items-center`}>
                        <TextTheme color="blue-500">ดูเพิ่มเติม</TextTheme>
                        <Ionicons name="arrow-forward-circle" size={25} color={String(tw`text-blue-500`.color)} />
                    </TouchableOpacity>
                </View>

                <Carousel pageControlProps={{ size: 6, spacing: 8 }} pageWidth={200} style={tw`mt-2`}>
                    {popularTours.map((tour, index) => (
                        <View key={`tour-${index}`} style={tw`rounded-xl h-50 relative`}>
                            <Image source={{ uri: tour.image }} style={tw`w-full h-50 rounded-2xl`} />
                            <BlurView intensity={10} style={tw`absolute bottom-2 left-2 px-2 rounded-xl overflow-hidden`}>
                                <TextTheme font="Prompt-Medium" size="lg" color='white'>{tour.name}</TextTheme>
                            </BlurView>
                        </View>
                    ))}
                </Carousel>

                <View style={tw`mx-5 mt-4 mb-20`}>
                    <TextTheme font="Prompt-Medium" size="lg" style={tw`mb-3`}>สถานที่ท่องเที่ยวแนะนำ</TextTheme>
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
export default HomeScreen;