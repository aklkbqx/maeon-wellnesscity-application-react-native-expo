import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Modal, View, Button } from 'react-native-ui-lib';
import tw from 'twrnc';
import TextTheme from './TextTheme';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import useShowToast from '@/hooks/useShowToast';

interface LogoutModalProps {
    isVisible: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isVisible, onClose, onLogout }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        setIsLoading(true);
        onLogout();
        setTimeout(() => {
            setIsLoading(false);
            onClose();
        }, 1000);
        setTimeout(() => {
            router.replace('/(home)');
            useShowToast("success", "สำเร็จ!", "ออกจากระบบแล้ว 👋");
        }, 1000);
    };

    return (
        <Modal
            visible={isVisible}
            onBackgroundPress={onClose}
            overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}
            transparent
            animationType='fade'
        >
            <BlurView intensity={20} style={tw.style("flex-1 items-center justify-center")}>
                <View style={tw`bg-white rounded-3xl p-5 items-center m-5 flex-col gap-2`}>
                    {isLoading ? (
                        <>
                            <ActivityIndicator size="large" color={tw.color('blue-500')} />
                            <TextTheme size="base">กำลังออกจากระบบ...</TextTheme>
                        </>
                    ) : (
                        <>
                            <TextTheme size="xl" font="Prompt-SemiBold">
                                ยืนยันการออกจากระบบ
                            </TextTheme>
                            <TextTheme size="base">
                                คุณต้องการออกจากระบบใช่หรือไม่?
                            </TextTheme>
                            <View style={tw`flex-row gap-2 mt-2`}>
                                <Button
                                    label="ยกเลิก"
                                    outline
                                    outlineColor={tw.color('blue-500')}
                                    style={tw`flex-1 rounded-2xl`}
                                    labelStyle={{ fontFamily: "Prompt-SemiBold" }}
                                    onPress={onClose}
                                />
                                <Button
                                    label="ออกจากระบบ"
                                    backgroundColor={tw.color('red-500')}
                                    style={tw`flex-1 rounded-2xl`}
                                    labelStyle={{ fontFamily: "Prompt-SemiBold" }}
                                    onPress={handleLogout}
                                />
                            </View>
                        </>
                    )}
                </View>
            </BlurView>
        </Modal>
    );
};

export default LogoutModal;