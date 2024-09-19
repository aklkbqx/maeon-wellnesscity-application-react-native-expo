import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { Href, router, useFocusEffect } from 'expo-router';
import tw from "twrnc"
import { Image } from 'react-native-ui-lib';
import TextTheme from '@/components/TextTheme';
// import { UserData, fetchUserData } from '@/helper/api';
// import useLoginStatus from '@/hook/useLoginStatus';
// import useNotificationPermission from '@/hook/useNotificationPermission';
// import useToggleSwitch from '@/hook/useToggleSwitch';
// import { menuListMyAccount, menuListSettings, menuListSupportAndPolicy } from '@/components/My-Account/menuButtonListAccount';
// import MenuSection from '@/components/My-Account/MenuSection';
// import ProfileSection from '@/components/My-Account/ProfileSection';
// import SettingsSection from '@/components/My-Account/SettingsSection';
// import CheckLogin from '@/components/CheckLogin';

const MyAccount: React.FC = () => {
  // const { isLoggedIn, isCheckingLogin, checkLoginStatus } = useLoginStatus();
  // const { notificationPermission, requestNotificationPermission } = useNotificationPermission();
  // const { isEnabled, toggleSwitch } = useToggleSwitch(requestNotificationPermission);
  // const [userData, setUserData] = useState<UserData | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      // await checkLoginStatus();
      // if (isLoggedIn) {
      //   fetchUserData(setUserData);
      // }
      setRefreshing(false);
    }, 500);
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     checkLoginStatus();
  //     if (isLoggedIn) {
  //       fetchUserData(setUserData);
  //     }
  //   }, [checkLoginStatus, isLoggedIn])
  // );


  // if (isCheckingLogin) {
  //   return <CheckLogin />;
  // }

  return (
    <View style={tw`flex-1 bg-slate-100`}>
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0d9488"]}
            tintColor={"#0d9488"}
          />
        }
      >
        <View style={[tw`flex-1 shadow-xl pb-5 web:pb-5 rounded-3xl m-2 bg-white mb-20`]}>
          <TouchableOpacity>
            <ProfileSection />
          </TouchableOpacity>
          <View style={tw`border-b border-b-8 border-zinc-200`} />
          {/* {isLoggedIn && <MenuSection title="บัญชีของฉัน" menuList={menuListMyAccount} />}
          <MenuSection title="สนับสนุนและเกี่ยวกับ" menuList={menuListSupportAndPolicy} /> */}
          {/* <SettingsSection
            isLoggedIn={isLoggedIn}
            menuList={menuListSettings}
            toggleSwitch={toggleSwitch}
            isEnabled={isEnabled}
            notificationPermission={notificationPermission} /> */}
        </View>
        <View style={tw`mb-3`} />
      </ScrollView>
    </View>
  );
};
export default MyAccount;


const ProfileSection = () => {
  const defaultProfile = require("@/assets/images/default-profile.jpg");
  return (
    <View style={tw`p-5 flex-row items-center gap-4`}>
      <View style={[tw`w-[70px] h-[70px] rounded-full overflow-hidden bg-zinc-300 items-center justify-center`]}>
        <Image style={[tw`w-[70px] h-[70px] rounded-full overflow-hidden bg-zinc-300 items-center justify-center border border-slate-200`, { objectFit: "cover" }]}
          source={defaultProfile} />
      </View>
      <TextTheme font="Prompt-SemiBold" size="xl" children="ลงทะเบียน/เข้าสู่ระบบ" />
    </View>
  )
}