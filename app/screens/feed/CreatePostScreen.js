import { useRouter } from "expo-router";
import { Formik } from "formik";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { config } from "../../../constants/config";
import { theme } from "../../../constants/theme";
import { useCreatePost } from "../../../hooks/queries/usePosts";
import { postSchema } from "../../../utils/validationSchemas";

export default function CreatePostScreen() {
    const router = useRouter();
    const createPostMutation = useCreatePost();

    const handleSubmit = async (values) => {
        try {
            await createPostMutation.mutateAsync(values.content);

            Toast.show({
                type: "success",
                text1: "Post Created!",
                text2: "Your post has been shared successfully",
                position: "top",
            });

            router.back();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed to Create Post",
                text2: error.message || "Please try again",
                position: "top",
            });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Create a Post</Text>
                    <Text style={styles.subtitle}>
                        Share your thoughts with the community
                    </Text>

                    <Formik
                        initialValues={{ content: "" }}
                        validationSchema={postSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleSubmit }) => {
                            const characterCount = values.content.length;
                            const maxLength = config.posts.maxLength;
                            const isOverLimit = characterCount > maxLength;

                            return (
                                <>
                                    <Input
                                        name="content"
                                        placeholder="What's on your mind?"
                                        multiline
                                        numberOfLines={8}
                                        style={styles.input}
                                    />

                                    <View
                                        style={styles.characterCountContainer}
                                    >
                                        <Text
                                            style={[
                                                styles.characterCount,
                                                isOverLimit &&
                                                    styles.characterCountError,
                                            ]}
                                        >
                                            {characterCount} / {maxLength}
                                        </Text>
                                    </View>

                                    <Button
                                        title="Post"
                                        onPress={handleSubmit}
                                        loading={createPostMutation.isPending}
                                        disabled={
                                            !values.content.trim() ||
                                            isOverLimit
                                        }
                                        style={styles.submitButton}
                                    />

                                    <Button
                                        title="Cancel"
                                        onPress={() => router.back()}
                                        variant="outline"
                                        style={styles.cancelButton}
                                    />
                                </>
                            );
                        }}
                    </Formik>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
    },
    input: {
        marginBottom: theme.spacing.sm,
    },
    characterCountContainer: {
        alignItems: "flex-end",
        marginBottom: theme.spacing.lg,
    },
    characterCount: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    characterCountError: {
        color: theme.colors.error,
        fontWeight: "600",
    },
    submitButton: {
        marginBottom: theme.spacing.md,
    },
    cancelButton: {
        backgroundColor: "transparent",
        borderColor: theme.colors.textSecondary,
    },
});
