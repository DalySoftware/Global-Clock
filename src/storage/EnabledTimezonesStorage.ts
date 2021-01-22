import AsyncStorage from "@react-native-async-storage/async-storage";
import TimezoneCode from "../classes/TimezoneCode";

export const GetEnabledTimezonesStorage = async (): Promise<TimezoneCode[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem("@enabledTimezones");

        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        } else {
            return [];
        }
    } catch (e) {
        console.log("error :>> ", e);
        return [];
    }
};

export const SetEnabledTimezonesStorage = async (
    timezoneCodes: TimezoneCode[],
) => {
    try {
        const json = JSON.stringify(timezoneCodes);
        await AsyncStorage.setItem("@enabledTimezones", json);
    } catch (e) {
        console.log("error :>> ", e);
    }
};
