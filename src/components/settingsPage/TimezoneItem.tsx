import React, { useState } from "react";
import {
    Button,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ColorPalette from "../utils/ColorPalette";

const iconButtonSize = 25;

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
        if (!dummy && editEnabled)
            return (
                <View style={styles.buttonContainer}>
                    <Icon.Button
                        name="save-outline"
                        onPress={onSave}
                        iconStyle={styles.icon}
                        backgroundColor={ColorPalette.accentPrimary}
                        size={iconButtonSize}
                    />
                </View>
            );
        else if (!dummy)
            return (
                <View style={styles.buttonContainer}>
                    <Icon.Button
                        name="create-outline"
                        onPress={() => {
                            setEditEnabled(true);
                        }}
                        disabled={dummy}
                        iconStyle={styles.icon}
                        backgroundColor={ColorPalette.accentSecondary}
                        size={iconButtonSize}
                    />
                </View>
            );
    };

    const onSave = () => {
        onSaveDisplayName(timezoneCode, editedDisplayName);
        setEditEnabled(false);
    };

    const renderText = () => {
        if (editEnabled)
            return (
                <View style={styles.inputContainer}>
                    <TextInput
                        defaultValue={displayName}
                        blurOnSubmit={true}
                        clearButtonMode={"while-editing"}
                        autoCompleteType="off"
                        style={styles.text}
                        onSubmitEditing={onSave}
                        onChangeText={text => setEditedDisplayName(text)}
                        autoFocus={true}
                        selectTextOnFocus={true}
                        onBlur={Keyboard.dismiss}
                    />
                </View>
            );
        else
            return (
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{displayName}</Text>
                </View>
            );
    };

    const renderReorderButtons = () => {
        if (!dummy && editEnabled)
            return (
                <View style={{ flexDirection: "row" }}>
                    <View style={styles.buttonContainer}>
                        <Icon.Button
                            name="chevron-up-outline"
                            onPress={() => {}}
                            disabled={dummy}
                            iconStyle={styles.icon}
                            backgroundColor={ColorPalette.accentSecondary}
                            size={iconButtonSize}
                        ></Icon.Button>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Icon.Button
                            name="chevron-down-outline"
                            onPress={() => {}}
                            disabled={dummy}
                            iconStyle={styles.icon}
                            backgroundColor={ColorPalette.accentSecondary}
                            size={iconButtonSize}
                        ></Icon.Button>
                    </View>
                </View>
            );
    };

    const renderDeleteButton = () => {
        if (!dummy)
            return (
                <View style={styles.buttonContainer}>
                    <Icon.Button
                        name="trash-outline"
                        onPress={() => {
                            onRemoveTimezone(timezoneCode);
                        }}
                        disabled={dummy}
                        iconStyle={styles.icon}
                        backgroundColor={ColorPalette.accentSecondary}
                        size={iconButtonSize}
                    ></Icon.Button>
                </View>
            );
    };

    return (
        <View style={styles.row}>
            {renderText()}
            {renderReorderButtons()}
            {renderEditOrSaveButton()}
            {renderDeleteButton()}
        </View>
    );
};

export default TimezoneItem;

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: "center",
    },

    textContainer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
        marginBottom: 1,
    },

    inputContainer: {
        flex: 1,
        justifyContent: "center",
        marginHorizontal: 5,
        paddingHorizontal: 5,
        borderBottomColor: ColorPalette.accentSecondary,
        borderBottomWidth: 1,
        // paddingHorizontal: 5,
    },

    text: {
        color: ColorPalette.text,
    },

    buttonContainer: {
        marginHorizontal: 1,
    },

    icon: {
        marginRight: 0,
        color: ColorPalette.text,
    },
});
