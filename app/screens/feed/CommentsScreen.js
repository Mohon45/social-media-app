import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Button } from "../../../components/Button";
import { CommentItem } from "../../../components/CommentItem";
import { Input } from "../../../components/Input";
import { theme } from "../../../constants/theme";
import { useAddComment, useComments } from "../../../hooks/queries/useComments";
import { validation } from "../../../utils/validation";

export default function CommentsScreen() {
    const { postId } = useLocalSearchParams();
    const { data: comments, isLoading, isError, error } = useComments(postId);
    const addCommentMutation = useAddComment();

    const [commentText, setCommentText] = useState("");
    const [commentError, setCommentError] = useState(null);

    const handleCommentChange = (value) => {
        setCommentText(value);
        if (commentError) setCommentError(null);
    };

    const handleAddComment = async () => {
        const validationError = validation.validateCommentContent(commentText);
        if (validationError) {
            setCommentError(validationError);
            return;
        }

        try {
            await addCommentMutation.mutateAsync({
                postId,
                content: commentText,
            });
            setCommentText("");
        } catch (err) {
            setCommentError(err.message || "Failed to add comment");
        }
    };

    const renderComment = ({ item }) => <CommentItem comment={item} />;

    const renderEmpty = () => {
        if (isLoading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary}
                    />
                </View>
            );
        }

        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>
                    No comments yet. Be the first to comment!
                </Text>
            </View>
        );
    };

    if (isError) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error?.message || "Failed to load comments"}
                </Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={100}
        >
            <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item, index) =>
                    item.id?.toString() || index.toString()
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmpty}
            />

            <View style={styles.inputContainer}>
                <Input
                    value={commentText}
                    onChangeText={handleCommentChange}
                    placeholder="Write a comment..."
                    error={commentError}
                    style={styles.input}
                />
                <Button
                    title="Post"
                    onPress={handleAddComment}
                    loading={addCommentMutation.isPending}
                    disabled={!commentText.trim()}
                    style={styles.submitButton}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    listContent: {
        padding: theme.spacing.md,
        flexGrow: 1,
    },
    centerContainer: {
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
    },
    inputContainer: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    input: {
        marginBottom: theme.spacing.sm,
    },
    submitButton: {
        marginTop: 0,
    },
});
