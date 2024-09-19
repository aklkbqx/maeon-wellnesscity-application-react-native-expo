import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import TextTheme from '@/components/TextTheme';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

const selectdatatime = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<string>('');
  // const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
  //     { id: 1, start: '09:00', end: '18:00' },
  //     { id: 2, start: '08:00', end: '18:00' },
  //     { id: 3, start: '09:00', end: '18:00' },
  // ]);

  const onDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
  }, []);

  const onMonthChange = (month: DateData) => {
    setCurrentMonth(month.dateString);
  };

  const renderArrow = (direction: 'left' | 'right'): React.ReactNode => (
    <Ionicons
      name={direction === 'left' ? 'chevron-back-circle' : 'chevron-forward-circle'}
      size={24}
      color={`${tw`text-teal-500`.color}`}
    />
  );

  const renderHeader = (date: Date): React.ReactNode => {
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear() + 543;
    return (
      <TextTheme font='Prompt-SemiBold' size='lg' style={tw`text-teal-500`}>
        {`${month} ${year}`}
      </TextTheme>
    );
  };
  return (
    <View style={tw`flex-1 bg-slate-100 px-5`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`py-5`}>
          <TextTheme font='Prompt-SemiBold' size='2xl' style={tw`text-black`}>เลือกวันเวลา</TextTheme>
        </View>

        <View style={tw`rounded-2xl border border-slate-200 overflow-hidden`}>
          <Calendar
            current={currentMonth}
            onDayPress={onDayPress}
            onMonthChange={onMonthChange}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: `${tw`text-teal-500`.color}` },
            }}
            renderArrow={renderArrow}
            renderHeader={renderHeader}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: `${tw`text-teal-500`.color}`,
              selectedDayTextColor: '#ffffff',
              todayTextColor: `${tw`text-teal-500`.color}`,
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: `${tw`text-teal-500`.color}`,
              selectedDotColor: '#ffffff',
              arrowColor: `${tw`text-teal-500`.color}`,
              monthTextColor: `${tw`text-teal-500`.color}`,
              indicatorColor: `${tw`text-teal-500`.color}`,
              textDayFontFamily: 'Prompt-Regular',
              textMonthFontFamily: 'Prompt-SemiBold',
              textDayHeaderFontFamily: 'Prompt-Medium',
            }}
          />
        </View>

        <TouchableOpacity style={tw`rounded-2xl p-2 bg-teal-500 mt-5`}>
          <TextTheme font='Prompt-SemiBold' size='lg' style={tw`text-white text-center`}>ถัดไป</TextTheme>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default selectdatatime