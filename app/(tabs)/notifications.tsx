import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Animated, View as RNView, RefreshControl } from 'react-native';
import { View, Colors, Typography, Drawer, Assets, TouchableOpacity, Badge } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import tw from "twrnc";
import TextTheme from '@/components/TextTheme';
import { useStatusBar } from '@/hooks/useStatusBar';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
}

const ITEMS = {
  read: {
    text: 'อ่านแล้ว',
    background: Colors.green30,
    labelStyle: { color: Colors.white },
    onPress: () => { }
  },
  delete: {
    text: 'ลบ',
    background: Colors.red30,
    labelStyle: { color: Colors.white },
    onPress: () => { }
  }
};

const NotificationItem: React.FC<{ item: Notification; onRead: (id: string) => void; onDelete: (id: string) => void }> = ({ item, onRead, onDelete }) => {
  return (
    <Drawer
      rightItems={[{ ...ITEMS.delete, onPress: () => onDelete(item.id) }]}
      leftItem={item.read ? undefined : { ...ITEMS.read, onPress: () => onRead(item.id) }}
    >
      <TouchableOpacity style={[tw`p-4 border-b border-zinc-200`, item.read ? tw`bg-zinc-100` : tw`bg-white`]}>
        <View style={tw`flex-row gap-2 items-center`}>
          <TextTheme font='Prompt-Medium' style={[item.read ? {} : {}]}>{item.title}</TextTheme>
          <Badge label={'อ่านแล้ว'} size={16} backgroundColor={Colors.green30} />
        </View>
        <TextTheme font='Prompt-Light' size='sm'>{item.message}</TextTheme>
      </TouchableOpacity>
    </Drawer>
  );
};

const SkeletonAnimation = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.grey60, Colors.grey70],
  });

  return (
    <RNView style={tw`p-[16] border-b border-zinc-200`}>
      <Animated.View style={[tw`rounded-xl`, { backgroundColor, width: '70%', height: 20, marginBottom: 8 }]} />
      <Animated.View style={[tw`rounded-xl`, { backgroundColor, width: '100%', height: 15 }]} />
    </RNView>
  );
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useStatusBar("dark-content");

  useEffect(() => {
    setTimeout(() => {
      setNotifications([
        { id: '1', title: 'ข้อความใหม่', message: 'คุณมีข้อความใหม่จาก John Doe', read: false },
        { id: '2', title: 'การแจ้งเตือนระบบ', message: 'อัพเดทแอพเวอร์ชันใหม่พร้อมใช้งานแล้ว', read: false },
        { id: '3', title: 'เตือนความจำ', message: 'นัดประชุมในอีก 30 นาที', read: false },
      ]);
      setIsLoading(false);
    }, 2000);
  }, []);

  const markAsRead = (id: string): void => {
    setNotifications(notifications.map(item =>
      item.id === id ? { ...item, read: true } : item
    ));
  };

  const deleteNotification = (id: string): void => {
    setNotifications(notifications.filter(item => item.id !== id));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          {[...Array(5)].map((_, index) => (
            <SkeletonAnimation key={index} />
          ))}
        </>
      );
    }

    if (notifications.length === 0) {
      return (
        <View style={tw`flex-1 items-center justify-center mt-10`}>
          <View style={tw`bg-slate-200 rounded-full p-2`}>
            <Ionicons name='notifications-off' size={50} style={tw`text-teal-500`} />
          </View>
          <TextTheme style={tw`text-center text-gray-500`}>
            ขณะนี้ยังไม่มีการแจ้งเตือนเข้ามา...
          </TextTheme>
        </View>
      );
    }

    return notifications.map(item => (
      <NotificationItem
        key={item.id}
        item={item}
        onRead={markAsRead}
        onDelete={deleteNotification}
      />
    ));
  };

  return (
    <ScrollView
      style={tw`flex-1 bg-slate-100`}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => { }}
          colors={[String(tw`text-teal-500`.color)]}
          tintColor={String(tw`text-teal-500`.color)} />
      }
    >
      {renderContent()}
    </ScrollView>
  );
};

export default Notifications;