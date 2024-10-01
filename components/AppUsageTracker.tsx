import api from '@/helper/api';
import { handleErrorMessage } from '@/helper/my-lib';
import useUser from '@/hooks/useUser';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

// const ONLINE_DELAY = 5000;
// const OFFLINE_DELAY = 500;

const AppUsageTracker = () => {
    const appState = useRef(AppState.currentState);
    const { checkLoginStatus } = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateUserStatus = async (status: string) => {
        try {
            await api.put(`/api/v1/users/update-user-status/${status}`);
        } catch (error) {
            handleErrorMessage("ไม่สามารถเปลี่ยนสถานะการใช้งานได้!");
        }
    }

    // const delayedUpdateUserStatus = (status: string, delay: number) => {
    //     if (updateTimeoutRef.current) {
    //         clearTimeout(updateTimeoutRef.current);
    //     }
    //     updateTimeoutRef.current = setTimeout(() => {
    //         updateUserStatus(status);
    //     }, delay);
    // }

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const { login } = await checkLoginStatus();
                setIsLoggedIn(login);
            } catch (error) {
                console.error('Error checking login status:', error);
                setIsLoggedIn(false);
            }
        };

        checkLogin();
    }, [checkLoginStatus]);

    useEffect(() => {
        if (!isLoggedIn) return;

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // console.log('แอพถูกใช้งานอยู่!');
                updateUserStatus("ONLINE");
                // delayedUpdateUserStatus("ONLINE", ONLINE_DELAY);
            } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
                // console.log('ไม่ได้ใช้งานแอพ!');
                updateUserStatus("OFFLINE");
                // delayedUpdateUserStatus("OFFLINE", OFFLINE_DELAY);
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
            //     // if (updateTimeoutRef.current) {
            //     //     clearTimeout(updateTimeoutRef.current);
            //     // }
            //     // Immediately set status to OFFLINE when component unmounts
            //     // updateUserStatus("OFFLINE");
        };

    }, [isLoggedIn]);

    useFocusEffect(
        useCallback(() => {
            if (isLoggedIn) {
                updateUserStatus("ONLINE");
                // console.log('หน้าจอได้รับโฟกัส และผู้ใช้ล็อกอินแล้ว');
                // delayedUpdateUserStatus("ONLINE", ONLINE_DELAY);
            }
        }, [isLoggedIn])
    );

    return null;
};

export default AppUsageTracker;