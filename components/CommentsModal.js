import { Formik } from "formik";
import { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { theme } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { useAddComment, useComments } from "../hooks/queries/useComments";
import { commentSchema } from "../utils/validationSchemas";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Input } from "./Input";
import { LoadingSpinner } from "./LoadingSpinner";

export default function CommentsModal({ visible, onClose, post }) {
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    const { data: comments, isLoading, refetch } = useComments(post?._id);
    const addCommentMutation = useAddComment();

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await addCommentMutation.mutateAsync({
                postId: post?._id,
                content: values.content,
            });

            Toast.show({
                type: "success",
                text1: "Comment Added!",
                text2: "Your comment has been posted",
                position: "top",
                visibilityTime: 2000,
            });

            resetForm();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed to Add Comment",
                text2: error.message || "Please try again",
                position: "top",
            });
        }
    };

    const renderComment = ({ item }) => (
        <View style={styles.commentItem}>
            <Avatar
                name={
                    item.user?.firstName + " " + item.user?.lastName ||
                    "Anonymous"
                }
                size={32}
            />
            <View style={styles.commentContent}>
                <Text style={styles.commentAuthor}>
                    {item.user?.firstName + " " + item.user?.lastName ||
                        "Anonymous"}
                </Text>
                <Text style={styles.commentText}>{item.content}</Text>
                <Text style={styles.commentTime}>
                    {new Date(item?.createdAt).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Comments</Text>
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.postInfo}>
                    <Avatar
                        name={
                            post?.author?.firstName +
                                " " +
                                post?.author?.lastName || "Anonymous"
                        }
                        size={40}
                    />
                    <View style={styles.postInfoText}>
                        <Text style={styles.postAuthor}>
                            {post?.author?.firstName +
                                " " +
                                post?.author?.lastName || "Anonymous"}
                        </Text>
                        <Text style={styles.postContent} numberOfLines={2}>
                            {post?.content}
                        </Text>
                    </View>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <LoadingSpinner />
                    </View>
                ) : (
                    <FlatList
                        data={comments?.data || []}
                        renderItem={renderComment}
                        keyExtractor={(item) => item?._id?.toString()}
                        contentContainerStyle={styles.commentsList}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={theme.colors.primary}
                                colors={[theme.colors.primary]}
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    No comments yet. Be the first to comment!
                                </Text>
                            </View>
                        }
                    />
                )}

                <Formik
                    initialValues={{ content: "" }}
                    validationSchema={commentSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleSubmit, values }) => (
                        <View style={styles.inputContainer}>
                            <Avatar
                                name={
                                    user?.firstName + " " + user?.lastName ||
                                    "User"
                                }
                                size={32}
                            />
                            <View style={styles.inputWrapper}>
                                <Input
                                    name="content"
                                    placeholder="Write a comment..."
                                    multiline
                                    numberOfLines={2}
                                    style={styles.input}
                                />
                                <Button
                                    title="Post"
                                    onPress={handleSubmit}
                                    loading={addCommentMutation.isPending}
                                    disabled={!values.content.trim()}
                                    style={styles.submitButton}
                                />
                            </View>
                        </View>
                    )}
                </Formik>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: "#fff",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.text,
    },
    closeButton: {
        padding: theme.spacing.xs,
    },
    closeButtonText: {
        fontSize: 24,
        color: theme.colors.textSecondary,
    },
    postInfo: {
        flexDirection: "row",
        padding: theme.spacing.lg,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        gap: theme.spacing.md,
    },
    postInfoText: {
        flex: 1,
    },
    postAuthor: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    postContent: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    commentsList: {
        padding: theme.spacing.lg,
    },
    commentItem: {
        flexDirection: "row",
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    commentContent: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    commentText: {
        fontSize: 14,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    commentTime: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    emptyContainer: {
        padding: theme.spacing.xl,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: "center",
    },
    inputContainer: {
        flexDirection: "row",
        padding: theme.spacing.lg,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        gap: theme.spacing.md,
    },
    inputWrapper: {
        flex: 1,
        gap: theme.spacing.sm,
    },
    input: {
        marginBottom: 0,
    },
    submitButton: {
        paddingVertical: theme.spacing.sm,
    },
});
