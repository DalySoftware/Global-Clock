import React from "react";
import { FC } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Spacetime } from "spacetime";
import ColorPalette from "../utils/ColorPalette";
import TimelineSlot from "./TimelineSlot";

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
    let slots = [];

    while (
        currentTime.isBefore(roundToHalfHour(maxTime).add(1, "millisecond"))
    ) {
        let slot = (
            <TimelineSlot
                displayTime={currentTime}
                key={`${currentTime.format("{iso}")}, ${currentTime.tz}`}
            />
        );

        slots.push(slot);
        currentTime = currentTime.add(increment, "minute");
    }

    return slots;
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
                        <Text style={styles.timelineHeader} key={date.tz}>
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
                            <View style={styles.timezone} key={date.tz}>
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
        borderColor: ColorPalette.accentPrimary,
        borderWidth: 1,
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
        borderBottomColor: ColorPalette.accentPrimary,
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
