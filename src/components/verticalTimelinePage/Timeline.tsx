import React from "react";
import { FC } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Spacetime } from "spacetime";
import ColorPalette from "../utils/ColorPalette";
import TimeSlot from "./TimeSlot";

const roundToHalfHour = (time: Spacetime) => {
    if (time.minute() < 15) return time.minute(0);
    else if (time.minute() < 45) return time.minute(30);
    else return time.minute(0).add(1, "hour");
};

const renderNotches = (
    increment: number,
    minTime: Spacetime,
    maxTime: Spacetime,
) => {
    let currentTime = roundToHalfHour(minTime.clone());
    let notches = [];

    while (
        currentTime.isBefore(roundToHalfHour(maxTime).add(1, "millisecond"))
    ) {
        let notch = (
            <TimeSlot
                displayTime={currentTime}
                key={currentTime.format("{iso}") as string}
            />
        );

        notches.push(notch);
        currentTime = currentTime.add(increment, "minute");
    }

    return notches;
};

const renderTimezone = (
    date: Spacetime,
    increment: number,
    minutesBefore: number,
    minutesAfter: number,
) => {
    if (date) {
        return renderNotches(
            increment,
            date.add(-minutesBefore, "minute"),
            date.add(minutesAfter, "minute"),
        );
    }
};

const shortTimezone = (time: Spacetime) => {
    const regex: RegExp = /.*?\/(.*)/i;
    return (time.format("{timezone}") as string)
        .replace(regex, "$1")
        .replace("_", " ");
};

interface TimelineProps {
    dates: Spacetime[];
    minutesBefore?: number;
    minutesAfter?: number;
    increment?: number;
}

const Timeline: FC<TimelineProps> = ({
    dates,
    minutesBefore = 30,
    minutesAfter = 12 * 60,
    increment = 30,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.timelineHeaderContainer}>
                {dates.map((date, index) => {
                    return (
                        <Text
                            style={styles.timelineHeader}
                            key={date.format("{iso}") as string}
                        >
                            {shortTimezone(date)}
                        </Text>
                    );
                })}
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.scrollContent}>
                    {dates.map((date, index) => {
                        return (
                            <View
                                style={styles.timezone}
                                key={date.format("{iso}") as string}
                            >
                                {renderTimezone(
                                    date,
                                    increment,
                                    minutesBefore,
                                    minutesAfter,
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

export default Timeline;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        backgroundColor: ColorPalette.backgroundLight,
        borderRadius: 10,
    },

    scrollContent: {
        flexGrow: 1,
        flexDirection: "row",
    },

    timezone: {
        flexGrow: 1,
    },

    timelineHeaderContainer: {
        justifyContent: "space-around",
        flexDirection: "row",
        borderBottomColor: ColorPalette.test1,
        borderBottomWidth: 1,
        paddingBottom: 5,
    },

    timelineHeader: {
        color: ColorPalette.text,
        fontSize: 10,
        paddingTop: 5,
    },

    scrollContentContainer: {
        flexDirection: "row",
        flexGrow: 1,
        flexWrap: "wrap",
    },
});
