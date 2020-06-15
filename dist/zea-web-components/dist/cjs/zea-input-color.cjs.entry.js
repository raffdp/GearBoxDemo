'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaInputColorCss = ".zea-input-color{color:var(--color-freground-1)}";

const ZeaInputColor = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
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
        return index.h("div", { class: "zea-input-color" }, this.test);
    }
};
ZeaInputColor.style = zeaInputColorCss;

exports.zea_input_color = ZeaInputColor;
