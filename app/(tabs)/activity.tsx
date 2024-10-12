import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { TouchableOpacity, View, TabController, Text, Button } from 'react-native-ui-lib';
import tw from 'twrnc';
import { router, useFocusEffect } from 'expo-router';
import api from '@/helper/api';
import { formatDateThai, handleErrorMessage } from '@/helper/my-lib';
import { useStatusBar } from '@/hooks/useStatusBar';
import useUser from '@/hooks/useUser';
import TextTheme from '@/components/TextTheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { addCommas } from '@/helper/utiles';
import { Bookings, Payments } from '@/types/PrismaType';
import { Ionicons } from '@expo/vector-icons';

interface TabItem {
  label: string;
  key: string;
}

const BookingStatusListItem: React.FC<{ booking: Bookings; payment: Payments | null; index: number }> = ({ booking, payment, index }) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500';
      case 'CONFIRMED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      case 'COMPLETED': return 'bg-blue-500';
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500';
      case 'PAID': return 'bg-green-500';
      case 'FAILED': return 'bg-red-500';
      case 'REFUNDED': return 'bg-orange-500';
      case 'PENDING_VERIFICATION': return 'bg-gray-500';
      case 'REJECTED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'รอชำระเงิน';
      case 'PAID': return 'ชำระแล้ว';
      case 'FAILED': return 'ล้มเหลว';
      case 'REFUNDED': return 'คืนเงินแล้ว';
      case 'PENDING_VERIFICATION': return 'กำลังตรวจสอบ';
      case 'REJECTED': return 'ถูกปฏิเสธ';
      default: return status;
    }
  };

  const isActiveBooking = booking.status === 'CONFIRMED'
  const navigateToMapOrPayment = async () => {
    if (isActiveBooking) {
      router.navigate({
        pathname: "/map",
        params: {
          bookingDetail: booking.booking_detail
        }
      })
    } else {
      router.navigate({
        pathname: "/payments/",
        params: {
          bookingId: booking.id
        }
      })
    }
  }

  return (
    <View style={tw`pt-2 px-2`}>
      <TouchableOpacity onPress={navigateToMapOrPayment} style={tw`p-4 border border-zinc-200 bg-white relative rounded-2xl shadow`}>
        <View style={tw`flex-row gap-2 absolute right-2 top-2`}>
          <View style={tw`rounded-xl px-2 pt-0.5 flex-row justify-center items-center ${getStatusColor(booking.status)}`}>
            <TextTheme size='xs' color='white'>
              {getStatusText(booking.status)}
            </TextTheme>
          </View>
          <View style={tw`rounded-xl px-2 pt-0.5 flex-row justify-center items-center ${getPaymentStatusColor(String(payment?.status))}`}>
            <TextTheme size='xs' color='white'>
              {payment?.status && getPaymentStatusText(payment?.status)}
            </TextTheme>
          </View>
        </View>
        <View style={tw`flex-col gap-1`}>
          <TextTheme font='Prompt-Light' size='base'>#{index}</TextTheme>
          <View style={tw`flex-row gap-2 items-center`}>
            <Ionicons name='calendar' size={18} />
            <TextTheme font='Prompt-Light' size='sm'>จอง​วันที่: {formatDateThai(String(booking.booking_date))}</TextTheme>
          </View>
          <View style={tw`flex-row gap-2 items-center`}>
            <Ionicons name='car' size={18} />
            <TextTheme font='Prompt-Light' size='sm'>
              เริ่มเดินทาง: {formatDateThai(String(booking.start_date)) === formatDateThai(String(booking.end_date))
                ? formatDateThai(String(booking.start_date))
                : `${formatDateThai(String(booking.start_date))} ถึง ${formatDateThai(String(booking.end_date))}`}
            </TextTheme>

          </View>
          <View style={tw`flex-row gap-2 items-center`}>
            <Ionicons name='people' size={18} />
            <TextTheme font='Prompt-Light' size='sm'>จำนวน: {booking.people} คน</TextTheme>
          </View>
          <TextTheme font='Prompt-Regular' size='sm' style={tw``}>ราคารวม: {addCommas(booking.total_price)} บาท</TextTheme>
        </View>
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
  bookingData: Bookings[] | null;
  renderBookings: (status: string) => React.ReactNode;
  refreshing: boolean;
  onRefresh: () => void
}> = ({ items, bookingData, renderBookings, refreshing, onRefresh }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [load, setLoad] = useState<boolean>(false)

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

  useEffect(() => {
    setTimeout(() => {
      setLoad(true)
    }, 200)
  }, [load])

  const renderTabBar = () => {
    if (load) {
      return (
        <TabController.TabBar
          containerStyle={tw`absolute`}
          labelStyle={{ fontFamily: "Prompt-Regular" }}
          selectedLabelStyle={{ fontFamily: "Prompt-Regular" }}
          selectedLabelColor={String(tw.color("blue-500"))}
          selectedIconColor={String(tw.color("blue-500"))}
          iconColor={String(tw.color("blue-500"))}
          indicatorStyle={tw`bg-blue-500 h-0.5 rounded-full`}
        />
      )
    }
  }
  return (
    <View style={tw`flex-1`}>
      <TabController
        asCarousel
        items={tabsWithCount}
        initialIndex={selectedIndex}
        onChangeIndex={(index) => setSelectedIndex(index)}
      >
        {renderTabBar()}
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
    </View>
  );
};

type BookingWithPayment = Bookings & { payment: Payments | null };

// Main Activity Component
const Activity: React.FC = () => {
  useStatusBar("dark-content");
  const { checkLoginStatus } = useUser();
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [bookingData, setBookingData] = useState<BookingWithPayment[] | null>(null);
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
    fetchAllData().finally(() => setRefreshing(false));
  }, []);

  const fetchAllData = async () => {
    try {
      const bookings = await fetchBookingData();
      if (bookings) {
        const bookingsWithPayments = await Promise.all(
          bookings.map(async (booking) => {
            const payment = await fetchPaymentData(booking.id);
            return { ...booking, payment };
          })
        );
        setBookingData(bookingsWithPayments);
      } else {
        setBookingData([]);
      }
    } catch (error) {
      handleErrorMessage(error);
      setBookingData([]);
    }
  };

  const fetchBookingData = async (): Promise<Bookings[] | null> => {
    try {
      const response = await api.get("/api/v1/bookings");
      if (response.data.success && response.data.bookings) {
        return response.data.bookings;
      }
      return null;
    } catch (error) {
      handleErrorMessage(error);
      return null;
    }
  };

  const fetchPaymentData = async (bookingId: number): Promise<Payments | null> => {
    try {
      const response = await api.get(`/api/v1/payments/${bookingId}`);
      if (response.data.success && response.data.payments) {
        return response.data.payments;
      }
      return null;
    } catch (error) {
      handleErrorMessage(error);
      return null;
    }
  };

  const checkLoginAndFetchData = async () => {
    const { login } = await checkLoginStatus();
    setIsLogin(login);
    if (login) {
      fetchAllData();
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkLoginAndFetchData();
    }, [])
  );

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
              bookingsForStatus = bookingsForStatus.sort((a, b) =>
                ((a.payment?.status === 'PAID' ? 1 : 0) - (b.payment?.status === 'PAID' ? 1 : 0))
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
                {bookingsForStatus.map((booking, index) => (
                  <BookingStatusListItem key={booking.id} booking={booking} payment={booking.payment} index={index + 1} />
                ))}
              </View>
            );
          })}
        </>
      );
    }

    return filteredBookings.map((booking, index) => (
      <BookingStatusListItem key={booking.id} booking={booking} payment={booking.payment} index={index + 1} />
    ))
  };
  if (isLogin === null) {
    // Still checking login status, show nothing or a very subtle loading indicator
    return <View style={tw`flex-1 bg-slate-100`} />;
  }

  if (isLogin === false) {
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
};

export default Activity;