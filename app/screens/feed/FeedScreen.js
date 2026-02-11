import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import CommentsModal from "../../../components/CommentsModal";
import { PostCard } from "../../../components/PostCard";
import { IconSymbol } from "../../../components/ui/icon-symbol";
import { theme } from "../../../constants/theme";
import { usePosts } from "../../../hooks/queries/usePosts";

export default function FeedScreen() {
    const router = useRouter();
    const [usernameFilter, setUsernameFilter] = useState("");
    const [debouncedUsername, setDebouncedUsername] = useState("");
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentsModalVisible, setCommentsModalVisible] = useState(false);

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = usePosts({
        username: debouncedUsername,
    });

    // Debounce username filter
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedUsername(usernameFilter);
        }, 500);

        return () => clearTimeout(timer);
    }, [usernameFilter]);

    // const posts = data?.pages.flatMap((page) => page.posts) || [];

    const handleCommentPress = useCallback((post) => {
        setSelectedPost(post);
        setCommentsModalVisible(true);
    }, []);

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const handleClearFilter = () => {
        setUsernameFilter("");
    };

    const renderPost = ({ item }) => (
        <PostCard post={item} onCommentPress={handleCommentPress} />
    );

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (isLoading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    {usernameFilter
                        ? "No posts found for this user"
                        : "No posts yet. Be the first to post!"}
                </Text>
            </View>
        );
    };

    if (isError) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error?.message || "Failed to load posts"}
                </Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => refetch()}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <View style={styles.searchInputContainer}>
                    <TextInput
                        value={usernameFilter}
                        onChangeText={setUsernameFilter}
                        placeholder="Filter by username..."
                        placeholderTextColor={theme.colors.textLight}
                        style={styles.filterInput}
                    />
                    {usernameFilter.length > 0 && (
                        <TouchableOpacity
                            onPress={handleClearFilter}
                            style={styles.clearButton}
                            activeOpacity={0.7}
                        >
                            <IconSymbol
                                name="close"
                                size={20}
                                color={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Posts List */}
            <FlatList
                data={data?.pages[0].data}
                renderItem={renderPost}
                keyExtractor={(item, index) =>
                    item.id?.toString() || index.toString()
                }
                contentContainerStyle={styles.listContent}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isFetchingNextPage ? <LoadingSpinner /> : null
                }
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={refetch}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push("/create-post")}
            >
                <Text style={styles.fabIcon}>✏️</Text>
            </TouchableOpacity>

            {/* Comments Modal */}
            <CommentsModal
                visible={commentsModalVisible}
                onClose={() => setCommentsModalVisible(false)}
                post={selectedPost}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    filterContainer: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    searchInputContainer: {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
    },
    filterInput: {
        flex: 1,
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm + 4,
        paddingRight: 40, // Space for clear button
        fontSize: 16,
        color: theme.colors.text,
    },
    clearButton: {
        position: "absolute",
        right: 10,
        padding: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        padding: theme.spacing.md,
        paddingBottom: 80, // Space for FAB
    },
    footer: {
        paddingVertical: theme.spacing.md,
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: theme.spacing.xxl,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing.lg,
    },
    errorText: {
        fontSize: 16,
        color: theme.colors.error,
        textAlign: "center",
        marginBottom: theme.spacing.md,
    },
    retryButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm + 4,
        borderRadius: theme.borderRadius.md,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    fab: {
        position: "absolute",
        right: theme.spacing.lg,
        bottom: theme.spacing.lg,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary,
        justifyContent: "center",
        alignItems: "center",
        ...theme.shadows.lg,
    },
    fabIcon: {
        fontSize: 24,
    },
});
