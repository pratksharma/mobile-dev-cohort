import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-remix-icon";
import { user } from "../constants/user";

const profileActions = [
    { label: "Saved addresses", icon: "map-pin-2-line" },
    { label: "Payment methods", icon: "bank-card-line" },
    { label: "Notifications", icon: "notification-3-line" },
    { label: "Help center", icon: "question-line" },
];

export default function ProfileScreen() {
    const navigation = useNavigation<any>();
    const displayName = user.name || "Foodie User";
    const displayEmail = user.email || "hello@foodie.app";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.headerText}>
                    <Text style={styles.title}>Profile</Text>
                    <Text style={styles.subtitle}>
                        Manage your account and delivery preferences.
                    </Text>
                </View>

                <Pressable
                    style={styles.menuButton}
                    onPress={() => navigation.openDrawer()}
                >
                    <Icon
                        name="menu-3-line"
                        size={24}
                        color="#111111"
                        fallback={null}
                    />
                </Pressable>
            </View>

            <View style={styles.profileCard}>
                <Image source={user.profile} style={styles.avatar} />
                <View style={styles.profileText}>
                    <Text style={styles.name}>{displayName}</Text>
                    <Text style={styles.email}>{displayEmail}</Text>
                </View>
            </View>

            <View style={styles.actionList}>
                {profileActions.map((action) => (
                    <Pressable key={action.label} style={styles.actionItem}>
                        <View style={styles.actionIconWrap}>
                            <Icon
                                // @ts-ignore
                                name={action.icon}
                                size={18}
                                color="#111111"
                                fallback={null}
                            />
                        </View>
                        <Text style={styles.actionLabel}>{action.label}</Text>
                        <Icon
                            name="arrow-right-s-line"
                            size={18}
                            color="#a1a1a1"
                            fallback={null}
                        />
                    </Pressable>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f6f3",
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 18,
    },
    menuButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ece9e2",
    },
    headerText: {
        flex: 1,
        paddingRight: 4,
    },
    title: {
        fontSize: 30,
        fontFamily: "DMSans-Bold",
        color: "#121212",
        letterSpacing: -0.6,
    },
    subtitle: {
        marginTop: 4,
        fontSize: 14,
        fontFamily: "DMSans-Regular",
        color: "#737373",
    },
    profileCard: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ece9e2",
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 16,
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        marginBottom: 18,
    },
    avatar: {
        width: 92,
        height: 92,
        borderRadius: 46,
        resizeMode: "cover",
    },
    profileText: {
        alignItems: "center",
    },
    name: {
        color: "#111111",
        fontSize: 18,
        fontFamily: "DMSans-SemiBold",
        textAlign: "center",
    },
    email: {
        marginTop: 3,
        color: "#7a7a7a",
        fontSize: 13,
        fontFamily: "DMSans-Regular",
        textAlign: "center",
    },
    actionList: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ece9e2",
        borderRadius: 20,
        overflow: "hidden",
    },
    actionItem: {
        minHeight: 62,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        gap: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#ece9e2",
    },
    actionIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f1ea",
    },
    actionLabel: {
        flex: 1,
        color: "#1a1a1a",
        fontSize: 15,
        fontFamily: "DMSans-Medium",
    },
});
