import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import OnboardingScreen from "../../screens/OnboardingScreen";
import RestaurantDetailScreen from "../../screens/RestaurantDetailScreen";
import CartScreen from "../../screens/Cart";
import SignUpScreen from "../../screens/SignUpScreen";
import OrderConfirmationScreen from "../../screens/OrderConfirmationScreen";
import TabsNavigator from "../tabs/TabsNavigator";

const Stack = createNativeStackNavigator();

const linking = {
    prefixes: [Linking.createURL("/"), "foodapp://"],
    config: {
        screens: {
            Onboarding: "onboarding",
            MainTabs: "tabs",
            RestaurantDetailScreen: {
                path: "restaurant/:restaurantId",
                parse: {
                    restaurantId: Number,
                },
            },
            Cart: "cart",
            OrderConfirmation: "order-confirmation",
            Login: "login",
        },
    },
};

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
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen
                name="OrderConfirmation"
                component={OrderConfirmationScreen}
            />
            <Stack.Screen name="Login" component={SignUpScreen} />
        </Stack.Navigator>
    );
}

export default function StackNavigator() {
    return (
        <NavigationContainer linking={linking}>
            <MyStack />
        </NavigationContainer>
    );
}
