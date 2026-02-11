import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { theme } from "../constants/theme";

export const Button = ({
    title,
    onPress,
    variant = "primary",
    loading = false,
    disabled = false,
    style,
    textStyle,
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[variant],
                isDisabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={
                        variant === "primary" ? "#FFFFFF" : theme.colors.primary
                    }
                />
            ) : (
                <Text
                    style={[styles.text, styles[`${variant}Text`], textStyle]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
    },
    primary: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.sm,
    },
    secondary: {
        backgroundColor: theme.colors.secondary,
        ...theme.shadows.sm,
    },
    outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
    primaryText: {
        color: "#FFFFFF",
    },
    secondaryText: {
        color: "#FFFFFF",
    },
    outlineText: {
        color: theme.colors.primary,
    },
});
