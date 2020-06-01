'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaInputPhotoCss = ".zea-input-photo{color:var(--color-freground-1)}";

const ZeaInputPhoto = class {
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
        return index.h("div", { class: "zea-input-photo" }, this.test);
    }
};
ZeaInputPhoto.style = zeaInputPhotoCss;

exports.zea_input_photo = ZeaInputPhoto;
