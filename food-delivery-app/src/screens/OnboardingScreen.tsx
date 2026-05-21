import { useNavigation } from "@react-navigation/native";
import {
    ImageBackground,
    StyleSheet,
    Pressable,
    Text,
    View,
    StatusBar,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Onboarding = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                style={styles.onboardingBackground}
                source={require("../../assets/onboarding.jpg")}
            />
            <View style={styles.bottomContainer}>
                <Text style={styles.title}>
                    Discover Delicious Meals Near You
                </Text>
                <Text style={styles.subTitle}>
                    Handpicked restaurants, fast delivery, and offers you'll
                    love.
                </Text>
                <Pressable
                    // @ts-ignore
                    onPress={() => navigation.navigate("Login")}
                    style={styles.getStartedButton}
                >
                    <Text style={styles.getStartedButtonText}>Get Started</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default Onboarding;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: "#000",
    },
    onboardingBackground: {
        ...StyleSheet.absoluteFill,
        flex: 1,
        backgroundColor: "red",
    },
    bottomContainer: {
        width: "100%",
        paddingHorizontal: 24,
        paddingBottom: 48,
    },
    getStartedButton: {
        backgroundColor: "#ffffff",
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
        minWidth: 220,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
    },
    getStartedButtonText: {
        color: "#111",
        fontWeight: "700",
        fontSize: 16,
    },
    title: {
        fontSize: 28,
        fontFamily: "DMSans-Bold",
        lineHeight: 32,
        marginBottom: 4,
        color: "#fff",
        textAlign: "center",
    },
    subTitle: {
        fontSize: 15,
        color: "rgba(255,255,255,0.92)",
        fontFamily: "DMSans-Medium",
        textAlign: "center",
        marginTop: 6,
        marginBottom: 10,
        lineHeight: 20,
        paddingHorizontal: 12,
    },
});
