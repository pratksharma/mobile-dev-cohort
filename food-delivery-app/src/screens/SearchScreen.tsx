import React from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-remix-icon";

const suggestions = ["Pizza", "Burgers", "Sushi", "Salads", "Desserts"];

export default function SearchScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Search</Text>
                <Text style={styles.subtitle}>
                    Find dishes, restaurants, and cravings fast.
                </Text>
            </View>

            <View style={styles.searchBar}>
                <Icon
                    name="search-line"
                    size={18}
                    color="#8a8a8a"
                    fallback={null}
                />
                <TextInput
                    placeholder="Search food or restaurants"
                    placeholderTextColor="#8a8a8a"
                    style={styles.input}
                />
            </View>

            <Text style={styles.sectionTitle}>Popular searches</Text>
            <FlatList
                data={suggestions}
                keyExtractor={(item) => item}
                numColumns={2}
                columnWrapperStyle={styles.suggestionRow}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <Pressable style={styles.suggestionChip}>
                        <Text style={styles.suggestionText}>{item}</Text>
                    </Pressable>
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
    searchBar: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ece9e2",
        borderRadius: 16,
        paddingHorizontal: 14,
        height: 52,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    input: {
        flex: 1,
        color: "#111111",
        fontSize: 15,
        fontFamily: "DMSans-Regular",
    },
    sectionTitle: {
        marginTop: 22,
        marginBottom: 12,
        fontSize: 16,
        fontFamily: "DMSans-SemiBold",
        color: "#1a1a1a",
    },
    listContent: {
        gap: 12,
        paddingBottom: 24,
    },
    suggestionRow: {
        gap: 12,
    },
    suggestionChip: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ece9e2",
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
    },
    suggestionText: {
        color: "#1a1a1a",
        fontSize: 14,
        fontFamily: "DMSans-Medium",
    },
});
