import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-remix-icon";
import { useOrders } from "../context/OrdersContext";

export default function CartScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { clearOrders } = useOrders();
    const payableAmount = route.params?.payableAmount || "0.00";

    const handlePlaceOrder = () => {
        const orderId = "FD-20486";

        clearOrders();
        navigation.navigate("OrderConfirmation", {
            orderId,
            payableAmount,
            deliverTo: "Home address",
            estimatedTime: "25-30 min",
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon
                        name="arrow-left-s-line"
                        size={20}
                        color="#111111"
                        fallback={null}
                    />
                </Pressable>

                <Text style={styles.title}>Cart</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardLabel}>Payable amount</Text>
                <Text style={styles.amount}>₹{payableAmount}</Text>
                <Text style={styles.cardText}>
                    Review the amount and place your order when you are ready.
                </Text>
            </View>

            <Pressable
                style={styles.placeOrderButton}
                onPress={handlePlaceOrder}
            >
                <Text style={styles.placeOrderText}>Place Order</Text>
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
        gap: 12,
        marginBottom: 18,
    },
    backButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        padding: 8,
        borderRadius: 999,
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
        marginBottom: 16,
    },
    cardLabel: {
        color: "#7a7a7a",
        fontSize: 14,
        fontFamily: "DMSans-Medium",
        marginBottom: 8,
    },
    amount: {
        color: "#111111",
        fontSize: 32,
        fontFamily: "DMSans-Bold",
        letterSpacing: -0.8,
        marginBottom: 10,
    },
    cardText: {
        color: "#6f6f6f",
        fontSize: 14,
        lineHeight: 21,
        fontFamily: "DMSans-Regular",
    },
    placeOrderButton: {
        height: 52,
        borderRadius: 16,
        backgroundColor: "#111111",
        alignItems: "center",
        justifyContent: "center",
    },
    placeOrderText: {
        color: "#ffffff",
        fontSize: 15,
        fontFamily: "DMSans-SemiBold",
    },
});
