import spacetime, { TimezoneSet } from "spacetime";

export const validTimezoneCodes = Object.keys(spacetime.now().timezones);
export default class TimezoneCode {
    code: string;
    offset: number;
    displayName: string;

    constructor(code: string) {
        if (validTimezoneCodes.includes(code)) {
            this.code = code;
            this.offset = spacetime.now(code).timezone().default_offset;
            this.displayName = code;
        } else {
            throw new TypeError(`${code} is not a valid timezone code`);
        }
    }

    asSpacetime() {
        return spacetime.now(this.code);
    }
}
