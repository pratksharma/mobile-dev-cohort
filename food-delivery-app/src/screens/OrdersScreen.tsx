import React from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrders } from "../context/OrdersContext";

export default function OrdersScreen() {
    const navigation = useNavigation<any>();
    const { orders } = useOrders();
    const payableAmount = orders.reduce((sum, order) => {
        const amount = Number(order.total.replace("₹", ""));
        return sum + (Number.isNaN(amount) ? 0 : amount);
    }, 0);

    const handleCheckout = () => {
        navigation.navigate("Cart", {
            payableAmount: payableAmount.toFixed(0),
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Orders</Text>
                <Text style={styles.subtitle}>
                    Track recent deliveries here.
                </Text>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.image}
                        />
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.restaurant}>
                                    {item.restaurant}
                                </Text>
                                <Text style={styles.total}>{item.total}</Text>
                            </View>
                        </View>
                    </View>
                )}
            />

            <View style={styles.checkoutWrap}>
                <Pressable
                    style={[
                        styles.checkoutButton,
                        !orders.length && styles.checkoutButtonDisabled,
                    ]}
                    onPress={handleCheckout}
                    disabled={!orders.length}
                >
                    <Text style={styles.checkoutButtonText}>Checkout</Text>
                    <Text style={styles.checkoutAmount}>
                        ₹{payableAmount.toFixed(0)}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f6f3",
        paddingTop: 12,
    },
    header: {
        marginBottom: 18,
        paddingHorizontal: 20,
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
    checkoutButton: {
        marginHorizontal: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: "#111111",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    checkoutButtonDisabled: {
        backgroundColor: "#7a7a7a",
    },
    checkoutWrap: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: 16,
        paddingTop: 8,
        backgroundColor: "#f7f6f3",
    },
    checkoutButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontFamily: "DMSans-SemiBold",
    },
    checkoutAmount: {
        color: "#ffffff",
        fontSize: 15,
        fontFamily: "DMSans-Bold",
    },
    listContent: {
        gap: 12,
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    list: {
        flex: 1,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#ece9e2",
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 150,
        backgroundColor: "#e9e6df",
    },
    cardContent: {
        padding: 16,
        gap: 6,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
    },
    restaurant: {
        flex: 1,
        color: "#1a1a1a",
        fontSize: 16,
        fontFamily: "DMSans-SemiBold",
    },
    total: {
        color: "#111111",
        fontSize: 15,
        fontFamily: "DMSans-Bold",
    },
    status: {
        color: "#3c3c3c",
        fontSize: 14,
        fontFamily: "DMSans-Medium",
    },
    eta: {
        color: "#7a7a7a",
        fontSize: 13,
        fontFamily: "DMSans-Regular",
    },
});
