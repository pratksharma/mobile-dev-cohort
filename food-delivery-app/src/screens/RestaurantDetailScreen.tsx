import { useNavigation, useRoute } from "@react-navigation/native";
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    FlatList,
    Pressable,
} from "react-native";
import { useOrders } from "../context/OrdersContext";
import Icon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

const RestaurantDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orders, addOrder } = useOrders();

    // @ts-ignore
    const { restaurant } = route.params || {};

    if (!restaurant) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.empty}>No restaurant data.</Text>
            </SafeAreaView>
        );
    }

    const renderDish = ({ item }: { item: any }) => {
        const disabled = orders.some((order) => order.dishId === item.id);
        return (
            <View style={styles.dishCard}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.dishImage}
                    resizeMode="cover"
                />
                <View style={styles.dishContent}>
                    <Text style={styles.dishName}>{item.name}</Text>
                    <Text
                        style={styles.dishDescription}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item.description}
                    </Text>
                    <View style={styles.dishFooter}>
                        <Text style={styles.price}>
                            ₹{item.price.toFixed(0)}
                        </Text>
                        <Pressable
                            style={[
                                styles.addButton,
                                disabled && styles.addButtonDisabled,
                            ]}
                            onPress={() => addOrder(restaurant.name, item)}
                            disabled={disabled}
                        >
                            <Text style={styles.addButtonText}>
                                {disabled ? "Added" : "Add"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.headerImageWrap}>
                    <Image
                        source={{ uri: restaurant.image }}
                        style={styles.headerImage}
                    />
                    <Pressable
                        style={styles.backButton}
                        // @ts-ignore
                        onPress={() => navigation.goBack()}
                    >
                        <Icon
                            name="arrow-left-s-line"
                            size={20}
                            color="#111"
                            fallback={null}
                        />
                    </Pressable>
                </View>

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <View>
                            <Text style={styles.name}>{restaurant.name}</Text>
                            <Text style={styles.specialty}>
                                {restaurant.specialty}
                            </Text>
                        </View>
                        <View style={styles.rating}>
                            <Icon
                                name="star-fill"
                                size={13}
                                color="#d97706"
                                fallback={null}
                            />
                            <Text style={styles.ratingText}>
                                {restaurant.rating}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.description}>
                        {restaurant.description}
                    </Text>

                    <Text style={styles.sectionTitle}>Menu</Text>
                    <FlatList
                        data={restaurant.dishes}
                        renderItem={renderDish}
                        keyExtractor={(i) => i.id.toString()}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 12 }} />
                        )}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f6f3",
    },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    empty: { fontSize: 16, color: "#444" },
    headerImageWrap: {
        position: "relative",
        width: "100%",
        height: 220,
    },
    headerImage: {
        width: "100%",
        height: "100%",
    },
    backButton: {
        position: "absolute",
        left: 14,
        top: 14,
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 8,
        borderRadius: 999,
    },
    content: {
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 30,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    name: {
        fontSize: 22,
        fontFamily: "DMSans-Bold",
        color: "#111",
    },
    specialty: {
        fontSize: 14,
        fontFamily: "DMSans-Regular",
        color: "#7a7a7a",
    },
    rating: {
        backgroundColor: "#f4f1ea",
        paddingHorizontal: 10,
        paddingVertical: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
    },
    ratingText: {
        fontSize: 13,
        fontFamily: "DMSans-Medium",
        color: "#2b2b2b",
        marginLeft: 6,
    },
    description: {
        marginTop: 8,
        fontSize: 14,
        color: "#555",
        fontFamily: "DMSans-Regular",
    },
    sectionTitle: {
        marginTop: 18,
        marginBottom: 8,
        fontSize: 18,
        fontFamily: "DMSans-SemiBold",
        color: "#111",
    },
    dishCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ece9e2",
        height: 96,
    },
    dishImage: {
        width: 96,
        height: 96,
        backgroundColor: "#eee",
    },
    dishContent: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        justifyContent: "space-between",
    },
    dishName: {
        fontSize: 15,
        fontFamily: "DMSans-SemiBold",
        color: "#111",
    },
    dishDescription: {
        fontSize: 12,
        color: "#777",
        marginTop: 4,
    },
    dishFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    price: {
        fontSize: 14,
        fontFamily: "DMSans-Medium",
        color: "#111",
    },
    addButton: {
        backgroundColor: "#111",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addButtonDisabled: {
        backgroundColor: "#7a7a7a",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 13,
        fontFamily: "DMSans-Medium",
    },
});

export default RestaurantDetailScreen;
