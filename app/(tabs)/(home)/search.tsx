import { View, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, TouchableOpacity, BackHandler } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { useStatusBar } from '@/hooks/useStatusBar';
import { Ionicons } from '@expo/vector-icons';
import tw from "twrnc"
import TextTheme from '@/components/TextTheme';
import { useTabBar } from '@/context/TabBarContext';
import { router, useFocusEffect } from 'expo-router';

const DATA = [
  {
    id: '1',
    title: 'สถานที่ท่องเที่ยว',
  },
  {
    id: '2',
    title: 'การตรวจสุขภาพ',
  },
  {
    id: '3',
    title: 'ร้านอาหารและของฝาก',
  }
];

const Search = () => {
  useStatusBar("dark-content");
  const { hideTabBar, showTabBar } = useTabBar();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(DATA);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    const filtered = DATA.filter(item =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  }, []);

  useFocusEffect(useCallback(() => {
    hideTabBar();
    return () => showTabBar()
  }, [hideTabBar, showTabBar]));

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );


  return (
    <View style={tw`flex-1`}>
      <View style={tw`px-5 mt-2`}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={tw`relative mb-2`}>
            <TextInput
              style={[tw`border border-slate-200 rounded-xl py-2 px-10 flex-row text-zinc-500 bg-white`, { fontFamily: "Prompt-Regular" }]}
              placeholder='กำลังหาอะไรอยู่?...'
              placeholderTextColor={"#717179"}
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize='none'
              autoFocus
            />
            <Ionicons name='search' style={tw`text-zinc-500 absolute top-[15%] android:top-[20%] left-[4%] text-xl`} />
          </View>
        </TouchableWithoutFeedback>

        <FlatList
          style={tw`mb-20 pb-50`}
          data={filteredData}
          renderItem={({ item }) => (
            <TouchableOpacity style={tw`bg-white p-2.5 rounded-2xl flex-row items-center gap-2 my-2`}>
              <View style={tw`bg-slate-200 w-20 h-20 rounded-xl`}></View>
              <View style={tw`flex-col`}>
                <TextTheme font='Prompt-SemiBold'>{item.title}</TextTheme>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={tw`mt-4`}>
              <TextTheme>ไม่พบผลการค้นหา..</TextTheme>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  )
}

export default Search