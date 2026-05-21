import { useEffect } from "react";
import StackNavigator from "./src/navigator/stack/StackNavigator";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
    const [loaded] = useFonts({
        "DMSans-Regular": require("./assets/fonts/DMSans-Regular.ttf"),
        "DMSans-Medium": require("./assets/fonts/DMSans-Medium.ttf"),
        "DMSans-SemiBold": require("./assets/fonts/DMSans-SemiBold.ttf"),
        "DMSans-Bold": require("./assets/fonts/DMSans-Bold.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);
    return <StackNavigator />;
}
