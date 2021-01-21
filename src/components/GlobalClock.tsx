import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import VerticalTimelinePage from "./verticalTimelinePage/VerticalTimelinePage";
import SettingsPage from "./settingsPage/SettingsPage";
import ColorPalette from "./utils/ColorPalette";

const Tab = createBottomTabNavigator();

const GlobalClock = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = "";

                        if (route.name == "Clock") iconName = "time-outline";
                        else if (route.name == "Settings")
                            iconName = "settings-outline";

                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    },
                })}
                tabBarOptions={{
                    activeTintColor: ColorPalette.accentPrimary,
                    style: styles.tabBar,
                    showLabel: false,
                }}
            >
                <Tab.Screen name="Clock" component={VerticalTimelinePage} />
                <Tab.Screen name="Settings" component={SettingsPage} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default GlobalClock;

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: ColorPalette.backgroundDark,
        // paddingBottom: 10,
        height: 60,
    },
});
