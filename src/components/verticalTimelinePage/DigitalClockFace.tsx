import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import spacetime, { Spacetime } from "spacetime";
import ColorPalette from "../utils/ColorPalette";

const todayYesterdayTomorrow = (outputTime: Spacetime, userTime: Spacetime) => {
    if (
        outputTime.year() == userTime.year() &&
        outputTime.month() == userTime.month() &&
        outputTime.date() == userTime.date()
    )
        return "Today";
    else if (
        outputTime.year() > userTime.year() ||
        outputTime.month() > userTime.month() ||
        outputTime.date() > userTime.date()
    )
        return "Tomorrow";
    else if (
        outputTime.year() < userTime.year() ||
        outputTime.month() < userTime.month() ||
        outputTime.date() < userTime.date()
    )
        return "Yesterday";
    else return "Undefined";
};

const DigitalClockFace = ({
    time,
    style,
}: {
    time: Spacetime;
    style?: ViewStyle;
}): JSX.Element => {
    return (
        <View style={{ ...styles.container, ...style }}>
            <Text style={styles.clockText}>
                {time.format("{hour-24-pad}:{minute-pad}")}
            </Text>
            <Text style={styles.timezoneText}>
                {time.displayName
                    ? time.displayName
                    : time.format("{timezone}")}
            </Text>
            <Text style={styles.smallText}>
                {todayYesterdayTomorrow(
                    time,
                    spacetime.now("America/Los_Angeles"),
                )}
            </Text>
        </View>
    );
};

export default DigitalClockFace;

const styles = StyleSheet.create({
    container: {},

    clockText: {
        fontSize: 40,
        color: ColorPalette.text,
        textAlign: "center",
    },

    timezoneText: {
        color: ColorPalette.text,
        textAlign: "center",
    },

    smallText: {
        color: ColorPalette.text,
        textAlign: "center",
        fontSize: 8,
    },
});
