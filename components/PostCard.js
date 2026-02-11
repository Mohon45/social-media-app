import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { theme } from "../constants/theme";
import { useLikePost, useUnlikePost } from "../hooks/queries/usePosts";
import { formatTime } from "../utils/formatTime";
import { Avatar } from "./Avatar";

export const PostCard = ({ post, onCommentPress }) => {
    const likeMutation = useLikePost();
    const unlikeMutation = useUnlikePost();

    const handleLikePress = () => {
        if (post.isLiked) {
            unlikeMutation.mutate(post?._id);
        } else {
            likeMutation.mutate(post?._id);
        }
    };

    const isLikeLoading = likeMutation.isPending || unlikeMutation.isPending;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Avatar
                    name={
                        post.author?.firstName + " " + post?.author?.lastName ||
                        "Anonymous"
                    }
                    size={40}
                />
                <View style={styles.headerText}>
                    <Text style={styles.authorName}>
                        {post?.author?.firstName +
                            " " +
                            post?.author?.lastName || "Anonymous"}
                    </Text>
                    <Text style={styles.timestamp}>
                        {formatTime(post?.createdAt)}
                    </Text>
                </View>
            </View>

            <Text style={styles.content}>{post.content}</Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleLikePress}
                    disabled={isLikeLoading}
                    activeOpacity={0.7}
                >
                    {isLikeLoading ? (
                        <ActivityIndicator
                            size="small"
                            color={theme.colors.like}
                        />
                    ) : (
                        <Text
                            style={[
                                styles.actionIcon,
                                post.isLiked && styles.liked,
                            ]}
                        >
                            {post.isLiked ? "❤️" : "🤍"}
                        </Text>
                    )}
                    <Text
                        style={[
                            styles.actionText,
                            post.isLiked && styles.likedText,
                        ]}
                    >
                        {post.likesCount || 0}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onCommentPress && onCommentPress(post)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>
                        {post.commentsCount || 0}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.md,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.md,
    },
    headerText: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.colors.text,
        marginBottom: 2,
    },
    timestamp: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    content: {
        fontSize: 15,
        lineHeight: 22,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        gap: theme.spacing.lg,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        minHeight: 44,
        minWidth: 60,
    },
    actionIcon: {
        fontSize: 22,
        marginRight: theme.spacing.xs,
    },
    actionText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontWeight: "500",
    },
    liked: {
        transform: [{ scale: 1.1 }],
    },
    likedText: {
        color: theme.colors.like,
        fontWeight: "600",
    },
});
