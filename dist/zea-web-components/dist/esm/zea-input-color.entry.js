import { r as registerInstance, h } from './index-12ee0265.js';

const zeaInputColorCss = ".zea-input-color{color:var(--color-freground-1)}";

const ZeaInputColor = class {
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
        return h("div", { class: "zea-input-color" }, this.test);
    }
};
ZeaInputColor.style = zeaInputColorCss;

export { ZeaInputColor as zea_input_color };
