import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Calendar, DateData } from '@/helper/react-native-calendars-packageMod';
import TextTheme from '@/components/TextTheme';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTabBar } from '@/context/TabBarContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '@/components/Loading';
import api from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';
import * as Animatable from 'react-native-animatable';

interface MarkedDates {
  [date: string]: {
    startingDay?: boolean;
    endingDay?: boolean;
    selected?: boolean;
    color: string;
    textColor: string;
  };
}

const SelectDateTime: React.FC = () => {
  const { hideTabBar, showTabBar } = useTabBar();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [markType, setMarkType] = useState<string>("dot");
  const [loading, setLoading] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const handleNumberOfPeopleChange = (increment: number) => {
    setNumberOfPeople(prevNumber => Math.max(1, prevNumber + increment));
  };

  const onDayPress = useCallback((day: DateData) => {
    if (!isDateSelectable(day.dateString)) {
      return;
    }

    if (startDate && startDate === day.dateString) {
      setStartDate(null);
      setEndDate(null);
      setMarkType("dot");
    } else if (endDate && endDate === day.dateString) {
      setEndDate(null);
      setMarkType("dot");
    } else if (startDate && !endDate) {
      setMarkType("period");
      const start = new Date(startDate);
      const end = new Date(day.dateString);
      if (end < start) {
        setEndDate(startDate);
        setStartDate(day.dateString);
      } else {
        setEndDate(day.dateString);
      }
    } else {
      setMarkType("dot");
      setStartDate(day.dateString);
      setEndDate(null);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const newMarkedDates: MarkedDates = {};

    if (startDate) {
      newMarkedDates[startDate] = {
        startingDay: true,
        color: String(tw.color('blue-500')),
        textColor: 'white',
        selected: true,
      };

      if (endDate) {
        newMarkedDates[endDate] = {
          endingDay: true,
          color: String(tw.color('blue-600')),
          textColor: 'white',
          selected: true
        };

        let currentDate = new Date(startDate);
        const lastDate = new Date(endDate);
        while (currentDate < lastDate) {
          currentDate.setDate(currentDate.getDate() + 1);
          const dateString = currentDate.toISOString().split('T')[0];
          if (dateString !== endDate) {
            newMarkedDates[dateString] = {
              color: String(tw.color('blue-400')),
              textColor: 'white',
              selected: true,

            };
          }
        }
      }
    }

    setMarkedDates(newMarkedDates);
  }, [startDate, endDate]);

  useFocusEffect(useCallback(() => {
    hideTabBar();
    return () => showTabBar()
  }, [hideTabBar, showTabBar]));



  const formatDataForBooking = () => {
    const bookingDetail = selectedDates.map(date => ({
      program_id: null,
      date: date.toISOString().split('T')[0]
    }));

    return {
      people: numberOfPeople,
      start_date: startDate,
      end_date: endDate || startDate,
      booking_detail: bookingDetail
    };
  };

  const handleConfirm = async () => {
    if (startDate) {
      const lastItinerary = await AsyncStorage.getItem('lastTravelItinerary');
      if (lastItinerary) {
        await AsyncStorage.removeItem('lastTravelItinerary');
      }
      router.navigate({
        pathname: '/travel-schedules/',
        params: {
          dataForBooking: JSON.stringify(formatDataForBooking())
        }
      });
    } else {
      Alert.alert(
        "ไม่ได้เลือกวันที่",
        "กรุณาเลือกวันที่อย่างน้อยหนึ่งวัน",
        [{ text: "ตกลง" }]
      );
    }
  };

  const isDateSelectable = (dateString: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate > today;
  };

  const selectedDates = useMemo(() => {
    if (!startDate) return [];
    if (!endDate) return [new Date(startDate)];

    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, [startDate, endDate]);

  const renderArrow = (direction: 'left' | 'right'): React.ReactNode => (
    <Ionicons
      name={direction === 'left' ? 'chevron-back-sharp' : 'chevron-forward-sharp'}
      size={24}
      color={tw.color('blue-500')}
    />
  );

  const renderHeader = (date: Date): React.ReactNode => {
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear() + 543;
    return (
      <TextTheme font='Prompt-SemiBold' size='lg' style={tw`text-blue-500`}>
        {`${month} ${year}`}
      </TextTheme>
    );
  };

  const [todyDateState, setTodyDateState] = useState<string>('');

  useEffect(() => {
    fetchThaiTime();
  }, []);

  const fetchThaiTime = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/v1/datetime");
      if (response.data) {
        const formattedDateMinDate = response.data.split("T")[0]
        setTodyDateState(formattedDateMinDate);
      }
    } catch (error) {
      handleErrorMessage(`ไม่สามารถโหลดข้อมูลปฏิทินไทยได้ในขณะนี้\nโปรดลองอีกครั้ง`, true);
    } finally {
      setLoading(false);
    }
  };


  const formatDateThaiTypeDate = (date: Date): string => {
    const day = date.getDate();
    const monthNames = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };


  const displaySelectedDates = () => {
    if (selectedDates.length === 1) {
      return (
        <View>
          <TextTheme font='Prompt-SemiBold' size='base' style={tw`text-gray-700`}>
            {formatDateThaiTypeDate(selectedDates[0])}
          </TextTheme>
        </View>
      );
    } else if (selectedDates.length > 1) {
      const firstDate = selectedDates[0];
      const lastDate = selectedDates[selectedDates.length - 1];
      return (
        <TextTheme font='Prompt-SemiBold' size='base' style={tw`text-gray-700`}>
          {`${formatDateThaiTypeDate(firstDate)} ถึง ${formatDateThaiTypeDate(lastDate)}`}
        </TextTheme>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={tw`flex-1 flex-row justify-center items-start bg-slate-100`}>
        <Loading loading={loading} />
      </View>
    )
  }

  return (
    <LinearGradient colors={[String(tw.color("white")), String(tw.color("slate-200"))]} style={tw`flex-1 bg-slate-100 px-5`}>
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>

        <View style={tw`mt-1 pb-3`}>
          <TextTheme font='Prompt-SemiBold' size='2xl' style={tw`text-slate-700 pt-3`}>เลือกช่วงวัน</TextTheme>
          <View style={tw`flex-row items-center gap-2`}>
            <TextTheme font='Prompt-Light' size='base' style={tw`text-slate-700`}>ที่คุณต้องการจะท่องเที่ยว</TextTheme>
            <Ionicons name='calendar' size={20} style={tw`text-blue-500`} />
          </View>
        </View>

        <View style={tw`rounded-2xl border border-slate-200 overflow-hidden mb-5 z-99`}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            renderArrow={renderArrow}
            renderHeader={renderHeader}
            markingType={markType}
            enableSwipeMonths
            currentDate={todyDateState}
            theme={{
              'stylesheet.calendar.header': {
                dayTextAtIndex0: { color: String(tw.color("red-400")) },
                dayTextAtIndex1: { color: String(tw.color("yellow-400")) },
                dayTextAtIndex2: { color: String(tw.color("pink-400")) },
                dayTextAtIndex3: { color: String(tw.color("green-400")) },
                dayTextAtIndex4: { color: String(tw.color("orange-400")) },
                dayTextAtIndex5: { color: String(tw.color("blue-400")) },
                dayTextAtIndex6: { color: String(tw.color("purple-400")) }
              },
              backgroundColor: String(tw.color("white")),
              calendarBackground: String(tw.color("white")),
              textSectionTitleColor: String(tw.color("slate-400")),
              selectedDayBackgroundColor: String(tw.color('blue-500')),
              selectedDayTextColor: String(tw.color("white")),
              todayTextColor: String(tw.color('blue-500')),
              dayTextColor: String(tw.color("black")),
              textDisabledColor: String(tw.color("slate-200")),
              dotColor: String(tw.color('blue-500')),
              selectedDotColor: String(tw.color("white")),
              arrowColor: String(tw.color('blue-500')),
              monthTextColor: String(tw.color('blue-500')),
              indicatorColor: String(tw.color('blue-500')),
              textDayFontFamily: 'Prompt-Regular',
              textMonthFontFamily: 'Prompt-SemiBold',
              textDayHeaderFontFamily: 'Prompt-Medium',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
            }}
          />
        </View>

        {selectedDates.length > 0 && (
          <View>
            <Animatable.View duration={500} animation={selectedDates.length > 0 ? "fadeInDown" : "fadeInUp"} style={tw``}>
              <View style={tw`flex-1 flex-row`}>
                <View style={tw`flex-1 basis-[50%]`}>
                  <TextTheme font='Prompt-SemiBold' size='lg' style={tw`text-blue-500 pt-1`}>
                    ไปเที่ยว {selectedDates.length} วัน
                  </TextTheme>
                  {displaySelectedDates()}
                </View>
                <View style={tw`flex-col basis-[30%]`}>
                  <TextTheme font='Prompt-SemiBold' size='lg' style={tw`text-blue-500 text-center`}>
                    จำนวนคน
                  </TextTheme>
                  <View style={tw`flex-row items-center justify-between`}>
                    <TouchableOpacity onPress={() => handleNumberOfPeopleChange(-1)} style={tw`p-2`}>
                      <Ionicons name="remove-circle-outline" size={24} color={tw.color('blue-500')} />
                    </TouchableOpacity>
                    <TextTheme font='Prompt-SemiBold' size='lg' style={tw`text-slate-700`}>
                      {numberOfPeople}
                    </TextTheme>
                    <TouchableOpacity onPress={() => handleNumberOfPeopleChange(1)} style={tw`p-2`}>
                      <Ionicons name="add-circle-outline" size={24} color={tw.color('blue-500')} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animatable.View>
            <TouchableOpacity onPress={handleConfirm} style={tw`mt-2`}>
              <LinearGradient style={tw`mt-3 p-2 rounded-xl`} colors={[String(tw.color("blue-400")), String(tw.color("blue-500"))]}>
                <TextTheme font='Prompt-SemiBold' size='base' style={tw`text-white text-center`}>
                  ยืนยันการเลือก
                </TextTheme>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={tw`pb-5`}></View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SelectDateTime;