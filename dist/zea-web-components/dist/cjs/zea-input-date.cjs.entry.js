'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaInputDateCss = ".zea-input-date{color:var(--color-freground-1)}";

const ZeaInputDate = class {
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
        return index.h("div", { class: "zea-input-date" }, this.test);
    }
};
ZeaInputDate.style = zeaInputDateCss;

exports.zea_input_date = ZeaInputDate;
