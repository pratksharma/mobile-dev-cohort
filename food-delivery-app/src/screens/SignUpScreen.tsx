import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    Pressable,
    View,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { user } from "../constants/user";

const SignUpScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = () => {
        user.name = name.trim();
        user.email = email.trim().toLowerCase();
        navigation.navigate("MainTabs");
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                style={styles.inner}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Create an account</Text>
                    <Text style={styles.subtitle}>
                        Join Foodie — discover local meals and get them
                        delivered.
                    </Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Full name"
                        placeholderTextColor="rgba(0,0,0,0.4)"
                        style={styles.input}
                        keyboardType="default"
                        autoCapitalize="words"
                    />
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor="rgba(0,0,0,0.4)"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor="rgba(0,0,0,0.4)"
                        style={styles.input}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <Pressable style={styles.button} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>Sign up</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.linkText}>
                            Already have an account? Log in
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    inner: {
        flex: 1,
        justifyContent: "center",
    },
    header: {
        marginBottom: 24,
    },
    title: {
        color: "#000",
        fontSize: 28,
        fontFamily: "DMSans-Bold",
        textAlign: "left",
    },
    subtitle: {
        color: "rgba(0,0,0,0.7)",
        fontFamily: "DMSans-Regular",
        marginTop: 6,
        fontSize: 14,
        lineHeight: 20,
    },
    form: {
        width: "100%",
    },
    input: {
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        color: "#000",
        marginBottom: 12,
        fontSize: 16,
        fontFamily: "DMSans-Regular",
    },
    button: {
        backgroundColor: "#000000",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 8,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 4,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "DMSans-SemiBold",
    },
    linkText: {
        color: "rgba(0,0,0,0.7)",
        textAlign: "center",
        marginTop: 8,
        fontSize: 14,
        fontFamily: "DMSans-Regular",
    },
});
