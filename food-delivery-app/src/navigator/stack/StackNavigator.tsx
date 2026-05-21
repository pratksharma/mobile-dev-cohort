import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../../screens/OnboardingScreen";
import RestaurantDetailScreen from "../../screens/RestaurantDetailScreen";
import Cart from "../../screens/Cart";
import SignUpScreen from "../../screens/SignUpScreen";
import TabsNavigator from "../tabs/TabsNavigator";

const Stack = createNativeStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="MainTabs" component={TabsNavigator} />
            <Stack.Screen
                name="RestaurantDetailScreen"
                component={RestaurantDetailScreen}
            />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="Login" component={SignUpScreen} />
        </Stack.Navigator>
    );
}

export default function StackNavigator() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}
