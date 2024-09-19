import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useShowToast from '@/hooks/useShowToast';

const current_port = "5001";
const current_ip = "172.20.10.4";
const apiUrl = `http://${current_ip}:${current_port}`;

const api = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleApiError = (error: unknown) => {
  console.log(error);
  if (error instanceof AxiosError && error.response) {
    useShowToast("error", "เกิดข้อผิดพลาด", error.response.data.message);
  } else {
    useShowToast("error", "เกิดข้อผิดพลาด", "โปรดลองอีกครั้งในภายหลัง.");
  }
};

export {
  api,
  handleApiError
};