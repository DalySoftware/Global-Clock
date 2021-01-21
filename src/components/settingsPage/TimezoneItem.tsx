import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import ColorPalette from "../utils/ColorPalette";

const TimezoneItem = ({
    timezoneCode,
    displayName,
    dummy,
    onRemoveTimezone,
    onSaveDisplayName,
}: {
    timezoneCode: string;
    displayName: string;
    dummy: boolean;
    onRemoveTimezone: (timezone: string) => void;
    onSaveDisplayName: (timezoneCode: string, displayName: string) => void;
}) => {
    const [editEnabled, setEditEnabled] = useState(false);
    const [editedDisplayName, setEditedDisplayName] = useState(displayName);

    const renderEditOrSaveButton = () => {
        if (editEnabled) return <Button title="Save" onPress={onSave} />;
        else
            return (
                <Button
                    title="Edit"
                    onPress={() => {
                        setEditEnabled(true);
                    }}
                    disabled={dummy}
                />
            );
    };

    const onSave = () => {
        onSaveDisplayName(timezoneCode, editedDisplayName);
        setEditEnabled(false);
    };

    const renderText = () => {
        if (editEnabled)
            return (
                <TextInput
                    defaultValue={displayName}
                    blurOnSubmit={true}
                    clearButtonMode="while-editing"
                    autoCompleteType="off"
                    style={styles.text}
                    onSubmitEditing={onSave}
                    onChangeText={text => setEditedDisplayName(text)}
                />
            );
        else return <Text style={styles.text}>{displayName}</Text>;
    };

    return (
        <View style={styles.row}>
            <View style={styles.textContainer}>{renderText()}</View>
            <View style={styles.buttonContainer}>
                {renderEditOrSaveButton()}
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Delete"
                    onPress={() => {
                        onRemoveTimezone(timezoneCode);
                    }}
                    disabled={dummy}
                ></Button>
            </View>
        </View>
    );
};

export default TimezoneItem;

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        width: "100%",
        padding: 10,
    },

    textContainer: {
        flex: 1,
        justifyContent: "center",
        // height: 50,
        padding: 10,
    },

    text: {
        color: ColorPalette.text,
    },

    buttonContainer: {
        margin: 5,
    },
});
