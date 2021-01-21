import AsyncStorage from "@react-native-async-storage/async-storage";
import ITimezoneCode from "../interfaces/ITimezoneCode";

export const GetEnabledTimezonesStorage = async (): Promise<ITimezoneCode[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem('@enabledTimezones')

        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        } else {
            return []
        }
    } catch (e) {
        console.log("error :>> ", e);
        return []
    }
}

export const SetEnabledTimezonesStorage = async (timezoneCodes: ITimezoneCode[]) => {
    try {
        const json = JSON.stringify(timezoneCodes);
        await AsyncStorage.setItem("@enabledTimezones", json);
    } catch (e) {
        console.log("error :>> ", e);
    }
};

