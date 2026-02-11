import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import {
    useMarkAllAsRead,
    useMarkAsRead,
    useNotificationsQuery,
} from "../hooks/queries/useNotificationsQuery";
import { useColorScheme } from "../hooks/use-color-scheme";

function NotificationItem({ item, onMarkAsRead }) {
    const router = useRouter();
    const handlePress = () => {
        if (!item.isRead) {
            onMarkAsRead(item._id);
        }

        // Navigate based on notification type
        if (item.type === "comment" && item.post) {
            router.push(`/comments/${item.post._id || item.post}`);
        } else if (item.type === "like" && item.post) {
            router.push(`/comments/${item.post._id || item.post}`);
        }
    };

    // Format time (e.g., "2m ago")
    const getTimeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return "just now";
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <TouchableOpacity
            style={[
                styles.notificationItem,
                !item.isRead && styles.unreadNotification,
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                    {item.sender?.firstName?.charAt(0).toUpperCase() || "?"}
                </Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.notificationText}>
                    <Text style={styles.boldText}>
                        {item.sender
                            ? `${item.sender.firstName} ${item.sender.lastName}`
                            : "Someone"}
                    </Text>{" "}
                    {item.message?.replace(
                        `${item.sender?.firstName} ${item.sender?.lastName}`,
                        "",
                    ) || item.message}
                </Text>
                <Text style={styles.timeText}>
                    {getTimeAgo(item.createdAt)}
                </Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );
}

export default function NotificationsScreen() {
    const colorScheme = useColorScheme();
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    } = useNotificationsQuery();

    const markAllAsReadMutation = useMarkAllAsRead();
    const markAsReadMutation = useMarkAsRead();

    // Flatten pages into a single array of notifications
    const notifications = data?.pages.flatMap((page) => page.results) || [];

    const hasUnread = notifications.some((notif) => !notif.isRead);

    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate();
    };

    const handleMarkAsRead = (id) => {
        markAsReadMutation.mutate(id);
    };

    const loadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>
                    Failed to load notifications
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {hasUnread && (
                <TouchableOpacity
                    style={styles.markAllButton}
                    onPress={handleMarkAllAsRead}
                    activeOpacity={0.7}
                    disabled={markAllAsReadMutation.isPending}
                >
                    {markAllAsReadMutation.isPending ? (
                        <ActivityIndicator size="small" color="#007AFF" />
                    ) : (
                        <>
                            <IconSymbol
                                size={18}
                                name="checkmark"
                                color="#007AFF"
                                style={styles.checkIcon}
                            />
                            <Text style={styles.markAllText}>
                                Mark all as read
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            )}
            <FlatList
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <NotificationItem
                        item={item}
                        onMarkAsRead={handleMarkAsRead}
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        tintColor="#007AFF"
                    />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View style={styles.footerLoader}>
                            <ActivityIndicator size="small" color="#8E8E93" />
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    !isLoading && (
                        <View style={styles.emptyContainer}>
                            <IconSymbol
                                size={48}
                                name="bell.fill"
                                color="#C7C7CC"
                            />
                            <Text style={styles.emptyText}>
                                No notifications yet
                            </Text>
                        </View>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    markAllButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#F2F2F7",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E5E5EA",
    },
    checkIcon: {
        marginRight: 6,
    },
    markAllText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#007AFF",
    },
    listContent: {
        flexGrow: 1,
    },
    notificationItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E5E5EA",
        backgroundColor: "#FFFFFF",
    },
    unreadNotification: {
        backgroundColor: "#F8F9FB",
    },
    avatarPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#007AFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
    textContainer: {
        flex: 1,
    },
    notificationText: {
        fontSize: 15,
        color: "#000000",
        lineHeight: 20,
    },
    boldText: {
        fontWeight: "600",
    },
    timeText: {
        fontSize: 13,
        color: "#8E8E93",
        marginTop: 2,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#007AFF",
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 120,
    },
    emptyText: {
        fontSize: 16,
        color: "#8E8E93",
        marginTop: 12,
    },
    errorText: {
        fontSize: 16,
        color: "#FF3B30",
        marginBottom: 12,
    },
    retryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "#007AFF",
        borderRadius: 8,
    },
    retryText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    footerLoader: {
        paddingVertical: 16,
        alignItems: "center",
    },
});
