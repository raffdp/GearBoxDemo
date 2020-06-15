import { r as registerInstance, h } from './index-12ee0265.js';

const zeaInputDateCss = ".zea-input-date{color:var(--color-freground-1)}";

const ZeaInputDate = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * A test prop.
         */
        this.test = 'Hello World';
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return h("div", { class: "zea-input-date" }, this.test);
    }
};
ZeaInputDate.style = zeaInputDateCss;

export { ZeaInputDate as zea_input_date };
