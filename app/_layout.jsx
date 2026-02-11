import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useNotifications } from "../hooks/useNotifications";
import { QueryProvider } from "../providers/QueryProvider";

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const { isAuthenticated, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useNotifications();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (!isAuthenticated && !inAuthGroup) {
            router.replace("/login");
        } else if (isAuthenticated && inAuthGroup) {
            router.replace("/(tabs)");
        }
    }, [isAuthenticated, isLoading, segments]);

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="create-post"
                    options={{ title: "Create Post" }}
                />
                <Stack.Screen
                    name="comments/[postId]"
                    options={{ title: "Comments" }}
                />
                <Stack.Screen
                    name="notifications"
                    options={{ title: "Notifications" }}
                />
            </Stack>
            <StatusBar style="auto" />
            <Toast />
        </ThemeProvider>
    );
}

export default function RootLayout() {
    return (
        <QueryProvider>
            <AuthProvider>
                <RootLayoutNav />
            </AuthProvider>
        </QueryProvider>
    );
}
