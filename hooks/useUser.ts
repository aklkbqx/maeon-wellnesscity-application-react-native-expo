import { useState, useEffect, useCallback } from 'react';
import { api, handleApiError } from '@/helper/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_TYPE } from '@/constants/userType';

const useUser = () => {
    const [user, setUser] = useState<USER_TYPE | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/v1/users/me');
            setUser(response.data);
            setError(null);
        } catch (err) {
            handleApiError(err);
            setError('Failed to fetch user data');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setUser(null);
        } catch (err) {
            console.error('Error during logout:', err);
        }
    }, []);

    const checkLoginStatus = useCallback(async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            await fetchUser();
        } else {
            setUser(null);
            setLoading(false);
        }
    }, [fetchUser]);

    useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    return { user, loading, error, fetchUser, logout, checkLoginStatus };
};

export default useUser;