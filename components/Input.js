import { useField } from "formik";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { theme } from "../constants/theme";

export const Input = ({
    label,
    name,
    placeholder,
    secureTextEntry = false,
    keyboardType = "default",
    multiline = false,
    numberOfLines = 1,
    autoCapitalize = "sentences",
    style,
    ...props
}) => {
    const [field, meta, helpers] = useField(name);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = secureTextEntry;
    const hasError = meta.touched && meta.error;

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={[
                        styles.input,
                        multiline && styles.multiline,
                        hasError && styles.inputError,
                        isPassword && styles.inputWithIcon,
                    ]}
                    value={field.value?.toString() || ""}
                    onChangeText={helpers.setValue}
                    onBlur={() => helpers.setTouched(true)}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textLight}
                    secureTextEntry={isPassword && !isPasswordVisible}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    autoCapitalize={autoCapitalize}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={togglePasswordVisibility}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.eyeIconText}>
                            {isPasswordVisible ? "👁️" : "🙈"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            {hasError && <Text style={styles.errorText}>{meta.error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    inputWrapper: {
        position: "relative",
        width: "100%",
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm + 4,
        fontSize: 16,
        color: theme.colors.text,
    },
    inputWithIcon: {
        paddingRight: 50,
    },
    multiline: {
        minHeight: 100,
        textAlignVertical: "top",
        paddingTop: theme.spacing.md,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    eyeIcon: {
        position: "absolute",
        right: theme.spacing.md,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    eyeIconText: {
        fontSize: 22,
    },
    errorText: {
        fontSize: 12,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
    },
});
