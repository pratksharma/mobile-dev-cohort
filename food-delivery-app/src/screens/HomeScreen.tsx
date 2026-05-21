import { useNavigation } from "@react-navigation/native";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Pressable,
} from "react-native";
import React from "react";
import { restaurants } from "../constants/data";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-remix-icon";

const HomeScreen = () => {
    const navigation = useNavigation();

    const renderRestaurantCard = ({
        item,
    }: {
        item: (typeof restaurants)[0];
    }) => (
        <Pressable
            style={styles.card}
            onPress={() =>
                // @ts-ignore
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
            <View style={styles.pageHeader}>
                <Text style={styles.title}>Restaurants</Text>
                <Text style={styles.subtitle}>
                    Minimal picks, delivered fast.
                </Text>
            </View>
            <FlatList
                data={restaurants}
                renderItem={renderRestaurantCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                scrollEnabled={true}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f6f3",
    },
    pageHeader: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
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
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 24,
        gap: 12,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ece9e2",
    },
    image: {
        width: "100%",
        height: 160,
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
