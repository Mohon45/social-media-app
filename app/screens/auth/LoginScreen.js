import { LinearGradient } from "expo-linear-gradient";
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
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { useLogin } from "../../../hooks/queries/useAuth";
import { loginSchema } from "../../../utils/validationSchemas";

export default function LoginScreen() {
    const router = useRouter();
    const { login: setAuthState } = useAuth();
    const loginMutation = useLogin();

    const handleLogin = async (values) => {
        try {
            const response = await loginMutation.mutateAsync({
                email: values.email,
                password: values.password,
            });

            await setAuthState(response.data);

            Toast.show({
                type: "success",
                text1: "Welcome back!",
                text2: "You have successfully logged in",
                position: "top",
            });

            router.replace("/(tabs)");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <LinearGradient
            colors={["#6366F1", "#8B5CF6", "#EC4899"]}
            style={styles.gradient}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>

                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={loginSchema}
                            onSubmit={handleLogin}
                        >
                            {({ handleSubmit, isValid }) => (
                                <View style={styles.form}>
                                    <Input
                                        name="email"
                                        label="Email"
                                        placeholder="Enter your email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />

                                    <Input
                                        name="password"
                                        label="Password"
                                        placeholder="Enter your password"
                                        secureTextEntry
                                    />

                                    <Button
                                        title="Login"
                                        onPress={handleSubmit}
                                        loading={loginMutation.isPending}
                                        style={styles.loginButton}
                                    />

                                    <Button
                                        title="Don't have an account? Sign up"
                                        onPress={() => router.push("/signup")}
                                        variant="outline"
                                        style={styles.signupButton}
                                        textStyle={styles.signupButtonText}
                                    />
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: theme.spacing.lg,
    },
    content: {
        alignItems: "center",
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: theme.spacing.sm,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18,
        color: "#FFFFFF",
        opacity: 0.9,
        marginBottom: theme.spacing.xl,
        textAlign: "center",
    },
    form: {
        width: "100%",
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        ...theme.shadows.lg,
    },
    loginButton: {
        marginTop: theme.spacing.md,
    },
    signupButton: {
        marginTop: theme.spacing.md,
        backgroundColor: "transparent",
        borderColor: theme.colors.primary,
    },
    signupButtonText: {
        color: theme.colors.primary,
    },
});
