import Constants from "expo-constants";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { notificationsAPI } from "../api/endpoints/notifications";

// Detect if running inside Expo Go (notifications won't work there in SDK 53+)
const isExpoGo = Constants.appOwnership === "expo";

// Lazy-load expo-notifications only when NOT in Expo Go
let Notifications = null;
if (!isExpoGo) {
    Notifications = require("expo-notifications");
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });
}

export function useNotifications() {
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState(null);
    const notificationListener = useRef();
    const responseListener = useRef();
    const router = useRouter();

    useEffect(() => {
        if (isExpoGo || !Notifications) {
            console.warn(
                "⚠️ Push notifications are not supported in Expo Go (SDK 53+). Use a development build: npx expo run:android",
            );
            return;
        }

        registerForPushNotificationsAsync().then((token) => {
            if (token) {
                setExpoPushToken(token);
                registerTokenWithBackend(token);
            }
        });

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log("📬 Notification received:", notification);
                setNotification(notification);

                Toast.show({
                    type: "info",
                    text1:
                        notification.request.content.title ||
                        "New Notification",
                    text2: notification.request.content.body || "",
                    position: "top",
                    visibilityTime: 4000,
                });
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log("👆 Notification tapped:", response);
                    const data = response.notification.request.content.data;
                    handleNotificationTap(data);
                },
            );

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current,
                );
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(
                    responseListener.current,
                );
            }
        };
    }, []);

    const handleNotificationTap = (data) => {
        if (data?.type === "comment" && data?.postId) {
            router.push(`/comments/${data.postId}`);
        } else if (data?.type === "like" && data?.postId) {
            router.push(`/comments/${data.postId}`);
        } else if (data?.screen) {
            router.push(data.screen);
        } else {
            router.push("/notifications");
        }
    };

    const registerTokenWithBackend = async (token) => {
        try {
            await notificationsAPI.registerDevice(token);
            console.log("✅ Token registered with backend:", token);
        } catch (error) {
            console.error("❌ Failed to register token:", error);
        }
    };

    return {
        expoPushToken,
        notification,
    };
}

async function registerForPushNotificationsAsync() {
    if (!Notifications) return;

    let token;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#007AFF",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            console.warn("⚠️ Failed to get push notification permissions");
            return;
        }

        try {
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ??
                Constants?.easConfig?.projectId;

            token = (
                await Notifications.getExpoPushTokenAsync(
                    projectId ? { projectId } : undefined,
                )
            ).data;
            console.log("🔑 Expo Push Token:", token);
        } catch (error) {
            console.error("❌ Error getting push token:", error);
        }
    } else {
        console.warn("⚠️ Must use physical device for Push Notifications");
    }

    return token;
}
