import { StyleSheet, Text, View } from "react-native";

export const Avatar = ({ name, size = 40, style }) => {
    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const initials = getInitials(name);

    // Generate a consistent color based on name
    const getColorFromName = (name) => {
        const colors = [
            "#6366F1",
            "#EC4899",
            "#10B981",
            "#F59E0B",
            "#8B5CF6",
            "#06B6D4",
        ];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    const backgroundColor = getColorFromName(name);

    return (
        <View
            style={[
                styles.avatar,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor,
                },
                style,
            ]}
        >
            <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
                {initials}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        alignItems: "center",
        justifyContent: "center",
    },
    initials: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
});
