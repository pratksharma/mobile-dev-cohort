import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

const Cart = () => {
    const navigation = useNavigation();
    return (
        <View>
            <Text>Cart Screen</Text>
            <Button
                title="Go to Onboarding"
                // @ts-ignore
                onPress={() => navigation.navigate("Onboarding")}
            ></Button>
        </View>
    );
};

export default Cart;
