import React, { Context, createContext } from "react";
import spacetime, { Spacetime } from "spacetime";

interface EnabledTimezonesContext {
    enabledTimezones: Spacetime[],
    setEnabledTimezones: React.Dispatch<React.SetStateAction<Spacetime[]>>
}

const EnabledTimezones = createContext<EnabledTimezonesContext>({
    enabledTimezones: [spacetime.now()],
    setEnabledTimezones: () => {}
});

export default EnabledTimezones;
