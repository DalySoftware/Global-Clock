import React, { FC, useState, useEffect } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import spacetime from "spacetime";
import Card from "../Card";
import ColorPalette from "../utils/ColorPalette";
import AddTimezoneDialogue from "./AddTimezoneDialogue";
import ITimezoneCode, {
    getITimezoneCodeFromString,
} from "../../interfaces/ITimezoneCode";
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
    const [enabledTimezones, setEnabledTimezones] = useState<ITimezoneCode[]>(
        [],
    );

    // Refresh enabled timezones on any state change
    useEffect(() => {
        async function fetchEnabledTimezones() {
            const timezones = await GetEnabledTimezonesStorage();
            setEnabledTimezones(timezones);
        }
        fetchEnabledTimezones();
    }, []);

    // Save enabled timezones to storage if changed
    useEffect(() => {
        async function saveEnabledTimezones() {
            SetEnabledTimezonesStorage(enabledTimezones);
        }
        saveEnabledTimezones();
    }, [enabledTimezones]);

    const [selectableTimezones, setSelectableTimezones] = useState<
        ITimezoneCode[]
    >([]);

    // Only show timezones in the picker that are not already selected
    useEffect(() => {
        const getTimezonePickerItems = () => {
            let returnItems: ITimezoneCode[] = [];
            const allTimezones = spacetime.now().timezones;

            for (const timezone in allTimezones) {
                if (
                    enabledTimezones.filter(x => x.code == timezone).length == 0
                ) {
                    returnItems.push({
                        code: timezone,
                        offset: getCleanOffset(
                            timezone,
                            allTimezones[timezone].offset,
                        ),
                        displayName: timezone,
                    });
                }
            }

            returnItems.sort((a, b) => {
                if (a.offset - b.offset != 0) return a.offset - b.offset;
                else return a.code.localeCompare(b.code);
            });
            return returnItems;
        };
        setSelectableTimezones(getTimezonePickerItems());
        return () => {};
    }, [enabledTimezones]);

    const addTimeZone = async (timezoneCode: string) => {
        if (timezoneCode) {
            try {
                const newCode = getITimezoneCodeFromString(timezoneCode);
                const newTimezones = [...enabledTimezones, newCode];
                setEnabledTimezones(newTimezones);
                onCloseModal();
            } catch (e) {
                console.log(
                    `error adding timezoneCode: ${timezoneCode} :>> `,
                    e,
                );
            }
        }
    };

    const onCloseModal = () => {
        setAddModalVisible(false);
    };

    const onEditTimezone = () => {};

    const onRemoveTimezone = (timezoneCode: string) => {
        const newTimezones =
            enabledTimezones.length > 0
                ? enabledTimezones.filter(
                      existing => existing.code != timezoneCode,
                  )
                : [getITimezoneCodeFromString(timezoneCode)];
        setEnabledTimezones(newTimezones);
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
                />
            );
        }
    };

    return (
        <View style={styles.container}>
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
        </View>
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
