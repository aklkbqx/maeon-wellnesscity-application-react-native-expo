import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import tw from "twrnc"
import ProfileSection from '@/components/my-account/ProfileSection';
import MenuSection from '@/components/my-account/MenuSection';
import TextTheme from '@/components/TextTheme';
import useUser from '@/hooks/useUser';
import Loading from '@/components/Loading';

const MyAccount: React.FC = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { user, loading, error, fetchUser } = useUser();

  const onRefresh = useCallback(() => {
    fetchUser();
    setRefreshing(true);
    setTimeout(async () => {
      setRefreshing(false);
    }, 500);
  }, [fetchUser]);


  if (loading) {
    return <Loading />
  }

  if (error) {
    return <TextTheme>Error: {error}</TextTheme>;
  }

  if (!user) {
    return <TextTheme>Please log in to view your account.</TextTheme>;
  }

  return (
    <View style={tw`flex-1 bg-slate-100`}>
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => onRefresh()}
            colors={[String(tw`text-teal-500`.color)]}
            tintColor={String(tw`text-teal-500`.color)} />
        }
      >
        <View style={[tw`flex-1 shadow-xl pb-5 web:pb-5 rounded-3xl m-2 bg-white mb-20`]}>
          <TouchableOpacity>
            <ProfileSection />
          </TouchableOpacity>
          <View style={tw`border-b border-b-8 border-zinc-200`} />
          <MenuSection title="บัญชีของฉัน" type="account" />
          <MenuSection title="สนับสนุนและเกี่ยวกับ" type="policy" />
          <MenuSection title="การตั้งค่า" type="setting" />
        </View>
        <View style={tw`mb-3`} />
      </ScrollView>
    </View>
  );
};
export default MyAccount;


