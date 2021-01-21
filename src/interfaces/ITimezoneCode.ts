import spacetime from "spacetime";

export default interface ITimezoneCode {
    code: string;
    offset: number;
    displayName: string;
}


export const getITimezoneCodeFromString = (code: string) => {
    const tz = spacetime.now(code);
    return {
        code: code,
        offset: tz.timezone().default_offset,
        displayName: code,
    } as ITimezoneCode;
};