import React, { FC, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import ColorPalette from "../utils/ColorPalette";
import spacetime from "spacetime";
import "../../interfaces/SpacetimeExtensions";
import Timeline from "./Timeline";
import DigitalClockFace from "./DigitalClockFace";
import { GetEnabledTimezonesStorage } from "../../storage/EnabledTimezonesStorage";
import { useFocusEffect } from "@react-navigation/native";
import TimezoneCode from "../../classes/TimezoneCode";

const utcCode = "utc/gmt0";

const VerticalTimelinePage: FC = () => {
    const [enabledTimezones, setEnabledTimezones] = useState<TimezoneCode[]>([
        new TimezoneCode(utcCode),
    ]);
    const [currentTimeUtc, setCurrentTimeUtc] = useState(
        spacetime.now(utcCode),
    );

    const enabledClocks = enabledTimezones.map(x => {
        let date = currentTimeUtc.goto(x.code);
        date.displayName = x.displayName;
        return date;
    });

    const updateClock = () => {
        setCurrentTimeUtc(spacetime.now(utcCode));
    };

    useFocusEffect(
        useCallback(() => {
            const fetchEnabledTimezones = async () => {
                const timezones = await GetEnabledTimezonesStorage();
                if (timezones.length > 0) setEnabledTimezones(timezones);
                else setEnabledTimezones([new TimezoneCode(utcCode)]);
            };
            fetchEnabledTimezones();
            const clockTimer = setInterval(updateClock, 5000);
            return () => {
                // page unloaded
                clearInterval(clockTimer);
            };
        }, []),
    );

    return (
        <View style={styles.container}>
            <View style={styles.clockFacesContainer}>
                {enabledClocks.map((date, index) => {
                    return (
                        <DigitalClockFace
                            time={date}
                            style={styles.clockFace}
                            key={date.tz}
                        />
                    );
                })}
            </View>

            <Timeline dates={enabledClocks} />
        </View>
    );
};

export default VerticalTimelinePage;

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: ColorPalette.backgroundDark,
        padding: 5,
    },

    text: {
        color: ColorPalette.text,
    },

    clockFacesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingBottom: 10,
        marginBottom: 5,
    },

    clockFace: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "50%",
    },
});
