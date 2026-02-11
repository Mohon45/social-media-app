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
import { useSignup } from "../../../hooks/queries/useAuth";
import { signupSchema } from "../../../utils/validationSchemas";

export default function SignupScreen() {
    const router = useRouter();
    const signupMutation = useSignup();

    const handleSignup = async (values) => {
        try {
            await signupMutation.mutateAsync({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
            });

            Toast.show({
                type: "success",
                text1: "Account Created!",
                text2: "Please login to continue",
                position: "top",
                visibilityTime: 3000,
            });

            setTimeout(() => {
                router.replace("/login");
            }, 1000);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Signup Failed",
                text2: error.message || "Please try again",
                position: "top",
            });
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join us today!</Text>

                        <Formik
                            initialValues={{
                                firstName: "",
                                lastName: "",
                                email: "",
                                password: "",
                            }}
                            validationSchema={signupSchema}
                            onSubmit={handleSignup}
                        >
                            {({ handleSubmit }) => (
                                <View style={styles.form}>
                                    <Input
                                        name="firstName"
                                        label="First Name"
                                        placeholder="Enter your first name"
                                        autoCapitalize="words"
                                    />

                                    <Input
                                        name="lastName"
                                        label="Last Name"
                                        placeholder="Enter your last name"
                                        autoCapitalize="words"
                                    />

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
                                        title="Sign Up"
                                        onPress={handleSubmit}
                                        loading={signupMutation.isPending}
                                        style={styles.signupButton}
                                    />

                                    <Button
                                        title="Already have an account? Login"
                                        onPress={() => router.push("/login")}
                                        variant="outline"
                                        style={styles.loginButton}
                                        textStyle={styles.loginButtonText}
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
    signupButton: {
        marginTop: theme.spacing.md,
    },
    loginButton: {
        marginTop: theme.spacing.md,
        backgroundColor: "transparent",
        borderColor: theme.colors.primary,
    },
    loginButtonText: {
        color: theme.colors.primary,
    },
});
