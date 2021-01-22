import React, { FC, useState, useEffect } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import spacetime from "spacetime";
import Card from "../Card";
import ColorPalette from "../utils/ColorPalette";
import AddTimezoneDialogue from "./AddTimezoneDialogue";
import TimezoneCode, { ValidTimezoneCodes } from "../../classes/TimezoneCode";
import TimezoneItem from "./TimezoneItem";
import {
    GetEnabledTimezonesStorage,
    SetEnabledTimezonesStorage,
} from "../../storage/EnabledTimezonesStorage";

const getCleanOffset = (timezoneCode: string, offset: number) => {
    const regex = /[eu]tc\/gmt[\+-]\d{0,2}\.?\d/i;

    if (timezoneCode.match(regex)) return -offset;
    else return offset;
};

const SettingsPage: FC = () => {
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [enabledTimezones, setEnabledTimezones] = useState<TimezoneCode[]>(
        [],
    );

    // Refresh enabled timezones on mount or unmount
    useEffect(() => {
        async function fetchEnabledTimezones() {
            const timezones = await GetEnabledTimezonesStorage();
            setEnabledTimezones(timezones);
        }
        fetchEnabledTimezones();
    }, []);

    const [selectableTimezones, setSelectableTimezones] = useState<
        TimezoneCode[]
    >([]);

    useEffect(() => {
        // Save enabled timezones to storage if changed
        async function saveEnabledTimezones() {
            SetEnabledTimezonesStorage(enabledTimezones);
        }
        saveEnabledTimezones();

        // Only show timezones in the picker that are not already selected
        const getTimezonePickerItems = () => {
            let returnItems: TimezoneCode[] = [];
            const allTimezones = spacetime.now().timezones;

            ValidTimezoneCodes.forEach((code, index) => {
                if (enabledTimezones.filter(x => x.code == code).length == 0) {
                    returnItems.push(new TimezoneCode(code));
                }
            });

            //Sort by offset then code
            returnItems.sort((a, b) => {
                if (a.offset - b.offset != 0) return a.offset - b.offset;
                else return a.code.localeCompare(b.code);
            });
            return returnItems;
        };
        setSelectableTimezones(getTimezonePickerItems());
        return () => {};
    }, [enabledTimezones]);

    const onCloseModal = () => {
        setAddModalVisible(false);
    };

    const addTimeZone = async (timezoneCode: string) => {
        if (timezoneCode) {
            try {
                const newCode = new TimezoneCode(timezoneCode);
                setEnabledTimezones([...enabledTimezones, newCode]);
                onCloseModal();
            } catch (e) {
                console.log(
                    `error adding timezoneCode: ${timezoneCode} :>> `,
                    e,
                );
            }
        }
    };

    const onRemoveTimezone = (timezoneCode: string) => {
        const newTimezones =
            enabledTimezones.length > 0
                ? enabledTimezones.filter(
                      existing => existing.code != timezoneCode,
                  )
                : [new TimezoneCode(timezoneCode)];
        setEnabledTimezones(newTimezones);
    };

    const onMoveTimezone = (timezoneCode: string, moveBy: number) => {
        const currentIndex = enabledTimezones.findIndex(x => {
            return x.code == timezoneCode;
        });

        if (currentIndex >= 0) {
            if (
                currentIndex + moveBy >= 0 &&
                currentIndex + moveBy < enabledTimezones.length
            ) {
                const reorderedTimezones = [...enabledTimezones];
                var elementAtTarget = reorderedTimezones[currentIndex + moveBy];
                reorderedTimezones.copyWithin(
                    currentIndex + moveBy,
                    currentIndex,
                    currentIndex + 1,
                );
                reorderedTimezones[currentIndex] = elementAtTarget;
                setEnabledTimezones(reorderedTimezones);
            } else {
                console.warn("Move would put item out of range", {
                    currentIndex,
                    moveBy,
                });
            }
        }
    };

    const onSaveDisplayName = (timezoneCode: string, displayName: string) => {
        const newEnabledTimezones = [...enabledTimezones];
        const foundIndex = newEnabledTimezones.findIndex(x => {
            return x.code == timezoneCode;
        });
        if (foundIndex >= 0) {
            newEnabledTimezones[foundIndex].displayName = displayName;
            setEnabledTimezones(newEnabledTimezones);
        }
    };

    const renderTimezoneItems = () => {
        if (enabledTimezones.length > 0)
            return enabledTimezones.map(code => {
                return (
                    <TimezoneItem
                        key={code.code}
                        timezoneCode={code.code}
                        displayName={code.displayName}
                        dummy={false}
                        onRemoveTimezone={onRemoveTimezone}
                        onSaveDisplayName={onSaveDisplayName}
                        onMoveItem={onMoveTimezone}
                    />
                );
            });
        else {
            return (
                <TimezoneItem
                    key="Add some timezones below"
                    timezoneCode="Add some timezones below"
                    displayName="Add some timezones below"
                    dummy={true}
                    onRemoveTimezone={() => {}}
                    onSaveDisplayName={() => {}}
                    onMoveItem={() => {}}
                />
            );
        }
    };

    return (
        <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.header}>Settings</Text>
            <Card style={styles.timezonesContainer}>
                {renderTimezoneItems()}
            </Card>
            <Button
                title="Add new timezone"
                onPress={() => {
                    setAddModalVisible(true);
                }}
                color={ColorPalette.accentPrimary}
            />

            <Text>{spacetime.now().timezones[0]}</Text>
            <AddTimezoneDialogue
                visible={addModalVisible}
                onClose={onCloseModal}
                onAddTimezone={addTimeZone}
                selectableTimezones={selectableTimezones}
            />
        </ScrollView>
    );
};

export default SettingsPage;

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: ColorPalette.backgroundDark,
        padding: 5,
    },

    header: {
        fontSize: 30,
        textAlign: "center",
        color: ColorPalette.text,
    },

    timezonesContainer: {
        marginVertical: 20,
        paddingVertical: 10,
        backgroundColor: ColorPalette.backgroundLight,
        borderColor: ColorPalette.accentPrimary,
        borderWidth: 1,
    },

    text: {
        color: ColorPalette.text,
    },
});
