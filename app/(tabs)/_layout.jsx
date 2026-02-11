import { Tabs, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { HapticTab } from "../../components/haptic-tab";
import { IconSymbol } from "../../components/ui/icon-symbol";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

function NotificationBell() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const iconColor = Colors[colorScheme ?? "light"].text;

    return (
        <TouchableOpacity
            onPress={() => router.push("/notifications")}
            style={styles.bellContainer}
            activeOpacity={0.7}
        >
            <IconSymbol size={24} name="bell.fill" color={iconColor} />
            {/* Unread badge dot */}
            <View style={styles.badgeDot} />
        </TouchableOpacity>
    );
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: true,
                tabBarButton: HapticTab,
                headerRight: () => <NotificationBell />,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Feed",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerTitle: "My Profile",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="person.fill"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    bellContainer: {
        marginRight: 16,
        padding: 6,
        position: "relative",
    },
    badgeDot: {
        position: "absolute",
        top: 5,
        right: 5,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FF3B30",
        borderWidth: 1.5,
        borderColor: "#FFFFFF",
    },
});
