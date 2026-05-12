import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Save, Trash2 } from "lucide-react-native";
import { notes, deleteNote, updateNote } from "@/constants/notes";

const Note = () => {
    const { noteId } = useLocalSearchParams();
    const currentNoteId = parseInt(Array.isArray(noteId) ? noteId[0] : noteId);
    const note = notes.find((element) => element.id == currentNoteId);
    const [draftTitle, setDraftTitle] = useState(note?.title ?? "");
    const [draftNote, setDraftNote] = useState(note?.note ?? "");

    useEffect(() => {
        setDraftTitle(note?.title ?? "");
        setDraftNote(note?.note ?? "");
    }, [note]);

    const handleSave = () => {
        updateNote(currentNoteId, draftTitle.trim(), draftNote.trim());
        router.replace("/");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.navigate("..")}
                    style={styles.backButton}
                >
                    <ChevronLeft />
                </Pressable>
                <View style={styles.headerRight}>
                    <Pressable
                        onPress={() => {
                            deleteNote(currentNoteId);
                            router.replace("/");
                        }}
                        style={deleteButtonStyles}
                    >
                        <Trash2 color="red" size={16} />
                    </Pressable>
                    <Pressable onPress={handleSave} style={styles.saveButton}>
                        <Save color="#ffffff" size={12} />
                        <Text style={styles.saveButtonText}>Save</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.bannerContainer}>
                <Image
                    source={require("../../assets/banner.jpg")}
                    style={styles.bannerImage}
                />
            </View>
            <View style={styles.content}>
                <TextInput
                    style={styles.noteTitle}
                    value={draftTitle}
                    onChangeText={setDraftTitle}
                    placeholder="Heading"
                />
                <TextInput
                    style={styles.noteBody}
                    value={draftNote}
                    onChangeText={setDraftNote}
                    placeholder="Enter Note"
                    multiline
                    textAlignVertical="top"
                />
            </View>
        </SafeAreaView>
    );
};

export default Note;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5e6e1",
    },
    header: {
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerRight: {
        flexDirection: "row",
        gap: 8,
    },
    backButton: {
        height: 32,
        width: 32,
        padding: 4,
        backgroundColor: "#d6d6d6",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "#ff000020",
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#000000",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100,
        gap: 8,
    },
    saveButtonText: {
        fontSize: 12,
        color: "#ffffff",
        fontFamily: "DMSans-Medium",
    },
    bannerContainer: {
        paddingHorizontal: 16,
    },
    bannerImage: {
        height: 120,
        width: "auto",
        objectFit: "cover",
        borderRadius: 12,
    },
    content: {
        padding: 16,
        paddingTop: 8,
    },
    noteTitle: {
        fontFamily: "DMSans-Bold",
        fontSize: 32,
    },
    noteBody: {
        fontFamily: "DMSans-regular",
        fontSize: 16,
    },
});

let deleteButtonStyles = StyleSheet.flatten([
    styles.backButton,
    styles.deleteButton,
]);
