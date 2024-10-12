import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import TextTheme from '@/components/TextTheme';
import { useStatusBar } from '@/hooks/useStatusBar';
import { handleAxiosError, handleErrorMessage } from '@/helper/my-lib';
import api from '@/helper/api';
import Loading from '@/components/Loading';

interface LocationType {
  id: string;
  name: string;
}

const CreateProgramCategories: React.FC = () => {
  useStatusBar("dark-content");

  // States
  const [locationTypes, setLocationTypes] = useState<LocationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchLocationTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/v1/locations/types");
      if (response.data.success && response.data.location_type) {
        setLocationTypes(response.data.location_type);
      }
    } catch (error) {
      handleAxiosError(error, (message) => {
        handleErrorMessage(message);
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLocationTypes();
    setTimeout(() => setRefreshing(false), 1000);
  }, [fetchLocationTypes]);

  useEffect(() => {
    fetchLocationTypes();
  }, [fetchLocationTypes]);

  const selectedCategories = (categoryName: string) => {
    // TODO: Implement category selection logic
  };

  const getIconName = (name: string): keyof typeof Ionicons.glyphMap => {
    switch (name) {
      case "สถานที่ท่องเที่ยว": return "earth";
      case "แหล่งเรียนรู้": return "school";
      case "ร้านอาหารและของฝาก": return "restaurant";
      case "ที่พัก": return "bed";
      case "ท่องเที่ยวตามฤดูกาล": return "calendar";
      default: return "alert";
    }
  };

  return (
    <ScrollView
      style={tw`flex-1 p-5 bg-slate-100`}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[String(tw.color("gray-500"))]}
          tintColor={String(tw.color("gray-500"))}
        />
      }
    >
      <TextTheme font='Prompt-SemiBold' style={tw`text-2xl mb-2 text-gray-800`}>
        สร้างโปรแกรมการท่องเที่ยว
      </TextTheme>
      <TextTheme style={tw`mb-5 text-gray-600`}>
        เลือกหมวดหมู่ที่คุณสนใจ
      </TextTheme>

      {locationTypes.length > 0 ? (
        locationTypes.filter(val => val.name !== "โรงพยาบาล").map(type => (
          <TouchableOpacity
            key={type.id}
            style={tw`flex-row items-center bg-white p-4 rounded-lg mb-3 shadow-sm`}
            onPress={() => selectedCategories(type.name)}
          >
            <Ionicons name={getIconName(type.name)} size={24} />
            <TextTheme style={tw`ml-3`}>{type.name}</TextTheme>
          </TouchableOpacity>
        ))
      ) : (
        <Loading loading={loading} />
      )}
    </ScrollView>
  );
};

export default CreateProgramCategories;