import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Save } from "lucide-react-native";
import { saveNote } from "@/constants/notes";

const AddNotes = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const handleSave = () => {
        saveNote(title.trim(), body.trim());
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
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                style={styles.content}
            >
                <TextInput
                    style={styles.noteTitle}
                    placeholder="Heading"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.noteBody}
                    placeholder="Enter Note"
                    multiline
                    value={body}
                    onChangeText={setBody}
                    textAlignVertical="top"
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AddNotes;

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
