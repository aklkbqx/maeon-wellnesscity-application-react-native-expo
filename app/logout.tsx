import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useStatusBar } from '@/hooks/useStatusBar';
import useShowToast from '@/hooks/useShowToast';

const Logout: React.FC = () => {
  useStatusBar("dark-content");
  const Logout = async () => {
    router.replace("/(tabs)/(home)/(index)/");
    useShowToast("success", "สำเร็จ!", "ออกจากระบบแล้ว 👋");
  }
  useEffect(() => {
    Logout()
  }, [Logout])

  return null
};

export default Logout;