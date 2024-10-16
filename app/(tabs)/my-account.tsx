import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import tw from "twrnc"
import ProfileSection from '@/components/my-account/ProfileSection';
import MenuSection from '@/components/my-account/MenuSection';
import useUser from '@/hooks/useUser';
import api from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';
import { useFocusEffect } from 'expo-router';
import { useStatusBar } from '@/hooks/useStatusBar';
import { Users } from '@/types/PrismaType';

const MyAccount: React.FC = () => {
  useStatusBar("dark-content");
  const { checkLoginStatus, fetchUserData } = useUser();

  // State
  const [userData, setUserData] = useState<Users | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // Refs
  const profileImage = useRef();

  const fetchUserProfile = useCallback(async (profile: string) => {
    try {
      const res = await api.get(`/images/user_images/${profile}`);
      setProfileImageUrl(res.request.responseURL);
      profileImage.current = res.request.responseURL
    } catch {
      setProfileImageUrl(null);
      handleErrorMessage("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้");
    }
  }, []);

  const initializeUserData = useCallback(async () => {
    setLoading(true);
    const { login } = await checkLoginStatus();
    if (login) {
      await fetchUserData(setUserData);
    }
    setLoading(false);
  }, [checkLoginStatus, fetchUserData]);


  useFocusEffect(
    useCallback(() => {
      initializeUserData();
    }, [initializeUserData])
  );


  useEffect(() => {
    if (userData && userData.profile_picture && (profileImage.current !== userData.profile_picture)) {
      fetchUserProfile(userData.profile_picture);
    }
  }, [userData])

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await initializeUserData();
    setRefreshing(false);
  }, [initializeUserData]);

  return (
    <View style={tw`flex-1 bg-slate-100`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[String(tw`text-blue-500`.color)]}
            tintColor={String(tw`text-blue-500`.color)}
          />
        }
      >
        <View style={[tw`flex-1 shadow pb-5 web:pb-5 rounded-3xl m-2 bg-white mb-20`]}>
          <ProfileSection loading={loading} profileImageUrl={profileImageUrl} userData={userData} />
          <View style={tw`border-b-8 border-zinc-200`} />
          {userData ? <MenuSection title="บัญชีของฉัน" type="account" userData={userData} /> : null}
          <MenuSection title="สนับสนุนและเกี่ยวกับ" type="policy" userData={userData} />
          <MenuSection title="การตั้งค่า" type="setting" userData={userData} />
        </View>
        <View style={tw`android:mb-10 ios:mb-5`} />
      </ScrollView>
    </View>
  );


};

export default MyAccount;