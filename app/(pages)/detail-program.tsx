import React from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import TextTheme from '@/components/TextTheme';
import tw from 'twrnc';
import { formatDate, formatDateThai } from '@/helper/my-lib';

interface ProgramDetails {
    date: string;
    startTime: string;
    endTime: string;
    selectedProgramType?: string;
    selectedProgram?: string;
}

const DetailProgramScreen: React.FC = () => {
    const { programDetails, dateIndex } = useLocalSearchParams();
    const details: ProgramDetails = JSON.parse(programDetails as string);

    return (
        <ScrollView style={tw`flex-1 bg-white p-4`}>
            <TextTheme font="Prompt-Bold" size="2xl" style={tw`mb-4`}>
                รายละเอียดโปรแกรม
            </TextTheme>
            <TextTheme font="Prompt-SemiBold" size="lg" style={tw`mb-2`}>
                วันที่ {parseInt(dateIndex as string) + 1} : {formatDateThai(details.date)}
            </TextTheme>
            <TextTheme font="Prompt-Regular" size="base" style={tw`mb-2`}>
                เวลา: {details.startTime} - {details.endTime}
            </TextTheme>
            <TextTheme font="Prompt-SemiBold" size="lg" style={tw`mb-2`}>
                {details.selectedProgramType || 'ไม่ได้เลือกประเภทโปรแกรม'}
            </TextTheme>
            <TextTheme font="Prompt-Regular" size="base" style={tw`mb-2`}>
                โปรแกรมที่เลือก: {details.selectedProgram || 'ยังไม่ได้เลือกโปรแกรม'}
            </TextTheme>
        </ScrollView>
    );
};

export default DetailProgramScreen;