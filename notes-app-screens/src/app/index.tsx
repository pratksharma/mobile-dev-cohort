import {
    Text,
    View,
    StyleSheet,
    FlatList,
    Pressable,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarDays, ChevronRight, Plus, Search } from "lucide-react-native";
import { Link } from "expo-router";
import { notes } from "@/constants/notes";
import { useState } from "react";

export default function Index() {
    const [searchInput, setSearchInput] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const filteredNotes = (() => {
        let result = [...notes];
        if (searchInput.trim() !== "") {
            result = result.filter((note) =>
                note.title
                    .toLowerCase()
                    .includes(searchInput.trim().toLowerCase()),
            );
        }
        return result;
    })();

    const inputStyle = StyleSheet.compose(
        styles.searchInput,
        isFocused && styles.searchInputFocused,
    );
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Notes</Text>
                <View style={styles.searchInputContainer}>
                    <TextInput
                        // @ts-ignore
                        style={inputStyle}
                        value={searchInput}
                        onChangeText={setSearchInput}
                        placeholder="Search"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <Search style={styles.searchInputIcon} size={16} />
                </View>
            </View>
            <View style={styles.content}>
                <FlatList
                    data={filteredNotes}
                    style={styles.notesContainerBox}
                    contentContainerStyle={styles.notesContainer}
                    showsVerticalScrollIndicator={false}
                    renderItem={(note) => (
                        <Link href={`/${note.item.id}`} asChild>
                            <Pressable style={styles.noteCard}>
                                <View style={styles.noteText}>
                                    <View style={styles.noteDateChip}>
                                        <CalendarDays
                                            size={12}
                                            color="#666666"
                                        />
                                        <Text style={styles.noteDate}>
                                            {note.item.date}
                                        </Text>
                                    </View>
                                    <Text style={styles.noteTitle}>
                                        {note.item.title}
                                    </Text>
                                    <Text style={styles.note} numberOfLines={1}>
                                        {note.item.note}
                                    </Text>
                                </View>
                                <View style={styles.noteButton}>
                                    <ChevronRight />
                                </View>
                            </Pressable>
                        </Link>
                    )}
                />

                <Link href="/add-notes" asChild>
                    <Pressable style={styles.addNotesButton}>
                        <Plus size={18} color="#ffffff" />
                    </Pressable>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5e6e1",
    },
    header: {
        padding: 16,
        gap: 8,
    },
    headerText: {
        fontSize: 32,
        fontFamily: "DMSans-Bold",
        color: "#1a1a1a",
    },
    searchInputContainer: {
        position: "relative",
    },
    searchInput: {
        padding: 8,
        paddingLeft: 36,
        borderRadius: 100,
        fontSize: 16,
        fontFamily: "DMSans-Medium",
        backgroundColor: "#ffffff",
        color: "#1a1a1a",
        borderWidth: 1,
        borderColor: "#ffffff",
    },
    searchInputFocused: {
        borderColor: "black",
        borderWidth: 1,
    },
    searchInputIcon: {
        position: "absolute",
        top: 11,
        left: 12,
    },
    notesContainerBox: {
        padding: 16,
        paddingTop: 0,
    },
    notesContainer: {
        gap: 2,
        borderRadius: 16,
        overflow: "hidden",
    },
    noteCard: {
        padding: 16,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    noteSeparator: {
        backgroundColor: "red,",
    },
    noteText: {
        flexShrink: 1,
        alignItems: "flex-start",
    },
    noteTitle: {
        fontSize: 18,
        marginTop: 6,
        fontFamily: "DMSans-Bold",
        color: "#1a1a1a",
        lineHeight: 24,
    },
    note: {
        fontSize: 14,
        color: "#666666",
        fontFamily: "DMSans-Medium",
        marginTop: 4,
        lineHeight: 18,
    },
    noteDateChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100,
        gap: 4,
    },
    noteDate: {
        fontSize: 12,
        fontFamily: "DMSans-Medium",
        color: "#666666",
    },
    noteButton: {
        padding: 8,
        backgroundColor: "#f5f5f5",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        position: "relative",
    },
    addNotesButton: {
        position: "absolute",
        right: 16,
        bottom: 16,
        backgroundColor: "#000000",
        borderRadius: 999,
        padding: 16,
    },
});
