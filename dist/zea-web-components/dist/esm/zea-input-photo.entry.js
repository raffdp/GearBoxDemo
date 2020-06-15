import { r as registerInstance, h } from './index-12ee0265.js';

const zeaInputPhotoCss = ".zea-input-photo{color:var(--color-freground-1)}";

const ZeaInputPhoto = class {
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
        return h("div", { class: "zea-input-photo" }, this.test);
    }
};
ZeaInputPhoto.style = zeaInputPhotoCss;

export { ZeaInputPhoto as zea_input_photo };
