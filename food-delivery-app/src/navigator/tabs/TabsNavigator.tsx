import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-remix-icon";
import HomeScreen from "../../screens/HomeScreen";
import SearchScreen from "../../screens/SearchScreen";
import OrdersScreen from "../../screens/OrdersScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import { useOrders } from "../../context/OrdersContext";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
    const { orders } = useOrders();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#111111",
                tabBarInactiveTintColor: "#9a9a9a",
                tabBarStyle: {
                    borderTopColor: "#ece9e2",
                    backgroundColor: "#ffffff",
                    height: 80,
                    paddingTop: 8,
                    paddingBottom: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: "DMSans-Medium",
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icon
                            name={focused ? "home-5-fill" : "home-5-line"}
                            size={size}
                            color={color}
                            fallback={null}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icon
                            name={focused ? "search-fill" : "search-line"}
                            size={size}
                            color={color}
                            fallback={null}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Orders"
                component={OrdersScreen}
                options={{
                    tabBarBadge: orders.length ? orders.length : undefined,
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icon
                            name={
                                focused
                                    ? "shopping-bag-3-fill"
                                    : "shopping-bag-3-line"
                            }
                            size={size}
                            color={color}
                            fallback={null}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icon
                            name={focused ? "user-3-fill" : "user-3-line"}
                            size={size}
                            color={color}
                            fallback={null}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
