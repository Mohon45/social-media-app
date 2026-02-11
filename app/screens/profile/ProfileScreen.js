import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Avatar } from "../../../components/Avatar";
import { Button } from "../../../components/Button";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { useUserDetails } from "../../../hooks/queries/useUser";

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    // Fetch user details from API
    const {
        data: userDetails,
        isLoading,
        refetch,
    } = useUserDetails(user?._id || user?.id);

    const displayUser = userDetails?.data || user;

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await logout();
                    router.replace("/login");
                },
            },
        ]);
    };

    const stats = [
        { label: "Posts", value: displayUser?.postsCount || "0" },
        { label: "Followers", value: displayUser?.followersCount || "0" },
        { label: "Following", value: displayUser?.followingCount || "0" },
    ];

    if (isLoading && !displayUser) {
        return (
            <View style={styles.loadingContainer}>
                <LoadingSpinner />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.coverPhoto} />
                <View style={styles.profileSection}>
                    <Avatar
                        name={
                            displayUser?.firstName +
                                " " +
                                displayUser?.lastName || "User"
                        }
                        size={100}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>
                        {displayUser?.firstName + " " + displayUser?.lastName ||
                            "User Name"}
                    </Text>
                    <Text style={styles.email}>{displayUser?.email || ""}</Text>
                </View>
            </View>

            {/* Stats Section */}
            <View style={styles.statsContainer}>
                {stats?.map((stat, index) => (
                    <View key={index} style={styles.statItem}>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            {/* Bio Section */}
            <View style={styles.bioSection}>
                <Text style={styles.bioTitle}>About</Text>
                <Text style={styles.bioText}>
                    {displayUser?.bio || "No bio added yet"}
                </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Share Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Settings Section */}
            <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Settings</Text>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Account Settings</Text>
                    <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Privacy</Text>
                    <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Notifications</Text>
                    <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Help & Support</Text>
                    <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <View style={styles.logoutContainer}>
                <Button
                    title="Logout"
                    onPress={handleLogout}
                    variant="outline"
                    style={styles.logoutButton}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        backgroundColor: "#fff",
        marginBottom: theme.spacing.md,
    },
    coverPhoto: {
        height: 150,
        backgroundColor: theme.colors.primary,
        opacity: 0.8,
    },
    profileSection: {
        alignItems: "center",
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
        marginTop: -50,
    },
    avatar: {
        borderWidth: 4,
        borderColor: "#fff",
        ...theme.shadows.md,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: theme.colors.text,
        marginTop: theme.spacing.md,
    },
    email: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingVertical: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    bioSection: {
        backgroundColor: "#fff",
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    bioTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    bioText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    actionsContainer: {
        flexDirection: "row",
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    actionButton: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: "center",
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.colors.primary,
    },
    settingsSection: {
        backgroundColor: "#fff",
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.colors.text,
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surface,
    },
    settingText: {
        fontSize: 14,
        color: theme.colors.text,
    },
    settingArrow: {
        fontSize: 24,
        color: theme.colors.textSecondary,
    },
    logoutContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.xl,
    },
    logoutButton: {
        borderColor: theme.colors.error,
    },
});
