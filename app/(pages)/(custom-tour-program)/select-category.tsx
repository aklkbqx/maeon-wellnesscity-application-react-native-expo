import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import TextTheme from '@/components/TextTheme';

interface Category {
  id: string;
  name: string;
  icon: string;
  mandatory?: boolean;
}

const categories: Category[] = [
  { id: '1', name: 'แหล่งท่องเที่ยว', icon: 'earth' },
  { id: '2', name: 'ที่พัก', icon: 'bed' },
  { id: '3', name: 'ร้านอาหาร', icon: 'restaurant' },
  { id: '4', name: 'แหล่งเรียนรู้', icon: 'school' },
  { id: '5', name: 'การตรวจสุขภาพ', icon: 'medkit', mandatory: true },
];

const CreateProgramCategories: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    // เลือกหมวดหมู่การตรวจสุขภาพโดยอัตโนมัติเมื่อเริ่มต้น
    const mandatoryCategory = categories.find(cat => cat.mandatory);
    if (mandatoryCategory) {
      setSelectedCategories([mandatoryCategory.id]);
    }
  }, []);

  const toggleCategory = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category?.mandatory) {
      // ไม่อนุญาตให้ยกเลิกการเลือกหมวดหมู่บังคับ
      return;
    }
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    console.log('Selected categories:', selectedCategories);
  };

  return (
    <ScrollView style={tw`flex-1 p-5 bg-gray-100`}>
      <TextTheme style={tw`text-2xl font-bold mb-2 text-gray-800`}>สร้างโปรแกรมการท่องเที่ยว</TextTheme>
      <TextTheme style={tw`text-base mb-5 text-gray-600`}>เลือกหมวดหมู่ที่คุณสนใจ (การตรวจสุขภาพเป็นสิ่งจำเป็น)</TextTheme>

      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={tw`flex-row items-center bg-white p-4 rounded-lg mb-3 shadow-sm
            ${selectedCategories.includes(category.id) ? 'bg-blue-500' : ''}
            ${category.mandatory ? 'opacity-50' : ''}`}
          onPress={() => toggleCategory(category.id)}
          disabled={category.mandatory}
        >
          <Ionicons
            name={category.icon as any}
            size={24}
            color={selectedCategories.includes(category.id) ? '#FFFFFF' : '#333333'}
          />
          <TextTheme style={tw`ml-3 text-base
            ${selectedCategories.includes(category.id) ? 'text-white' : 'text-gray-800'}`}>
            {category.name} {category.mandatory ? '(จำเป็น)' : ''}
          </TextTheme>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={tw`bg-blue-500 p-4 rounded-lg items-center mt-5
          ${selectedCategories.length <= 1 ? 'bg-gray-400' : ''}`}
        onPress={handleNext}
        disabled={selectedCategories.length <= 1}
      >
        <TextTheme style={tw`text-white text-lg font-bold`}>ถัดไป</TextTheme>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateProgramCategories;