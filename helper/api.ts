import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useShowToast from '@/hooks/useShowToast';
import { userTokenLogin } from './my-lib';
import { router } from 'expo-router';

const current_port = "5001";
const current_ip = "172.20.10.4";
export const apiUrl = `http://${current_ip}:${current_port}`;

const api = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(userTokenLogin);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api