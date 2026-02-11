import axios from "axios";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { config } from "../constants/config";
import { storage } from "../utils/storage";

const apiClient = axios.create({
    baseURL: config.api.baseURL,
    timeout: config.api.timeout,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": Platform.OS,
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await storage.getToken();
        const refreshToken = await storage.getRefreshToken();

        if (token) {
            config.headers.Authorization = `token=${token}token=${refreshToken}`;
        }
        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        console.log();
        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await storage.clearAll();
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.response?.data?.message,
                position: "top",
                visibilityTime: 2000,
            });
            return Promise.reject(error);
        }

        return Promise.reject(error);
    },
);

export default apiClient;
