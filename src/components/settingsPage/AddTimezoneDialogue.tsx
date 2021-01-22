import React, { useState } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import TimezoneCode from "../../classes/TimezoneCode";
import Card from "../Card";
import ColorPalette from "../utils/ColorPalette";

const renderPickerItem = (timezone: TimezoneCode) => {
    const formattedOffset: string =
        (timezone.offset < 0 ? "" : "+") + timezone.offset;

    return (
        <Picker.Item
            label={`${timezone.code}: ${formattedOffset}`}
            value={timezone.code}
            key={`${timezone.code}: ${formattedOffset}`}
        />
    );
};

const AddTimezoneDialogue = ({
    visible,
    onClose,
    onAddTimezone,
    selectableTimezones,
}: {
    visible: boolean;
    onClose: () => void;
    onAddTimezone: (timezoneCode: string) => void;
    selectableTimezones: TimezoneCode[];
}) => {
    const [selectedTimezoneCode, setSelectedTimezoneCode] = useState("");

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
            onShow={() => setSelectedTimezoneCode("")}
        >
            <View style={styles.container}>
                <Card style={styles.card}>
                    <View style={styles.pickerContainer}>
                        <Picker
                            prompt="Select a timezone to add"
                            onValueChange={value =>
                                setSelectedTimezoneCode(value as string)
                            }
                            selectedValue={selectedTimezoneCode}
                            style={styles.picker}
                        >
                            <Picker.Item
                                label="Please select a timezone..."
                                value=""
                            />
                            {selectableTimezones.map(renderPickerItem)}
                        </Picker>
                    </View>
                    <Button
                        title="Add timezone"
                        onPress={() => onAddTimezone(selectedTimezoneCode)}
                        color={ColorPalette.accentPrimary}
                    />
                </Card>
            </View>
        </Modal>
    );
};

export default AddTimezoneDialogue;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },

    card: {
        top: "-20%",
        paddingHorizontal: "5%",
        paddingVertical: "10%",
        margin: "5%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        backgroundColor: ColorPalette.backgroundLight,
    },

    pickerContainer: {
        flexGrow: 1,
        flexBasis: "100%",
        flexShrink: 1,
        borderColor: ColorPalette.accentPrimary,
        borderWidth: 2,
        marginBottom: "10%",
        borderRadius: 10,
    },

    picker: {
        color: ColorPalette.text,
    },
});
