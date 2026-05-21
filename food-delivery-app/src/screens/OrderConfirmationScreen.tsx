import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-remix-icon";

export default function OrderConfirmationScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const orderId = route.params?.orderId || "FD-20486";
    const payableAmount = route.params?.payableAmount || "0.00";
    const deliverTo = route.params?.deliverTo || "Home address";
    const estimatedTime = route.params?.estimatedTime || "25-30 min";

    const handleGoHome = () => {
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: "MainTabs",
                    params: { screen: "Home" },
                },
            ],
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.badge}>
                <Icon
                    name="checkbox-circle-fill"
                    size={24}
                    color="#15803d"
                    fallback={null}
                />
                <Text style={styles.badgeText}>Order confirmed</Text>
            </View>

            <Text style={styles.title}>Your order is confirmed</Text>
            <Text style={styles.subtitle}>
                A confirmation message has been sent to you.
            </Text>

            <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.label}>Order ID</Text>
                    <Text style={styles.value}>{orderId}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Estimated time to reach</Text>
                    <Text style={styles.value}>{estimatedTime}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Deliver to</Text>
                    <Text style={styles.value}>{deliverTo}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Order status</Text>
                    <Text style={[styles.value, styles.status]}>
                        On the way
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Payable amount</Text>
                    <Text style={styles.value}>₹{payableAmount}</Text>
                </View>
            </View>

            <Pressable style={styles.homeButton} onPress={handleGoHome}>
                <Text style={styles.homeButtonText}>Go Home</Text>
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
    badge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#ecfdf3",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        marginBottom: 18,
    },
    badgeText: {
        color: "#15803d",
        fontSize: 13,
        fontFamily: "DMSans-SemiBold",
    },
    title: {
        color: "#111111",
        fontSize: 30,
        fontFamily: "DMSans-Bold",
        letterSpacing: -0.6,
    },
    subtitle: {
        marginTop: 6,
        color: "#6f6f6f",
        fontSize: 14,
        lineHeight: 21,
        fontFamily: "DMSans-Regular",
        marginBottom: 18,
    },
    card: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ece9e2",
        borderRadius: 20,
        padding: 18,
        gap: 14,
        marginBottom: 18,
    },
    row: {
        gap: 6,
    },
    label: {
        color: "#7a7a7a",
        fontSize: 13,
        fontFamily: "DMSans-Medium",
    },
    value: {
        color: "#111111",
        fontSize: 15,
        fontFamily: "DMSans-SemiBold",
    },
    status: {
        color: "#b42318",
    },
    homeButton: {
        height: 52,
        borderRadius: 16,
        backgroundColor: "#111111",
        alignItems: "center",
        justifyContent: "center",
    },
    homeButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontFamily: "DMSans-SemiBold",
    },
});
