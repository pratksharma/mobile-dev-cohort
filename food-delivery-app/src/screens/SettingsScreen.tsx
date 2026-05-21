import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-remix-icon";

export default function SettingsScreen() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>

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

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Account preferences</Text>
                <Text style={styles.cardText}>
                    Manage delivery addresses, payment methods, notifications,
                    and profile details from one place.
                </Text>
            </View>

            <Pressable
                style={styles.backButton}
                onPress={() => navigation.navigate("ProfileHome")}
            >
                <Text style={styles.backButtonText}>Back to profile</Text>
            </Pressable>
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
    title: {
        fontSize: 30,
        fontFamily: "DMSans-Bold",
        color: "#121212",
        letterSpacing: -0.6,
    },
    card: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ece9e2",
        borderRadius: 20,
        padding: 18,
    },
    cardTitle: {
        color: "#111111",
        fontSize: 20,
        fontFamily: "DMSans-SemiBold",
        marginBottom: 8,
    },
    cardText: {
        color: "#6f6f6f",
        fontSize: 15,
        lineHeight: 22,
        fontFamily: "DMSans-Regular",
    },
    backButton: {
        marginTop: 16,
        alignSelf: "flex-start",
        paddingHorizontal: 16,
        height: 46,
        borderRadius: 14,
        backgroundColor: "#111111",
        alignItems: "center",
        justifyContent: "center",
    },
    backButtonText: {
        color: "#ffffff",
        fontSize: 14,
        fontFamily: "DMSans-SemiBold",
    },
});
