import React from "react";
import { CommonActions } from "@react-navigation/native";
import {
    createDrawerNavigator,
    type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-remix-icon";
import { user } from "../../constants/user";
import HelpScreen from "../../screens/HelpScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import SettingsScreen from "../../screens/SettingsScreen";
import { SafeAreaView } from "react-native-safe-area-context";

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }: DrawerContentComponentProps) {
    const displayName = user.name || "Foodie User";
    const displayEmail = user.email || "hello@foodie.app";

    const navigateToTab = (routeName: string) => {
        navigation.getParent()?.navigate(routeName);
        navigation.closeDrawer();
    };

    const navigateToDrawerScreen = (routeName: string) => {
        navigation.navigate(routeName as never);
        navigation.closeDrawer();
    };

    const handleLogout = () => {
        navigation.closeDrawer();
        navigation
            .getParent()
            ?.getParent()
            ?.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                }),
            );
    };

    return (
        <SafeAreaView style={styles.drawerContainer}>
            <Text style={styles.drawerTitle}>Menu</Text>

            <View style={styles.profileCard}>
                <Image source={user.profile} style={styles.avatar} />
                <View style={styles.profileText}>
                    <Text style={styles.name}>{displayName}</Text>
                    <Text style={styles.email}>{displayEmail}</Text>
                </View>
            </View>

            <View style={styles.menuList}>
                <Pressable
                    style={styles.menuItem}
                    onPress={() => navigateToTab("Orders")}
                >
                    <View style={styles.menuIconWrap}>
                        <Icon
                            name="shopping-bag-3-line"
                            size={18}
                            color="#111111"
                            fallback={null}
                        />
                    </View>
                    <Text style={styles.menuLabel}>My Orders</Text>
                </Pressable>

                <Pressable
                    style={styles.menuItem}
                    onPress={() => navigateToDrawerScreen("Settings")}
                >
                    <View style={styles.menuIconWrap}>
                        <Icon
                            name="settings-3-line"
                            size={18}
                            color="#111111"
                            fallback={null}
                        />
                    </View>
                    <Text style={styles.menuLabel}>Settings</Text>
                </Pressable>

                <Pressable
                    style={styles.menuItem}
                    onPress={() => {
                        navigation.navigate("Help");
                        navigation.closeDrawer();
                    }}
                >
                    <View style={styles.menuIconWrap}>
                        <Icon
                            name="question-line"
                            size={18}
                            color="#111111"
                            fallback={null}
                        />
                    </View>
                    <Text style={styles.menuLabel}>Help</Text>
                </Pressable>

                <Pressable style={styles.menuItem} onPress={handleLogout}>
                    <View style={[styles.menuIconWrap, styles.logoutIconWrap]}>
                        <Icon
                            name="logout-circle-r-line"
                            size={18}
                            color="#b42318"
                            fallback={null}
                        />
                    </View>
                    <Text style={[styles.menuLabel, styles.logoutLabel]}>
                        Logout
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

export default function ProfileDrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerPosition: "right",
                drawerType: "front",
                drawerStyle: {
                    width: 310,
                    backgroundColor: "#fbfaf7",
                },
            }}
        >
            <Drawer.Screen name="ProfileHome" component={ProfileScreen} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
            <Drawer.Screen name="Help" component={HelpScreen} />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        paddingHorizontal: 18,
        paddingTop: 28,
    },
    drawerTitle: {
        color: "#111111",
        fontSize: 28,
        fontFamily: "DMSans-Bold",
        letterSpacing: -0.6,
        marginBottom: 18,
    },
    profileCard: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ece9e2",
        borderRadius: 20,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 16,
        resizeMode: "cover",
    },
    profileText: {
        flex: 1,
    },
    name: {
        color: "#111111",
        fontSize: 16,
        fontFamily: "DMSans-SemiBold",
    },
    email: {
        marginTop: 3,
        color: "#7a7a7a",
        fontSize: 13,
        fontFamily: "DMSans-Regular",
    },
    menuList: {
        gap: 10,
    },
    menuItem: {
        minHeight: 56,
        borderRadius: 16,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ece9e2",
        gap: 12,
    },
    menuIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f1ea",
    },
    logoutIconWrap: {
        backgroundColor: "#fef3f2",
    },
    menuLabel: {
        flex: 1,
        color: "#1a1a1a",
        fontSize: 15,
        fontFamily: "DMSans-Medium",
    },
    logoutLabel: {
        color: "#b42318",
    },
});
