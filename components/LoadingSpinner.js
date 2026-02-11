import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

export const LoadingSpinner = ({ message = "Loading..." }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
    },
    message: {
        marginTop: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
});
