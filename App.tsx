import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import GlobalClock from "./src/components/GlobalClock";

export default function App() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.appContainer}>
                <GlobalClock />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
    },
});
