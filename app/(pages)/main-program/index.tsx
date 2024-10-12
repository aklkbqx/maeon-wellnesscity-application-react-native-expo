import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Image, FlatList, Modal, TextInput } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import TextTheme from '@/components/TextTheme';
import tw from 'twrnc';
import { formatDateThai } from '@/helper/my-lib';
import { TouchableOpacity } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import api, { apiUrl } from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';
import Loading from '@/components/Loading';
import { BlurView } from 'expo-blur';
import * as Animatable from 'react-native-animatable';
import { useStatusBar } from '@/hooks/useStatusBar';
import { Programs, ProgramTypes } from '@/types/PrismaType';


const MainTourProgram: React.FC = () => {
  useStatusBar("dark-content");
  const { bookingData, dateSelected } = useLocalSearchParams();

  const handleProgramDetail = (programId: number) => {
    router.navigate({
      pathname: '/main-program/details',
      params: { programId, bookingData, dateSelected }
    });
  };

  //state
  const [programTypes, setProgramTypes] = useState<ProgramTypes[]>([]);
  const [filteredProgramTypes, setFilteredProgramTypes] = useState<ProgramTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const fetchProgramTypes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/v1/programs");
      if (response.data.success) {
        setProgramTypes(response.data.program_data);
        setFilteredProgramTypes(response.data.program_data);
      }
    } catch (error) {
      handleErrorMessage("ไม่สามารถข้อมูลโปรแกรมได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramTypes();
  }, []);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    setIsSearching(true);
    setHasSearched(true);
    setTimeout(() => {
      if (text) {
        const filtered = programTypes.map(pt => ({
          ...pt,
          programs: pt.programs.filter(p =>
            p.name.toLowerCase().includes(text.toLowerCase()) ||
            p.description.toLowerCase().includes(text.toLowerCase())
          )
        })).filter(pt => pt.programs.length > 0);
        setFilteredProgramTypes(filtered);
      } else {
        setFilteredProgramTypes(programTypes);
      }
      setIsSearching(false);
    }, 300);
  }, [programTypes]);

  const resetSearch = useCallback(() => {
    setSearchQuery('');
    setFilteredProgramTypes(programTypes);
    setShowSearch(false);
    setIsSearching(false);
    setHasSearched(false);
  }, [programTypes]);

  const parseImageNames = (imageNameData: string): string[] => {
    try {
      return JSON.parse(imageNameData);
    } catch (error) {
      console.error("Error parsing image names:", error);
      return [];
    }
  };

  const renderStackHeader = () => {
    return (
      <Stack.Screen options={{
        headerShown: true,
        header: () => (
          <View style={tw`bg-white`}>
            <Animatable.View animation={!showSearch ? "fadeInLeft" : "fadeInRight"} style={tw`w-full ios:pt-14 android:pt-7.5 pb-1 justify-between flex-row px-5 items-center gap-2`}>
              {showSearch ? (
                <>
                  <View style={tw`relative flex-1`}>
                    <TextInput
                      style={[tw`border border-slate-200 rounded-xl py-2.1 px-10 flex-row text-zinc-500 bg-white`, { fontFamily: "Prompt-Regular" }]}
                      placeholder='ค้นหา'
                      placeholderTextColor={"#717179"}
                      autoCapitalize='none'
                      autoFocus
                      value={searchQuery}
                      onChangeText={handleSearch}
                    />
                    <Ionicons name='search' style={tw`text-zinc-500 absolute top-[15%] android:top-[20%] left-[4%] text-xl`} />
                  </View>
                  <TouchableOpacity onPress={resetSearch}>
                    <TextTheme style={tw`text-zinc-800`}>ยกเลิก</TextTheme>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center android:py-2.6 ios:py-2`}>
                    <Ionicons name="chevron-back" size={24} color={tw.color('black')} />
                  </TouchableOpacity>
                  <TextTheme style={tw`text-center`} font='Prompt-Bold' size='lg'>
                    โปรแกรมการท่องเที่ยวหลัก
                  </TextTheme>
                  <TouchableOpacity style={tw`flex-row items-center`} onPress={() => { setShowSearch(true) }}>
                    <Ionicons name="search" size={24} color={tw.color('black')} />
                  </TouchableOpacity>
                </>
              )}
            </Animatable.View>
          </View>
        )
      }} />
    )
  }

  const renderProgram = (program: Programs) => {
    const schedules = JSON.parse(program.schedules);
    const startTime = schedules.start.time
    const endTime = schedules.end.time

    const imageNames = program.program_images && program.program_images[0]
      ? parseImageNames(program.program_images[0].image_name_data)
      : [];
    const firstImageName = imageNames.length > 0 ? imageNames[0] : null;

    return (
      <View key={program.id} style={tw`shadow`}>
        <TouchableOpacity
          style={tw`bg-white rounded-2xl mb-4 border border-slate-200 overflow-hidden`}
          onPress={() => { handleProgramDetail(program.id) }}
        >
          <View style={tw`h-[180px] bg-slate-200 relative `}>
            <Image
              source={{ uri: `${apiUrl}/images/program_images/${firstImageName}` }}
              style={[tw`flex-1 h-[180px]`, { objectFit: "cover" }]}
            />
          </View>
          <View style={tw`p-4`}>
            <TextTheme font="Prompt-SemiBold" style={tw`text-lg mb-2`}>{program.name}</TextTheme>
            <TextTheme font='Prompt-Light' numberOfLines={2} style={tw`text-gray-600 mb-2`}>{program.description}</TextTheme>
            <View style={tw`flex-row justify-between items-center`}>
              <TextTheme font='Prompt-SemiBold' size='lg' style={tw`text-green-600`}>{program.total_price} บาท</TextTheme>
              <TextTheme style={tw``}>{startTime} - {endTime}</TextTheme>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {renderStackHeader()}
      <Modal visible={loading} transparent>
        <BlurView intensity={10} style={tw`flex-1 justify-center items-center`}>
          <Loading loading={loading} size={'large'} />
        </BlurView>
      </Modal>
      <ScrollView style={tw`flex-1 bg-slate-100 pt-4`}>
        <View style={tw`px-5`}>
          <View style={tw`justify-between items-center flex-row my-1`}>
            <TextTheme font="Prompt-Medium" size="sm" style={tw`text-white bg-blue-500 rounded-xl overflow-hidden px-2 py-1`}>
              วันที่เลือก: {formatDateThai(dateSelected as string)}
            </TextTheme>
          </View>
        </View>

        <View style={tw`mx-5 mt-2`}>
          {programTypes ? (
            filteredProgramTypes.length > 0 ? (
              !isSearching ? (
                <FlatList
                  data={filteredProgramTypes}
                  renderItem={({ item: programType }: { item: ProgramTypes }) => (
                    <>
                      {programType.id !== 3 ? <TextTheme font="Prompt-Medium" size="lg" style={tw`mb-3`}>{programType.name}</TextTheme> : null}
                      {programType.programs.map(renderProgram)}
                    </>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
              ) : (
                <Loading loading={isSearching} size={'large'} style={tw`mt-10`} />
              )
            ) : (
              hasSearched && (
                <View style={tw`mt-5`}>
                  <TextTheme style={tw`text-center text-zinc-800`}>ไม่พบผลลัพธ์ที่คุณค้นหา</TextTheme>
                </View>
              )
            )
          ) : null}
        </View>
        <View style={tw`mb-20`}></View>
      </ScrollView>
    </>
  );
};

export default MainTourProgram;