import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, Alert, BackHandler } from 'react-native';
import { Image } from 'react-native-ui-lib';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TextTheme from '@/components/TextTheme';
import tw from 'twrnc';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { formatDateThai } from '@/helper/my-lib';

interface SelectedDate {
  date: string;
  startTime: string;
  endTime: string;
  selectedProgramType?: string;
  selectedProgram?: string;
}

interface BlurredImageProps {
  image: number;
  blurAmount?: number;
}


const BlurredImage: React.FC<BlurredImageProps> = ({ image, blurAmount = 5 }) => (
  <View style={tw`relative`}>
    <Image source={image} style={tw`w-full h-full`} />
    <BlurView intensity={blurAmount} tint="light" style={tw`absolute inset-0`} />
  </View>
);

const ProgramSelectMenu: React.FC<{ onSelect: (program: string) => void }> = ({ onSelect }) => {
  const programSelectMenu = [
    { image: require("@/assets/images/main-program.png"), text: "โปรแกรมการท่องเที่ยวหลัก" },
    { image: require("@/assets/images/custom-program.png"), text: "เลือกการท่องเที่ยวด้วยตนเอง" },
  ];

  return (
    <View style={tw`flex-col gap-5 justify-center items-center`}>
      {programSelectMenu.map(({ image, text }, index) => (
        <TouchableOpacity
          key={`menu-${index}`}
          style={tw`bg-slate-500 rounded-xl w-[214px] h-[175px] overflow-hidden relative`}
          onPress={() => onSelect(text)}
        >
          <BlurredImage image={image} blurAmount={5} />
          <View style={tw`absolute inset-0 bg-black bg-opacity-30 justify-center items-center`}>
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
  item: SelectedDate;
  index: number;
  onPress: () => void;
  onDetailsPress: () => void;
  isLast: boolean;
}> = ({ item, index, onPress, onDetailsPress, isLast }) => (
  <View style={tw`flex-row items-start mb-4`}>
    <View style={tw`w-8 h-8 rounded-full bg-teal-500 items-center justify-center mr-4 z-99`}>
      <TextTheme font="Prompt-SemiBold" size="lg" style={tw`text-white`}>
        {index + 1}
      </TextTheme>
    </View>
    {!isLast && (
      <View
        style={[tw`bg-teal-500 w-2 absolute left-3 z-999 opacity-50`,
        { height: item.selectedProgramType ? 100 : 42, top: 30 },
        ]}
      />
    )}
    <View style={tw`flex-1`}>
      <Animatable.View animation={!item.selectedProgramType ? "pulse" : ""} easing="ease" iterationCount="infinite" duration={1500}>
        <TouchableOpacity disabled={item.selectedProgramType ? true : false}
          onPress={onPress}
          style={tw`${item.selectedProgramType ? 'border-2 border-teal-400' : 'border border-gray-200 mx-2'} rounded-2xl p-3`}
        >
          <View style={tw`flex-row justify-between`}>
            <TextTheme font="Prompt-SemiBold" size="lg" style={tw`text-black`}>
              {formatDateThai(item.date)}
            </TextTheme>
            <TextTheme font="Prompt-Medium" size="base" style={tw`text-gray-600`}>
              {item.startTime} - {item.endTime}
            </TextTheme>
          </View>
          {item.selectedProgramType && (
            <View style={tw`flex-col mt-2`}>
              <TextTheme font="Prompt-Regular" size="sm" style={tw`text-gray-500`}>
                {item.selectedProgramType}
              </TextTheme>
              <View style={tw`flex-row gap-2`}>
                <TouchableOpacity onPress={onDetailsPress} style={tw`mt-2 flex-row justify-center`}>
                  <TextTheme font="Prompt-SemiBold" size="sm" style={tw`text-teal-500`}>
                    รายละเอียด
                  </TextTheme>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPress} style={tw`mt-2 flex-row justify-center`}>
                  <TextTheme font="Prompt-SemiBold" size="sm" style={tw`text-amber-500`}>
                    เปลี่ยน
                  </TextTheme>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Animatable.View>
    </View>
  </View>
);

const TravelItineraryScreen: React.FC = () => {
  const { selectedDates, updatedDates } = useLocalSearchParams();
  const [parsedDates, setParsedDates] = useState<SelectedDate[]>(() => {
    try {
      return JSON.parse((selectedDates as string) || '[]');
    } catch {
      console.error('Failed to parse initial dates');
      return [];
    }
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);


  useEffect(() => {
    if (updatedDates) {
      try {
        const newDates = JSON.parse(updatedDates as string);
        setParsedDates(newDates);
      } catch {
        console.error('Failed to parse updated dates');
      }
    }
  }, [updatedDates]);

  const handleProgramSelection = (index: number) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const updateSelectedProgram = (program: string) => {
    if (selectedIndex !== -1) {
      setModalVisible(false);
      router.push({
        pathname: '/main-tour-program',
        params: {
          parsedDates: JSON.stringify(parsedDates),
          programType: program,
          dateIndex: selectedIndex,
        },
      });
    }
  };

  const handleDetailsPress = (index: number) => {
    router.push({
      pathname: '/detail-program',
      params: {
        programDetails: JSON.stringify(parsedDates[index]),
        dateIndex: index,
      },
    });
  };;

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
      return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }, [handleBackPress])
  );

  return (
    <View style={tw`flex-1 bg-white relative`}>
      <ScrollView style={tw`flex-1 px-4`}>
        <TextTheme font="Prompt-Bold" size="2xl" style={tw`py-5 text-black`}>
          จัดการเวลาการท่องเที่ยว
        </TextTheme>

        <View style={tw`mb-6 relative`}>
          {parsedDates.map((item, index) => (
            <DateItem
              key={index}
              item={item}
              index={index}
              onPress={() => handleProgramSelection(index)}
              onDetailsPress={() => handleDetailsPress(index)}
              isLast={index === parsedDates.length - 1}
            />
          ))}
        </View>
      </ScrollView>

      <View style={tw`p-4 mb-5`}>
        <TouchableOpacity style={tw`${parsedDates.every((date) => date.selectedProgram) ? '' : 'opacity-50'}`} disabled={!parsedDates.every((date) => date.selectedProgram)}>
          <LinearGradient style={tw`rounded-2xl py-3 items-center`} colors={[String(tw.color("teal-400")), String(tw.color("teal-500"))]}>
            <TextTheme font="Prompt-SemiBold" size="lg" style={tw`text-white`}>
              ดำเนินการจอง
            </TextTheme>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-5 rounded-xl w-11/12 relative`}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={tw`absolute right-4 top-4 z-9`}>
              <Ionicons name="close-circle" size={30} color={tw.color('gray-500')} />
            </TouchableOpacity>
            <TextTheme font="Prompt-Bold" size="xl" style={tw`mb-4 text-center`}>
              เลือกการท่องเที่ยว
            </TextTheme>
            <ProgramSelectMenu onSelect={updateSelectedProgram} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TravelItineraryScreen;