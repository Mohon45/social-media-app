import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const KEYS = {
    TOKEN: "social_media_token",
    REFRESH_TOKEN: "social_media_refresh_token",
    USER: "@social_media_user",
};

export const storage = {
    // Token operations using SecureStore (more secure for sensitive data)
    async saveToken(token) {
        try {
            await SecureStore.setItemAsync(KEYS.TOKEN, token);
        } catch (error) {
            console.error("Error saving token:", error);
            throw error;
        }
    },

    async getToken() {
        try {
            return await SecureStore.getItemAsync(KEYS.TOKEN);
        } catch (error) {
            console.error("Error getting token:", error);
            return null;
        }
    },

    async removeToken() {
        try {
            await SecureStore.deleteItemAsync(KEYS.TOKEN);
        } catch (error) {
            console.error("Error removing token:", error);
            throw error;
        }
    },

    async saveRefreshToken(refreshToken) {
        try {
            await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken);
        } catch (error) {
            console.error("Error saving refresh token:", error);
            throw error;
        }
    },

    async getRefreshToken() {
        try {
            return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
        } catch (error) {
            console.error("Error getting refresh token:", error);
            return null;
        }
    },

    async removeRefreshToken() {
        try {
            await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
        } catch (error) {
            console.error("Error removing refresh token:", error);
            throw error;
        }
    },

    // User operations using AsyncStorage
    async saveUser(user) {
        try {
            await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
        } catch (error) {
            console.error("Error saving user:", error);
            throw error;
        }
    },

    async getUser() {
        try {
            const user = await AsyncStorage.getItem(KEYS.USER);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error getting user:", error);
            return null;
        }
    },

    async removeUser() {
        try {
            await AsyncStorage.removeItem(KEYS.USER);
        } catch (error) {
            console.error("Error removing user:", error);
            throw error;
        }
    },

    // Clear all data
    async clearAll() {
        try {
            await Promise.all([
                SecureStore.deleteItemAsync(KEYS.TOKEN),
                AsyncStorage.removeItem(KEYS.USER),
            ]);
        } catch (error) {
            console.error("Error clearing storage:", error);
            throw error;
        }
    },
};
