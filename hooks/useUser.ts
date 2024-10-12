import { useState, useEffect, useCallback } from 'react';
import api from '@/helper/api';
import { handleAxiosError, handleErrorMessage } from '@/helper/my-lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Users } from '@/types/PrismaType';
import { userTokenLogin } from '@/helper/my-lib';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '@/types/types';

const useUser = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);

    const fetchUserData = useCallback(async (setUserData: React.Dispatch<React.SetStateAction<Users | null>>) => {
        return new Promise((resolve, reject) =>
            api.get('/api/v1/users/me')
                .then(response => {
                    setUserData(response.data);
                    resolve(null);
                }).catch(error => {
                    handleAxiosError(error, (message) => {
                        handleErrorMessage(message);
                    });
                    reject(error);
                })
        )
    }, []);


    const checkLoginStatus = useCallback(async () => {
        const token = await AsyncStorage.getItem(userTokenLogin);
        if (token) {
            setIsLogin(true)
            return { login: true };
        } else {
            setIsLogin(false)
            return { login: false };
        }
    }, [fetchUserData]);


    const logout = useCallback(async () => {
        try {
            await api.post("/api/v1/auth/logout");
            await AsyncStorage.removeItem(userTokenLogin);
        } catch (error) {
            await AsyncStorage.removeItem(userTokenLogin);
        }
    }, []);

    useEffect(() => {
        checkLoginStatus();
    }, [isLogin])

    return { fetchUserData, logout, checkLoginStatus, isLogin };
};

export default useUser;
