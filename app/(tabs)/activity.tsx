import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { TouchableOpacity, View, TabController, Text, Button } from 'react-native-ui-lib';
import tw from 'twrnc';
import { router, useFocusEffect } from 'expo-router';
import api from '@/helper/api';
import { formatDateThai, handleErrorMessage } from '@/helper/my-lib';
import { useStatusBar } from '@/hooks/useStatusBar';
import useUser from '@/hooks/useUser';
import Loading from '@/components/Loading';
import TextTheme from '@/components/TextTheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { addCommas } from '@/helper/utiles';

// Types
interface BookingDetailItem {
  id: number;
  user_id: number;
  booking_detail: {
    program_id: number;
    program_name: string;
    people: number;
  }[];
  booking_date: string;
  start_date: string;
  end_date: string;
  people: number;
  total_price: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

interface TabItem {
  label: string;
  key: string;
}

// BookingStatusListItem Component
const BookingStatusListItem: React.FC<{ item: BookingDetailItem; }> = ({ item }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500';
      case 'CONFIRMED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      case 'COMPLETED': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'UNPAID': return 'bg-red-500';
      case 'PAID': return 'bg-green-500';
      case 'REFUNDED': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'รอดำเนินการ';
      case 'CONFIRMED': return 'ยืนยันแล้ว';
      case 'CANCELLED': return 'ยกเลิกแล้ว';
      case 'COMPLETED': return 'สำเร็จ';
      default: return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'UNPAID': return 'รอชำระเงิน';
      case 'PAID': return 'ชำระแล้ว';
      case 'REFUNDED': return 'คืนเงินแล้ว';
      default: return status;
    }
  };

  const isActiveBooking = item.status === 'CONFIRMED' && item.payment_status === 'PAID';

  const navigateToMapOrPayment = () => {
    if (isActiveBooking) {
      router.navigate("/map")
    } else {
      router.navigate({
        pathname: "/payments/",
        params: {
          bookingId: item.id
        }
      })
    }
  }

  return (
    <View style={tw`pt-2 px-2`}>
      <TouchableOpacity onPress={navigateToMapOrPayment} style={tw`p-4 border border-zinc-200 bg-white relative overflow-hidden rounded-xl`}>
        <View style={tw`flex-row gap-2 absolute right-2 top-2`}>
          <View style={tw`rounded-xl px-2 pt-0.5 flex-row justify-center items-center ${getStatusColor(item.status)}`}>
            <TextTheme size='xs' color='white'>
              {getStatusText(item.status)}
            </TextTheme>
          </View>
          <View style={tw`rounded-xl px-2 pt-0.5 flex-row justify-center items-center ${getPaymentStatusColor(item.payment_status)}`}>
            <TextTheme size='xs' color='white'>
              {getPaymentStatusText(item.payment_status)}
            </TextTheme>
          </View>
        </View>
        <TextTheme font='Prompt-Light' size='sm'>วันที่จอง: {formatDateThai(item.booking_date)}</TextTheme>
        <TextTheme font='Prompt-Light' size='sm'>วันที่เดินทาง: {formatDateThai(item.start_date)} - {formatDateThai(item.end_date)}</TextTheme>
        <TextTheme font='Prompt-Light' size='sm'>จำนวนคน: {item.people}</TextTheme>
        <TextTheme font='Prompt-Medium' size='sm' style={tw`mt-2`}>ราคารวม: {addCommas(item.total_price)} บาท</TextTheme>
        {isActiveBooking && (
          <View style={tw`bg-blue-500 flex-row gap-2 justify-center items-center rounded-xl p-2 mt-2`}>
            <FontAwesome5 name="map-marker-alt" size={24} color="white" />
            <TextTheme color='white'>
              เปิดแผนที่เดินทาง
            </TextTheme>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

// ActivityTabs Component
const ActivityTabs: React.FC<{
  items: TabItem[];
  bookingData: BookingDetailItem[] | null;
  renderBookings: (status: string) => React.ReactNode;
  refreshing: boolean;
  onRefresh: () => void
}> = ({ items, bookingData, renderBookings, refreshing, onRefresh }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabsWithCount = useMemo(() => {
    if (!bookingData) return items;
    return items.map(item => {
      const count = item.key === 'ALL'
        ? bookingData.length
        : bookingData.filter(booking => booking.status === item.key).length;
      return {
        ...item,
        label: `${item.label} (${count})`
      };
    });
  }, [items, bookingData]);

  return (
    <View style={tw`flex-1`}>
      <TabController
        asCarousel
        items={tabsWithCount}
        initialIndex={selectedIndex}
        onChangeIndex={(index) => setSelectedIndex(index)}
      >
        <TabController.TabBar
          containerStyle={tw`absolute`}
          labelStyle={{ fontFamily: "Prompt-Regular" }}
          selectedLabelStyle={{ fontFamily: "Prompt-Regular" }}
          selectedLabelColor={String(tw.color("blue-500"))}
          selectedIconColor={String(tw.color("blue-500"))}
          iconColor={String(tw.color("blue-500"))}
          indicatorStyle={tw`bg-blue-500 h-0.5 rounded-full`}
        />
        <TabController.PageCarousel style={tw`mt-12`}>
          {items.map((item, index) => (
            <TabController.TabPage key={item.key} index={index}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[String(tw.color("blue-500"))]}
                    tintColor={String(tw.color("blue-500"))}
                  />
                }
              >
                {renderBookings(item.key)}
                <View style={tw`pb-30`} />
              </ScrollView>
            </TabController.TabPage>
          ))}
        </TabController.PageCarousel>
      </TabController>
    </View >
  );
};

// Main Activity Component
const Activity: React.FC = () => {
  useStatusBar("dark-content");
  const { checkLoginStatus } = useUser();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingData, setBookingData] = useState<BookingDetailItem[] | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const tabItems: TabItem[] = [
    { label: 'ทั้งหมด', key: 'ALL' },
    { label: 'รอดำเนินการ', key: 'PENDING' },
    { label: 'ยืนยันแล้ว', key: 'CONFIRMED' },
    { label: 'สำเร็จ', key: 'COMPLETED' },
    { label: 'ยกเลิกแล้ว', key: 'CANCELLED' },
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      await fetchAllBookingData();
      setRefreshing(false);
    }, 1000)
  }, []);

  const fetchAllBookingData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/v1/bookings");
      if (response.data.success && response.data.bookings) {
        setBookingData(response.data.bookings);
      } else {
        setBookingData(null);
      }
    } catch (error) {
      handleErrorMessage(error);
      setBookingData(null);
    } finally {
      setLoading(false);
    }
  };

  const checkLogin = async () => {
    const { login } = await checkLoginStatus();
    if (login) {
      setIsLogin(true);
      fetchAllBookingData();
    } else {
      setLoading(false);
      setIsLogin(false);
    }
  };

  useFocusEffect(useCallback(() => {
    checkLogin();
  }, []))

  const renderBookings = (status: string) => {
    if (!bookingData) return null;
    const filteredBookings = status === 'ALL' ? bookingData : bookingData.filter(booking => booking.status === status);

    if (status === 'ALL') {
      const statusOrder = ['CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'];
      return (
        <>
          {statusOrder.map(currentStatus => {
            let bookingsForStatus = filteredBookings.filter(booking => booking.status === currentStatus);
            if (currentStatus === 'CONFIRMED') {
              // แสดงการจองที่ยืนยันแล้วและชำระเงินแล้วก่อน
              bookingsForStatus = bookingsForStatus.sort((a, b) =>
                (b.payment_status === 'PAID' ? 1 : 0) - (a.payment_status === 'PAID' ? 1 : 0)
              );
            }
            if (bookingsForStatus.length === 0) return null;
            return (
              <View key={currentStatus}>
                <TextTheme font='Prompt-Medium' size='lg' style={tw`mt-4 mb-2 px-2`}>
                  {currentStatus === 'PENDING' && 'รอดำเนินการ'}
                  {currentStatus === 'COMPLETED' && 'สำเร็จ'}
                  {currentStatus === 'CONFIRMED' && 'ยืนยันแล้ว'}
                  {currentStatus === 'CANCELLED' && 'ยกเลิกแล้ว'}
                </TextTheme>
                {bookingsForStatus.map(booking => (
                  <BookingStatusListItem key={booking.id} item={booking} />
                ))}
              </View>
            );
          })}
        </>
      );
    }

    return filteredBookings.map(booking => (
      <BookingStatusListItem key={booking.id} item={booking} />
    ));
  };

  if (isLogin) {
    return (
      <View style={tw`flex-1 bg-slate-100`}>
        <ActivityTabs
          items={tabItems}
          bookingData={bookingData}
          renderBookings={renderBookings}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>
    );
  } else {
    return (
      <View style={tw`flex-1 justify-center items-center bg-slate-100 mb-10`}>
        <View style={tw`flex-col gap-2`}>
          <TextTheme>ยังไม่มีสถานะการเดินทางของคุณ</TextTheme>
          <View style={tw`flex-row items-center gap-2`}>
            <TextTheme>กรุณาทำการ</TextTheme>
            <TouchableOpacity onPress={() => {
              router.navigate({
                pathname: "/login",
                params: {
                  backToPage: "/activity"
                }
              });
            }}>
              <TextTheme font='Prompt-SemiBold' color='blue-500' style={tw`underline`}>เข้าสู่ระบบ</TextTheme>
            </TouchableOpacity>
            <TextTheme>ของคุณ</TextTheme>
          </View>
        </View>
      </View>
    );
  }
};

export default Activity;