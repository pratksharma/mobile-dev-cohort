import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrders } from "../context/OrdersContext";

export default function OrdersScreen() {
    const { orders } = useOrders();

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
                            <Text style={styles.status}>{item.status}</Text>
                            <Text style={styles.eta}>{item.eta}</Text>
                        </View>
                    </View>
                )}
            />
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
        marginBottom: 18,
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
    listContent: {
        gap: 12,
        paddingBottom: 24,
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
