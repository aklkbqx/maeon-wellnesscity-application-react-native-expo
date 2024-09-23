import TextTheme from '@/components/TextTheme';
import { useStatusBar } from '@/hooks/useStatusBar';
import { Ionicons } from '@expo/vector-icons';
import { RefreshControl, ScrollView } from 'react-native';
import { View } from 'react-native-ui-lib';
import tw from "twrnc"

export default function Travel() {
  useStatusBar("dark-content");
  return (
    <>
      <View style={[tw`flex-1 bg-slate-100`]}>
        <View style={tw`flex-1 items-center justify-center`}>
          <View style={tw`bg-slate-200 rounded-full p-2`}>
            <Ionicons name='car' size={50} style={tw`text-teal-500`} />
          </View>
          <TextTheme style={tw`text-center text-gray-500`}>ยังไม่มีสถานะการเดินทางของคุณ...</TextTheme>
        </View>
      </View>
    </>
  );
}