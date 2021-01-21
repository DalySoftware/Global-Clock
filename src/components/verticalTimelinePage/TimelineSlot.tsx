import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Spacetime } from "spacetime";
import ColorPalette from "../utils/ColorPalette";

const TimelineSlot = ({
    displayTime,
}: {
    displayTime: Spacetime;
}): JSX.Element => {
    return (
        <View style={styles.notchContainer}>
            <View style={styles.notchLine}></View>
            <Text style={styles.text}>
                {displayTime.format("{hour-24-pad}:{minute-pad}")}
            </Text>
            <View style={styles.notchLine}></View>
        </View>
    );
};

export default TimelineSlot;

const styles = StyleSheet.create({
    notchContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        // borderTopColor: "black",
        // borderBottomColor: "black",
        // borderTopWidth: 1,
        // borderBottomWidth: 1
    },

    notchLine: {
        flex: 1,
        backgroundColor: ColorPalette.accentSecondary,
        height: 2,
    },

    text: {
        color: ColorPalette.text,
    },
});
