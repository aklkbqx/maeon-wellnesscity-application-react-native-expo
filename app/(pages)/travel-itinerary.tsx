import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { Dialog, Image, PanningProvider } from 'react-native-ui-lib';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TextTheme from '@/components/TextTheme';
import tw from 'twrnc';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { formatDateThai } from '@/helper/my-lib';
import useUser from '@/hooks/useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useShowToast from '@/hooks/useShowToast';
import api from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';
import { ProgramDetail } from '@/types/programs';
import { useStatusBar } from '@/hooks/useStatusBar';
import Loading from '@/components/Loading';

interface BookingItem {
  people: number;
  start_date: string;
  end_date: string;
  booking_detail: {
    program_id: number;
    date: string;
  }[]
}
interface BookingDetail {
  program_id: number;
  date: string;
}

const TravelItineraryScreen: React.FC = () => {
  useStatusBar("dark-content");
  const { dataForBooking } = useLocalSearchParams();
  const { checkLoginStatus } = useUser();
  const [dialoglVisible, setDialoglVisible] = useState(false);
  const [dateSelected, setDateSelected] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [bookingData, setBookingData] = useState<BookingItem>(() => {
    try {
      return JSON.parse((dataForBooking as string) || '[]');
    } catch {
      handleErrorMessage('มีข้อผิดพลาดบางอย่างเกิดขึ้น');
      return [];
    }
  });

  const handleBackPress = useCallback(() => {
    Alert.alert(
      "เตือน",
      "แน่ใจไหมที่จะย้อนกลับ การจัดเวลาการท่องเที่ยวทั้งหมดของคุณจะหายไป",
      [
        { text: "ยกเลิก" },
        { text: "ตกลง", onPress: () => router.back() },
      ]
    );
    return true;
  }, []);
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      const restoreState = async () => {
        const lastItinerary = await AsyncStorage.getItem('lastTravelItinerary');
        if (lastItinerary) {
          setBookingData(JSON.parse(lastItinerary));
        }
      };

      restoreState();
      return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }, [handleBackPress])
  );

  const selectedTypeProgram = (programtypeId: number) => {
    setDialoglVisible(false);
    if (programtypeId === 1 || programtypeId === 2) {
      router.navigate({
        pathname: '/main-tour-program',
        params: {
          bookingData: JSON.stringify(bookingData),
          dateSelected
        },
      });
    } else if (programtypeId === 3) {
      router.navigate({
        pathname: '/(custom-tour-program)',
        params: {
          bookingData: JSON.stringify(bookingData),
          dateSelected
        },
      });
    } else {
      handleErrorMessage('ไม่รู้จักประเภทของโปรแกรม')
    }
  };

  useEffect(() => {
    if (!dialoglVisible) {
      setDateSelected("");
    }
  }, [dialoglVisible]);


  const handleProceedBooking = async () => {
    setLoading(true);
    const { login } = await checkLoginStatus();
    if (!login) {
      await AsyncStorage.setItem('lastTravelItinerary', JSON.stringify(bookingData));
      router.navigate({
        pathname: '/login',
        params: {
          backToPage: "/travel-itinerary"
        }
      });
      useShowToast("info", "คำแนะนำ", "กรุณาเข้าสู่ระบบก่อนทำการจอง");
      setLoading(false);
    } else {
      try {
        const response = await api.post("/api/v1/bookings/start-booking", { ...bookingData });
        if (response.data.success) {
          router.navigate({
            pathname: '/payment',
            params: {
              bookingId: response.data.booking_id
            }
          });
          const lastTravelItinerary = await AsyncStorage.getItem('lastTravelItinerary');
          if (lastTravelItinerary) {
            await AsyncStorage.removeItem('lastTravelItinerary');
          }
        }
      } catch {
        setLoading(false);
        handleErrorMessage("ไม่สามารถดำเนินการจองได้ในขณะนี้ โปรดลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    }
  };


  const handelDeleteDate = async (date: string) => {
    const updatedBookingData = {
      ...bookingData,
      booking_detail: bookingData.booking_detail.filter(item => item.date !== date)
    };

    setBookingData(updatedBookingData);

    try {
      await AsyncStorage.setItem('lastTravelItinerary', JSON.stringify(updatedBookingData));
      useShowToast("success", "สำเร็จ", "ลบวันที่เลือกออกจากแผนการท่องเที่ยวแล้ว");
    } catch (error) {
      handleErrorMessage('ไม่สามารถบันทึกการเปลี่ยนแปลงได้');
    }
  }

  const handleProgramSelection = (date: string) => {
    setDateSelected(date);
    setDialoglVisible(true);
  };

  return (
    <View style={tw`flex-1 relative bg-slate-100`}>
      {loading && <Loading loading={loading} type='full' />}
      
      <ScrollView style={tw`flex-1 px-4`}>
        <View style={tw`mb-6 mt-5 relative`}>
          {bookingData.booking_detail && bookingData.booking_detail.length > 0 ? (
            bookingData.booking_detail.map((item, index) => (
              <DateItem
                key={index}
                item={item}
                index={index}
                onPress={() => handleProgramSelection(item.date)}
                onDetailsPress={() => { }}
                isLast={index === bookingData.booking_detail.length - 1}
                handelDeleteDate={() => handelDeleteDate(item.date)}
                length={bookingData.booking_detail.length}
              />
            ))
          ) : (
            <TextTheme style={tw`text-center mt-4`}>ไม่มีข้อมูลการจองในขณะนี้</TextTheme>
          )}
        </View>
      </ScrollView>

      <View style={tw`p-4 mb-2`}>
        <TouchableOpacity style={tw`${bookingData.booking_detail.every((date) => date.program_id) ? 'opacity-100' : 'opacity-50'}`}
          disabled={!bookingData.booking_detail.every((date) => date.program_id)}
          onPress={handleProceedBooking}>
          <LinearGradient style={tw`rounded-2xl py-3 items-center`} colors={[String(tw.color("blue-400")), String(tw.color("blue-500"))]}>
            <TextTheme font="Prompt-SemiBold" size="lg" style={tw`text-white`}>
              ดำเนินการจอง
            </TextTheme>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Dialog
        visible={dialoglVisible}
        panDirection={PanningProvider.Directions.DOWN}
        onDismiss={() => setDialoglVisible(false)}
        overlayBackgroundColor="rgba(0, 0, 0, 0.5)"
      >
        <View style={tw`rounded-2xl overflow-hidden`}>
          <View style={tw`border-b border-zinc-200 p-4 bg-white`}>
            <View style={tw`flex-row items-center justify-between`}>
              <Ionicons name="close" size={30} color={tw.color('blue-500/0')} style={tw`opacity-0`} />
              <TextTheme font="Prompt-SemiBold" size="xl">
                เลือกรูปแบบท่องเที่ยว
              </TextTheme>
              <TouchableOpacity onPress={() => setDialoglVisible(false)} style={tw``}>
                <Ionicons name="close" size={30} color={tw.color('blue-500')} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={tw`p-5 bg-slate-50`}>
            <ProgramSelectMenu onSelect={selectedTypeProgram} />
          </View>
        </View>
      </Dialog>
    </View>
  );
};

const BlurredImage: React.FC<{ image: number; blurAmount: number }> = ({ image, blurAmount = 5 }) => (
  <View style={tw`relative`}>
    <Image source={image} style={tw`w-full h-full`} />
    <BlurView intensity={blurAmount} tint="regular" style={tw`absolute inset-0`} />
  </View>
);

const ProgramSelectMenu: React.FC<{ onSelect: (programtypeId: number) => void }> = ({ onSelect }) => {
  const programSelectMenu = [
    { image: require("@/assets/images/main-program.png"), text: "โปรแกรมการท่องเที่ยวหลัก", id: 1 },
    { image: require("@/assets/images/custom-program.png"), text: "เลือกการท่องเที่ยวด้วยตนเอง", id: 3 },
  ];

  return (
    <View style={tw`flex-col gap-5 justify-center items-center`}>
      {programSelectMenu.map(({ image, text, id }, index) => (
        <TouchableOpacity
          key={`menu-${index}`}
          style={tw`bg-slate-500 rounded-xl w-[214px] h-[175px] overflow-hidden relative`}
          onPress={() => onSelect(id)}
        >
          <BlurredImage image={image} blurAmount={5} />
          <View style={tw`absolute inset-0 bg-blue-600 bg-opacity-30 justify-center items-center`}>
            <TextTheme font='Prompt-SemiBold' color='white' size='xl' style={tw`text-center px-3`}>
              {text}
            </TextTheme>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const DateItem: React.FC<{
  item: BookingDetail;
  index: number;
  onPress: () => void;
  onDetailsPress: () => void;
  isLast: boolean;
  handelDeleteDate: () => void;
  length: number
}> = ({ item, index, onPress, onDetailsPress, isLast, handelDeleteDate, length }) => {
  const [programData, setProgramData] = useState<ProgramDetail>();
  const [dialogDeleteDate, setDialogDeleteDate] = useState<boolean>(false);

  const fetchProgram = async () => {
    if (item.program_id) {
      try {
        const response = await api.get(`/api/v1/programs/${item.program_id}`);
        if (response.data.success) {
          setProgramData(response.data.programDetail)
        }
      } catch (error) {
        handleErrorMessage("ไม่สามารถโหลดข้อมูลโปรแกรมได้");
      }
    }
  }
  useEffect(() => {
    if (item.program_id) {
      fetchProgram();
    }
  }, [item])
  return (
    <View style={tw`flex-row items-start mb-4`}>
      <View style={tw`w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-4 z-99`}>
        <TextTheme font="Prompt-SemiBold" size="lg" style={tw`text-white`}>
          {index + 1}
        </TextTheme>
      </View>
      {!isLast && (
        <View
          style={[tw`bg-blue-500 w-2 absolute left-3 z-999 opacity-50`,
          { height: programData ? 100 : 42, top: 30 },
          ]}
        />
      )}
      <View style={tw`flex-1`}>
        <Animatable.View animation={programData ? "" : "pulse"} easing="ease" iterationCount="infinite" duration={1500}>
          <TouchableOpacity disabled={programData ? true : false}
            onPress={onPress}
            style={tw`bg-white border ${programData ? " border-blue-400 mx-2" : 'border-gray-200 mx-2'} rounded-2xl p-3`}
          >
            <View style={tw`flex-row justify-between items-center`}>
              <TextTheme font="Prompt-SemiBold" size="lg" style={tw`text-black`}>
                {formatDateThai(item.date)}
              </TextTheme>

              {programData ? (
                <TextTheme font="Prompt-Medium" size="base" style={tw`text-gray-600`}>
                  {programData.start.time} - {programData.end.time}
                </TextTheme>
              ) : (
                <Ionicons name='chevron-forward-sharp' />
              )}
            </View>
            {item.program_id && (
              <View style={tw`flex-col mt-2`}>
                <TextTheme font="Prompt-Regular" size="sm" style={tw`text-gray-500`}>
                  {programData?.type}
                </TextTheme>
                <View style={tw`flex-row gap-2 justify-between items-center`}>
                  <View style={tw`flex-row gap-2`}>
                    <TouchableOpacity onPress={onDetailsPress} style={tw`mt-2 flex-row justify-center`}>
                      <TextTheme font="Prompt-SemiBold" size="sm" style={tw`text-blue-500`}>
                        รายละเอียด
                      </TextTheme>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPress} style={tw`mt-2 flex-row justify-center`}>
                      <TextTheme font="Prompt-SemiBold" size="sm" style={tw`text-amber-500`}>
                        เปลี่ยน
                      </TextTheme>
                    </TouchableOpacity>
                  </View>
                  {length !== 1 ? (
                    <>
                      <TouchableOpacity onPress={() => setDialogDeleteDate(true)} style={tw`mt-2 flex-row justify-center`}>
                        <Ionicons name='trash' size={18} color={String(tw.color("red-500"))} />
                      </TouchableOpacity>

                      <Dialog
                        visible={dialogDeleteDate}
                        onDismiss={() => setDialogDeleteDate(false)}
                        panDirection={PanningProvider.Directions.RIGHT}
                      >
                        <View style={tw`flex-row justify-center`}>
                          <View style={tw`w-[70%] rounded-2xl overflow-hidden`}>
                            <View style={tw`border-b border-zinc-200 p-2 bg-white`}>
                              <TextTheme>ยืนยันการลบ!</TextTheme>
                            </View>
                            <View style={tw`p-5 bg-slate-50`}>
                              <TextTheme style={tw`text-center`}>
                                {"คุณแน่ใจหรือไม่ที่จะลบวันนี้ออกจากแผนการท่องเที่ยว"}
                              </TextTheme>
                            </View>
                            <View style={tw`border-t flex-row justify-between border-zinc-200 p-2 gap-2 bg-white`}>
                              <TouchableOpacity onPress={() => setDialogDeleteDate(false)} style={tw`flex-1 bg-zinc-200 rounded-xl justify-center flex-row p-1`}>
                                <TextTheme>ยกเลิก</TextTheme>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={handelDeleteDate} style={tw`flex-1 bg-red-500 rounded-xl justify-center flex-row p-1`}>
                                <TextTheme style={tw`text-white`}>ลบ</TextTheme>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </Dialog>
                    </>
                  ) : null}
                </View>
              </View>
            )}
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </View>
  )
}


export default TravelItineraryScreen;
