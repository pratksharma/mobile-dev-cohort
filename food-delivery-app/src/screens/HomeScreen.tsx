import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-remix-icon";
import { restaurants } from "../constants/data";

const filters = ["All", "Top rated", "Fast delivery", "Offers"];

const offers = [
    {
        title: "Flat 20% off",
        subtitle: "On your first order this week",
        tag: "New users",
        color: "#111111",
    },
    {
        title: "Free delivery",
        subtitle: "On orders above ₹199",
        tag: "Limited time",
        color: "#b42318",
    },
];

const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const [selectedFilter, setSelectedFilter] = React.useState("All");

    const renderRestaurantCard = ({
        item,
    }: {
        item: (typeof restaurants)[0];
    }) => (
        <Pressable
            style={styles.card}
            onPress={() =>
                navigation.navigate("RestaurantDetailScreen", {
                    restaurant: item,
                })
            }
        >
            <View style={styles.imageWrap}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.timeChip}>
                    <Icon
                        name="time-line"
                        size={12}
                        color="#1f1f1f"
                        fallback={null}
                    />
                    <Text style={styles.timeChipText}>{item.deliveryTime}</Text>
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.specialty}>{item.specialty}</Text>
                    </View>
                    <View style={styles.rating}>
                        <Icon
                            name="star-fill"
                            size={13}
                            color="#d97706"
                            fallback={null}
                        />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <FlatList
                data={restaurants}
                renderItem={renderRestaurantCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <View style={styles.pageHeader}>
                            <View style={styles.headerTopRow}>
                                <View>
                                    <Text style={styles.kicker}>
                                        Food delivery
                                    </Text>
                                    <Text style={styles.title}>
                                        Fresh meals, quick offers
                                    </Text>
                                </View>
                                <View style={styles.headerBadge}>
                                    <Icon
                                        name="discount-percent-line"
                                        size={16}
                                        color="#111111"
                                        fallback={null}
                                    />
                                    <Text style={styles.headerBadgeText}>
                                        Deals
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.subtitle}>
                                Browse simple offers, pick a filter, and order
                                from top restaurants nearby.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Offers</Text>
                                <Text style={styles.sectionLink}>View all</Text>
                            </View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.offersRow}
                            >
                                {offers.map((offer) => (
                                    <View
                                        key={offer.title}
                                        style={[
                                            styles.offerCard,
                                            { backgroundColor: offer.color },
                                        ]}
                                    >
                                        <Text style={styles.offerTag}>
                                            {offer.tag}
                                        </Text>
                                        <Text style={styles.offerTitle}>
                                            {offer.title}
                                        </Text>
                                        <Text style={styles.offerSubtitle}>
                                            {offer.subtitle}
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Filters</Text>
                                <Text style={styles.sectionLink}>
                                    Simple picks
                                </Text>
                            </View>
                            <View style={styles.filtersRow}>
                                {filters.map((filter) => {
                                    const active = filter === selectedFilter;

                                    return (
                                        <Pressable
                                            key={filter}
                                            onPress={() =>
                                                setSelectedFilter(filter)
                                            }
                                            style={[
                                                styles.filterChip,
                                                active &&
                                                    styles.filterChipActive,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.filterText,
                                                    active &&
                                                        styles.filterTextActive,
                                                ]}
                                            >
                                                {filter}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>
                                    Restaurants
                                </Text>
                                <Text style={styles.sectionLink}>
                                    {restaurants.length} places
                                </Text>
                            </View>
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f6f3",
    },
    listContent: {
        paddingBottom: 24,
    },
    pageHeader: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    headerTopRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
    },
    kicker: {
        fontSize: 12,
        fontFamily: "DMSans-SemiBold",
        color: "#b42318",
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
    title: {
        fontSize: 32,
        fontFamily: "DMSans-Bold",
        color: "#121212",
        letterSpacing: -0.6,
        marginTop: 4,
        lineHeight: 36,
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
        fontFamily: "DMSans-Regular",
        color: "#737373",
        lineHeight: 20,
    },
    headerBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ece9e2",
    },
    headerBadgeText: {
        color: "#111111",
        fontSize: 12,
        fontFamily: "DMSans-SemiBold",
    },
    section: {
        marginTop: 14,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: "DMSans-Bold",
        color: "#111111",
    },
    sectionLink: {
        color: "#7a7a7a",
        fontSize: 13,
        fontFamily: "DMSans-Medium",
    },
    offersRow: {
        paddingHorizontal: 20,
        gap: 12,
    },
    offerCard: {
        width: 240,
        borderRadius: 22,
        padding: 18,
    },
    offerTag: {
        color: "rgba(255,255,255,0.75)",
        fontSize: 12,
        fontFamily: "DMSans-Medium",
        marginBottom: 14,
    },
    offerTitle: {
        color: "#ffffff",
        fontSize: 22,
        lineHeight: 28,
        fontFamily: "DMSans-Bold",
        letterSpacing: -0.4,
    },
    offerSubtitle: {
        marginTop: 10,
        color: "rgba(255,255,255,0.8)",
        fontSize: 13,
        lineHeight: 19,
        fontFamily: "DMSans-Regular",
    },
    filtersRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        paddingHorizontal: 20,
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ece9e2",
    },
    filterChipActive: {
        backgroundColor: "#111111",
        borderColor: "#111111",
    },
    filterText: {
        color: "#5e5e5e",
        fontSize: 13,
        fontFamily: "DMSans-Medium",
    },
    filterTextActive: {
        color: "#ffffff",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ece9e2",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
        marginHorizontal: 20,
        marginBottom: 12,
    },
    image: {
        width: "100%",
        height: 170,
        backgroundColor: "#f0f0f0",
    },
    imageWrap: {
        position: "relative",
    },
    timeChip: {
        position: "absolute",
        left: 12,
        bottom: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    timeChipText: {
        fontSize: 12,
        fontFamily: "DMSans-Medium",
        color: "#1f1f1f",
    },
    content: {
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
    },
    name: {
        fontSize: 18,
        fontFamily: "DMSans-SemiBold",
        color: "#1a1a1a",
        marginBottom: 2,
    },
    specialty: {
        fontSize: 13,
        fontFamily: "DMSans-Regular",
        color: "#888",
    },
    rating: {
        backgroundColor: "#f4f1ea",
        paddingHorizontal: 10,
        paddingVertical: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        borderRadius: 999,
    },
    ratingText: {
        fontSize: 12,
        fontFamily: "DMSans-Medium",
        color: "#2b2b2b",
    },
});

export default HomeScreen;
