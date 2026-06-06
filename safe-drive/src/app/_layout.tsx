import { Tabs } from "expo-router";
import { Car, History } from "lucide-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppTabBar } from "../components/app-tab-bar";
import { DriveHistoryProvider } from "../lib/drive-history";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <DriveHistoryProvider>
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarHideOnKeyboard: true,
                        sceneStyle: {
                            backgroundColor: "#eef3f9",
                        },
                    }}
                    tabBar={(props) => <AppTabBar {...props} />}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: "Drive",
                            tabBarIcon: ({ color, size }) => (
                                <Car color={color} size={size} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="history"
                        options={{
                            title: "History",
                            tabBarIcon: ({ color, size }) => (
                                <History color={color} size={size} />
                            ),
                        }}
                    />
                </Tabs>
            </DriveHistoryProvider>
        </SafeAreaProvider>
    );
}
