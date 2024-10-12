import React, { useState } from 'react';
import { ScrollView, Share } from 'react-native';
import { View, Card, TouchableOpacity } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import TextTheme from '@/components/TextTheme';
import { useStatusBar } from '@/hooks/useStatusBar';
import { router, useLocalSearchParams } from 'expo-router';
import { formatDateThai, handleErrorMessage } from '@/helper/my-lib';
import { addCommas } from '@/helper/utiles';
import Loading from '@/components/Loading';

interface BookingDetail {
  program_id: number;
  program_name: string;
  people: number;
}

interface JsonData {
  bookings: {
    booking_detail: string;
    total_price: string;
    id: number;
  };
  payments: {
    payment_date: string;
    status: string
  };
}

const PaymentSuccessScreen: React.FC = () => {
  useStatusBar("dark-content");
  const { paymentPending } = useLocalSearchParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [jsonData, setJsonData] = React.useState<JsonData>(() => {
    try {
      return JSON.parse((paymentPending as string) || '{}');
    } catch {
      handleErrorMessage('มีข้อผิดพลาดบางอย่างเกิดขึ้น');
      return {} as JsonData;
    }
  });

  const bookingDetails: BookingDetail[] = React.useMemo(() => {
    try {
      setLoading(false)
      return JSON.parse(jsonData.bookings.booking_detail || '[]');
    } catch {
      return [];
    }
  }, [jsonData.bookings.booking_detail]);

  const handleShare = async () => {
    try {
      let receiptContent = `ใบเสร็จการชำระเงิน\n\n`;
      receiptContent += `หมายเลขการจอง: #${jsonData.bookings.id}\n`;
      receiptContent += `วันที่ชำระเงิน: ${formatDateThai(jsonData.payments.payment_date)}\n\n`;
      receiptContent += `รายการ:\n`;

      bookingDetails.forEach((program, index) => {
        receiptContent += `${index + 1}. ${program.program_name} (${program.people} คน)\n`;
      });

      receiptContent += `\nยอดรวมทั้งหมด: ฿${addCommas(jsonData.bookings.total_price)}\n`;

      await Share.share({
        message: receiptContent,
        title: 'ใบเสร็จการชำระเงิน'
      });
    } catch (error) {
      handleErrorMessage('เกิดข้อผิดพลาดในการแชร์ใบเสร็จ');
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-slate-100`}>
        <Loading loading={loading} />
      </View>
    )
  }

  return (
    <ScrollView style={tw`flex-1 bg-slate-100 mt-10`}>
      <View style={tw`flex-1 p-4`}>
        <Card style={tw`bg-white rounded-3xl overflow-hidden mb-4`}>
          <View style={tw`items-center py-8 bg-emerald-50`}>
            <View style={tw`w-20 h-20 rounded-full bg-emerald-200 items-center justify-center mb-4`}>
              <Ionicons name="checkmark-circle" size={50} color={tw.color('emerald-500')} />
            </View>
            <TextTheme font="Prompt-SemiBold" size="2xl" style={tw`text-emerald-700 mb-2`}>สำเร็จ !</TextTheme>
            <TextTheme style={tw`text-gray-500`}>ชำระเงินเสร็จสิ้นสำหรับ {bookingDetails.length} รายการ</TextTheme>
          </View>

          <View style={tw`p-4`}>
            {bookingDetails.map((program: BookingDetail, index: number) => (
              <View key={index} style={tw`flex-row justify-between items-center mb-4`}>
                <View style={tw`flex-row items-center w-[60%]`}>
                  <Ionicons name="checkmark-circle" size={24} color={tw.color('emerald-500')} />
                  <View style={tw`ml-2`}>
                    <View style={tw`flex-row flex-wrap`}>
                      <TextTheme font="Prompt-Medium" size="sm">{program.program_name}</TextTheme>
                    </View>
                    <TextTheme style={tw`text-gray-500 text-xs`}>{program.people} คน</TextTheme>
                  </View>
                </View>
                <TextTheme font="Prompt-Medium">฿{addCommas(jsonData.bookings.total_price)}</TextTheme>
              </View>
            ))}

            <View style={tw`border-t border-gray-200 pt-4 mt-4`}>
              <View style={tw`flex-row justify-between`}>
                <TextTheme style={tw`text-gray-500`}>ยอดรวมทั้งหมด</TextTheme>
                <TextTheme font="Prompt-SemiBold" size="xl">฿{addCommas(jsonData.bookings.total_price)}</TextTheme>
              </View>
            </View>
          </View>
        </Card>

        <Card style={tw`bg-white rounded-xl p-4 mb-4`}>
          <View style={tw`flex-row justify-between mb-2`}>
            <TextTheme style={tw`text-gray-500`}>วันที่ชำระเงิน</TextTheme>
            <TextTheme font="Prompt-Medium">{formatDateThai(jsonData.payments.payment_date)}</TextTheme>
          </View>
          <View style={tw`flex-row justify-between`}>
            <TextTheme style={tw`text-gray-500`}>หมายเลขการจอง</TextTheme>
            <TextTheme font="Prompt-Medium">#{jsonData.bookings.id}</TextTheme>
          </View>
        </Card>

        {jsonData.payments.status !== "PAID" ? (
          <View style={tw`flex-row justify-center mt-4`}>
            <TouchableOpacity style={tw`items-center mx-4`} onPress={handleShare}>
              <View style={tw`w-12 h-12 rounded-full bg-slate-700 items-center justify-center mb-1`}>
                <Ionicons name="share-social" size={24} color="white" />
              </View>
              <TextTheme size="xs" style={tw`text-gray-600`}>แชร์</TextTheme>
            </TouchableOpacity>
          </View>
        ) : null}


        <TouchableOpacity
          onPress={() => router.replace('/(home)')}
          style={tw`mt-6 bg-blue-500 rounded-full py-3 px-5`}
        >
          <TextTheme font="Prompt-SemiBold" style={tw`text-white text-center`}>เสร็จสิ้น</TextTheme>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PaymentSuccessScreen;