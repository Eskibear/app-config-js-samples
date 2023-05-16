import { EMPTY_LABEL } from "./constants";

export class SettingSelector {

    public static DEFAULT_SELECTOR: SettingSelector = new SettingSelector("*", EMPTY_LABEL);

    constructor(
        public keyFilter: string,
        public labelFilter: string = EMPTY_LABEL
    ) { }
}