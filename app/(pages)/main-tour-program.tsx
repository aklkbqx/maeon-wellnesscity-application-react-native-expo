import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import TextTheme from '@/components/TextTheme';
import tw from 'twrnc';
import { formatDateThai } from '@/helper/my-lib';

interface SelectedDate {
  date: string;
  startTime: string;
  endTime: string;
  selectedProgramType?: string;
  selectedProgram?: string;
}

const TourProgramSelection: React.FC = () => {
  const { parsedDates, programType, dateIndex } = useLocalSearchParams();
  const dates: SelectedDate[] = JSON.parse(parsedDates as string);
  const selectedDateIndex = parseInt(dateIndex as string);

  const handleProgramSelect = (program: string) => {
    const updatedDates = [...dates];
    updatedDates[selectedDateIndex] = {
      ...updatedDates[selectedDateIndex],
      startTime: "09:00",
      endTime: "17:00",
      selectedProgramType: programType as string,
      selectedProgram: program
    };

    router.navigate({
      pathname: '/travel-itinerary',
      params: { updatedDates: JSON.stringify(updatedDates) }
    });
  };

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
      <TextTheme font="Prompt-Bold" size="2xl" style={tw`mb-4`}>
        เลือกโปรแกรมการท่องเที่ยว
      </TextTheme>

      <TextTheme font="Prompt-SemiBold" size="lg" style={tw`mb-4 text-gray-600`}>
        ประเภทโปรแกรม: {programType}
      </TextTheme>

      <TextTheme font="Prompt-Medium" size="base" style={tw`mb-4 text-gray-500`}>
        วันที่เลือก: {formatDateThai(dates[selectedDateIndex].date)}
      </TextTheme>

      <TextTheme font="Prompt-Medium" size="base" style={tw`mb-4 text-gray-500`}>
        เวลา: 09:00 - 17:00
      </TextTheme>

      <TouchableOpacity
        style={tw`bg-teal-500 rounded-xl p-4 mb-4`}
        onPress={() => handleProgramSelect("โปรแกรมระยะสั้น (One-day trip) 8 ชม.")}
      >
        <TextTheme font="Prompt-SemiBold" size="lg" style={tw`text-white`}>
          โปรแกรมระยะสั้น (One-day trip) 8 ชม.
        </TextTheme>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-teal-500 rounded-xl p-4 mb-4`}
        onPress={() => handleProgramSelect("Wellness ใน 8 โปรแกรมท่องเที่ยว")}
      >
        <TextTheme font="Prompt-SemiBold" size="lg" style={tw`text-white`}>
          Wellness ใน 8 โปรแกรมท่องเที่ยว
        </TextTheme>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-teal-500 rounded-xl p-4 mb-4`}
        onPress={() => handleProgramSelect("โปรแกรมฟื้นฟูสุขภาพ (Long-day trip)")}
      >
        <TextTheme font="Prompt-SemiBold" size="lg" style={tw`text-white`}>
          โปรแกรมฟื้นฟูสุขภาพ (Long-day trip)
        </TextTheme>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TourProgramSelection;