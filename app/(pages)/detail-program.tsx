import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import api, { apiUrl } from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';
import { Ionicons } from '@expo/vector-icons';
import Loading from '@/components/Loading';
import TextTheme from '@/components/TextTheme';
import { ProgramDetail } from '@/types/programs';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    interpolateColor,
    runOnJS,
} from 'react-native-reanimated';
import { StatusBar } from "expo-status-bar"
import { TabController, View, TouchableOpacity } from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BookingItem {
    people: number;
    start_date: string;
    end_date: string;
    booking_detail: {
        program_id: number;
        date: string;
    }[]
}

const DetailProgramScreen: React.FC = () => {
    const { programId, bookingData, dateSelected } = useLocalSearchParams();

    const [parseJsonBookingData, setParseJsonBookingData] = useState<BookingItem>(() => {
        try {
            return JSON.parse((bookingData as string) || '[]');
        } catch {
            handleErrorMessage('Failed to parse initial dates');
            return [];
        }
    });
    const [programDetail, setProgramDetail] = useState<ProgramDetail | null>(null);
    const [statusbarStyle, setStatusbarStyle] = useState<"light" | "dark">("light");

    const fetchProgramFormId = useCallback(async () => {
        try {
            const response = await api.get(`/api/v1/programs/${parseInt(programId as string)}`);
            if (response.data.success) {
                setProgramDetail(response.data.programDetail);
            }
        } catch (error) {
            handleErrorMessage('ไม่สามารถโหลดข้อมูลของโปรแกรมที่เลือกได้ กรุณาลองใหม่อีกครั้ง', true);
        }
    }, [parseInt(programId as string)]);

    useEffect(() => {
        fetchProgramFormId();
    }, [fetchProgramFormId]);

    const IMAGE_HEIGHT = 300;
    const IMAGE_WIDTH = '100%';
    const scrollY = useSharedValue(0);

    const updateStatusBarStyle = (isScrolled: boolean) => {
        setStatusbarStyle(isScrolled ? 'dark' : 'light');
    };

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
            runOnJS(updateStatusBarStyle)(event.contentOffset.y > IMAGE_HEIGHT);
        },
    });

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollY.value,
                        [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
                        [-IMAGE_HEIGHT / 2, 0, IMAGE_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(
                        scrollY.value,
                        [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
                        [2, 1, 1]
                    ),
                }
            ]
        };
    });
    const selectThisProgram = async () => {
        const updatedBookingData = {
            ...parseJsonBookingData,
            booking_detail: parseJsonBookingData.booking_detail.map(item =>
                item.date === dateSelected
                    ? {
                        ...item,
                        program_id: parseInt(programId as string)
                    }
                    : item
            )
        };

        setParseJsonBookingData(updatedBookingData);

        try {
            await AsyncStorage.setItem('lastTravelItinerary', JSON.stringify(updatedBookingData));

            router.navigate({
                pathname: "/travel-itinerary",
                params: {
                    dataForBooking: JSON.stringify(updatedBookingData)
                }
            });
        } catch (error) {
            console.error('Error saving booking data:', error);
        }
    };


    // selectedDates: JSON.stringify(selectedDatesData),
    // numberOfPeople

    if (!programDetail) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Loading loading={true} />
            </View>
        );
    }

    const images = programDetail.program_images ? JSON.parse(programDetail.program_images.image_name_data) : [];
    const firstImageName = images.length > 0 ? images[0] : null;

    return (
        <View style={tw`flex-1 relative`}>
            <StatusBar style={statusbarStyle} />
            <Stack.Screen options={{
                headerTransparent: true,
                headerShown: true,
                header: () => (
                    <Animated.View style={tw`w-full ios:pt-14 android:pt-7.5 pb-1 justify-between flex-row px-5 items-center gap-2`}>
                        <TouchableOpacity onPress={() => router.back()} style={tw`bg-black/60 p-2 rounded-full overflow-hidden`}>
                            <Ionicons name="chevron-back" size={24} color={tw.color('white')} />
                        </TouchableOpacity>
                        <View style={tw`flex-row items-center gap-5`}>
                            <TouchableOpacity onPress={() => { }} style={tw`bg-black/60 p-2 rounded-full overflow-hidden`}>
                                <Ionicons name="share-outline" size={24} color={tw.color('white')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { }} style={tw`bg-black/60 p-2 rounded-full overflow-hidden`}>
                                <Ionicons name="heart-outline" size={24} color={tw.color('white')} />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )
            }} />

            <View style={tw`flex-1`}>
                <Animated.ScrollView
                    style={tw`flex-1 bg-white`}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    stickyHeaderIndices={[1]}
                    contentContainerStyle={tw`pb-20`}
                >
                    {firstImageName && (
                        <Animated.Image
                            style={[{ height: IMAGE_HEIGHT, width: IMAGE_WIDTH }, imageAnimatedStyle]}
                            source={{ uri: `${apiUrl}/images/program_images/${firstImageName}` }}
                        />
                    )}
                    {programDetail && <ProgramTabs programDetail={programDetail} />}
                </Animated.ScrollView>

                <View style={tw`p-4 absolute bottom-2 left-0 right-0`}>
                    <TouchableOpacity onPress={selectThisProgram}>
                        <LinearGradient style={tw`rounded-2xl py-3 items-center`} colors={[String(tw.color("blue-400")), String(tw.color("blue-500"))]}>
                            <TextTheme font="Prompt-SemiBold" size="lg" style={tw`text-white`}>
                                เลือกโปรแกรมนี้
                            </TextTheme>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};

export default DetailProgramScreen;


const ProgramTabs: React.FC<{ programDetail: ProgramDetail }> = ({ programDetail }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [items] = useState([
        { label: 'ภาพรวม', key: 'overview' },
        { label: 'รายละเอียด', key: 'details' }
    ]);

    const renderOverview = () => (
        <View style={tw`flex-1 bg-white p-5`}>
            <TextTheme font="Prompt-Bold" size="xl" style={tw`mb-2`}>{programDetail?.name}</TextTheme>
            <TextTheme font="Prompt-Regular" size="base" style={tw`mb-4`}>{programDetail?.description}</TextTheme>
        </View>
    );

    const renderDetails = () => (
        <View style={tw`flex-1 bg-white p-5`}>
            <TextTheme font="Prompt-Medium" size="lg" style={tw`mb-2`}>ประเภทโปรแกรม</TextTheme>
            <TextTheme font="Prompt-Regular" size="base" style={tw`mb-4`}>{programDetail?.type}</TextTheme>
        </View>
    );

    return (
        <View>
            <View style={tw`flex-1 rounded-t-5 overflow-hidden absolute top-[-5]`}>
                <TabController
                    asCarousel
                    items={items}
                    initialIndex={selectedIndex}
                    onChangeIndex={(index) => setSelectedIndex(index)}
                >
                    <TabController.TabBar
                        labelStyle={{ fontFamily: "Prompt-Regular" }}
                        selectedLabelStyle={{ fontFamily: "Prompt-Regular" }}
                        selectedLabelColor={String(tw.color("blue-500"))}
                        selectedIconColor={String(tw.color("blue-500"))}
                        iconColor={String(tw.color("blue-500"))}
                        indicatorStyle={tw`bg-blue-500 h-0.5 rounded-full`}
                    />
                    <TabController.PageCarousel>
                        <TabController.TabPage index={0}>
                            {renderOverview()}
                        </TabController.TabPage>
                        <TabController.TabPage index={1}>
                            {renderDetails()}
                        </TabController.TabPage>
                    </TabController.PageCarousel>
                </TabController>

            </View>
        </View>
    );
};