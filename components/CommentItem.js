import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

export const CommentItem = ({ comment }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.author}>
                    {comment.user?.name || "Anonymous"}
                </Text>
                <Text style={styles.time}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                </Text>
            </View>
            <Text style={styles.content}>{comment.content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing.xs,
    },
    author: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.colors.text,
    },
    time: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    content: {
        fontSize: 14,
        color: theme.colors.text,
        lineHeight: 20,
    },
});
