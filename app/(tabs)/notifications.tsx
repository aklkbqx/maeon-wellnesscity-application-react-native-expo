import TextTheme from '@/components/TextTheme';
import { View } from 'react-native-ui-lib';
import tw from "twrnc"

export default function Notifications() {
  return (
    <>
      <View style={[tw`flex-1 bg-slate-100 items-center justify-center`]}>
        <TextTheme>
          ขณะนี้ยังไม่มีการแจ้งเตือนเข้ามา...
        </TextTheme>
      </View>
    </>
  );
}