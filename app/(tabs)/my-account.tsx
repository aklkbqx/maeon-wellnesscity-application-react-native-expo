import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import tw from "twrnc"
import ProfileSection from '@/components/my-account/ProfileSection';
import MenuSection from '@/components/my-account/MenuSection';
import useUser from '@/hooks/useUser';
import Loading from '@/components/Loading';
import api from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';
import { useFocusEffect } from 'expo-router';
import { useStatusBar } from '@/hooks/useStatusBar';
import { USER_TYPE } from '@/types/userType';

const MyAccount: React.FC = () => {
  useStatusBar("dark-content");
  const { checkLoginStatus, fetchUserData } = useUser();
  const [userData, setUserData] = useState<USER_TYPE | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async (profile: string) => {
    try {
      const res = await api.get(`/images/user_images/${profile}`);
      setProfileImageUrl(res.request.responseURL);
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

  useFocusEffect(useCallback(() => {
    initializeUserData();
  }, [initializeUserData]))

  useEffect(() => {
    const fetchProfile = async () => {
      if (userData) {
        await fetchUserProfile(userData.profile_picture);
      }
    };
    fetchProfile();
  }, [userData, profileImageUrl]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await initializeUserData();
    setRefreshing(false);
  }, [initializeUserData]);

  useEffect(() => {
    let timer: any;
    if (loading) {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, 1000);
    } else {
      setShowLoading(false);
    }

    return () => clearTimeout(timer);
  }, [loading, 1000]);


  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Loading loading={loading} />
      </View>
    )
  } else {
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
          <View style={[tw`flex-1 shadow-xl pb-5 web:pb-5 rounded-3xl m-2 bg-white mb-20`]}>
            <ProfileSection loading={loading} showLoading={showLoading} profileImageUrl={profileImageUrl} userData={userData} />
            <View style={tw`border-b-8 border-zinc-200`} />
            {userData ? <MenuSection title="บัญชีของฉัน" type="account" userData={userData} /> : null}
            <MenuSection title="สนับสนุนและเกี่ยวกับ" type="policy" userData={userData} />
            <MenuSection title="การตั้งค่า" type="setting" userData={userData} />
          </View>
          <View style={tw`android:mb-10 ios:mb-5`} />
        </ScrollView>
      </View>
    );
  }


};

export default MyAccount;