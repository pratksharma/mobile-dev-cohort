import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import RemixIcon from "react-native-remix-icon";

const Index = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const screenWidth = useSafeAreaFrame().width;
    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require("@/assets/images/logo.png")}
                height={48}
                width={48}
                style={styles.logo}
            />
            <View style={styles.textContainer}>
                <Text style={styles.headText}>Sign In</Text>
                <Text style={styles.subhHeadText}>
                    Let's experience the joy of Prateek's Application.
                </Text>
            </View>
            <View style={[styles.formContainer, { width: screenWidth - 32 }]}>
                <View>
                    <Text style={{ fontWeight: "bold" }}>Email Address</Text>
                    <View>
                        <RemixIcon
                            name="mail-line"
                            size="16"
                            color="black"
                            fallback={null}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            value={credentials.email}
                            onChangeText={(text) => {
                                setCredentials({ ...credentials, email: text });
                            }}
                            placeholder="Enter you email address"
                            style={styles.input}
                        />
                    </View>
                </View>
                <View>
                    <Text style={{ fontWeight: "bold" }}>Password</Text>
                    <View>
                        <RemixIcon
                            name="lock-2-line"
                            size="16"
                            color="black"
                            fallback={null}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            value={credentials.password}
                            onChangeText={(text) => {
                                setCredentials({
                                    ...credentials,
                                    password: text,
                                });
                            }}
                            placeholder="Enter you password"
                            style={styles.input}
                        />
                        <RemixIcon
                            name="eye-off-line"
                            size="16"
                            color="#7c7c7c"
                            fallback={null}
                            style={styles.eyeIcon}
                        />
                    </View>
                </View>
                <Pressable style={styles.button}>
                    <Text style={{ color: "white" }}>Sign In</Text>
                    <RemixIcon
                        name="arrow-right-long-line"
                        size="16"
                        color="white"
                        fallback={null}
                    />
                </Pressable>
            </View>
            <View style={styles.socialIconContainer}>
                <View style={styles.socialIcon}>
                    <RemixIcon
                        name="facebook-fill"
                        size="24"
                        color="black"
                        fallback={null}
                    />
                </View>
                <View style={styles.socialIcon}>
                    <RemixIcon
                        name="google-fill"
                        size="24"
                        color="black"
                        fallback={null}
                    />
                </View>
                <View style={styles.socialIcon}>
                    <RemixIcon
                        name="instagram-fill"
                        size="24"
                        color="black"
                        fallback={null}
                    />
                </View>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.subhHeadText}>
                    Don't have an account?{" "}
                    <Text style={styles.link}>Sign Up.</Text>
                </Text>
                <Text style={[styles.subhHeadText, styles.link]}>
                    Forgot your password?
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 16,
        gap: 24,
    },
    logo: {
        height: 48,
        width: 48,
        marginTop: 32,
    },
    headText: {
        fontSize: 32,
        fontWeight: "bold",
    },
    subhHeadText: {
        fontSize: 16,
        textAlign: "center",
        color: "#666666",
    },
    textContainer: {
        alignItems: "center",
    },
    formContainer: {
        gap: 16,
    },
    input: {
        borderColor: "#666666",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        paddingLeft: 40,
        height: 48,
    },
    inputIcon: {
        position: "absolute",
        top: 16,
        left: 12,
    },
    eyeIcon: {
        position: "absolute",
        top: 16,
        right: 12,
    },
    button: {
        padding: 12,
        backgroundColor: "black",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        borderRadius: 12,
        height: 48,
    },
    socialIconContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    socialIcon: {
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 1,
        padding: 10,
        borderRadius: 16,
    },
    link: {
        textDecorationColor: "black",
        textDecorationStyle: "solid",
        textDecorationLine: "underline",
        color: "black",
    },
});
