import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const APP_TAB_BAR_HEIGHT = 108;

export function AppTabBar(props: any) {
    const { state, descriptors, navigation } = props;
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.outer,
                { paddingBottom: Math.max(insets.bottom, 12) + 10 },
            ]}
        >
            <View style={styles.container}>
                {state.routes.map((route, index) => {
                    const descriptor = descriptors[route.key];
                    const options = descriptor.options;
                    const label =
                        typeof options.tabBarLabel === "string"
                            ? options.tabBarLabel
                            : (options.title ?? route.name);
                    const focused = state.index === index;
                    const Icon = options.tabBarIcon;

                    const handlePress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!focused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    return (
                        <Pressable
                            key={route.key}
                            accessibilityRole="tab"
                            accessibilityState={
                                focused ? { selected: true } : {}
                            }
                            accessibilityLabel={
                                options.tabBarAccessibilityLabel
                            }
                            onPress={handlePress}
                            onLongPress={() =>
                                navigation.emit({
                                    type: "tabLongPress",
                                    target: route.key,
                                })
                            }
                            style={({ pressed }) => [
                                styles.tab,
                                focused && styles.tabActive,
                                pressed && styles.tabPressed,
                            ]}
                        >
                            <View style={styles.iconWrap}>
                                {typeof Icon === "function"
                                    ? Icon({
                                          color: focused
                                              ? "#64748b"
                                              : "#0f172a",
                                          size: 20,
                                          focused,
                                      })
                                    : null}
                            </View>
                            <Text
                                style={[
                                    styles.label,
                                    focused && styles.labelActive,
                                ]}
                            >
                                {String(label)}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 0,
    },
    container: {
        flexDirection: "row",
        alignItems: "stretch",
        backgroundColor: "rgba(255,255,255,0.96)",
        borderRadius: 26,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(148, 163, 184, 0.18)",
        padding: 9,
        shadowColor: "#0f172a",
        shadowOpacity: 0.14,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 18,
    },
    tab: {
        flex: 1,
        minHeight: 58,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        paddingVertical: 8,
    },
    tabActive: {
        backgroundColor: "#0f172a",
        shadowColor: "#0f172a",
        shadowOpacity: 0.16,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    tabPressed: {
        opacity: 0.86,
        transform: [{ scale: 0.99 }],
    },
    iconWrap: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        color: "#0f172a",
        fontSize: 10,
        lineHeight: 11,
        fontWeight: "700",
        letterSpacing: 0.9,
        textTransform: "uppercase",
    },
    labelActive: {
        color: "#64748b",
    },
});
