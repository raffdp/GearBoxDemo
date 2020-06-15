'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaFabButtonCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-fab-button{font-size:1em;border-radius:50%;outline:none;text-align:center;padding:0;color:var(--color-button-text-1);background-color:var(--color-primary-1);border:1px solid var(--color-primary-1);-webkit-box-shadow:0px 5px 5px var(--color-shadow);box-shadow:0px 5px 5px var(--color-shadow)}.zea-fab-button:hover{background-color:var(--color-primary-2);border:1px solid var(--color-primary-2)}.zea-fab-button:disabled{background-color:var(--color-disabled-2);border:1px solid var(--color-disabled-2);color:var(--color-disabled-1);-webkit-box-shadow:0px 5px 5px var(--color-shadow);box-shadow:0px 5px 5px var(--color-shadow)}.zea-fab-button-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;padding:0.7em;width:1em;height:1em}";

const ZeaFabButton = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        return (index.h("button", { class: "zea-fab-button", disabled: this.disabled }, index.h("span", { class: "zea-fab-button-wrap" }, index.h("span", { class: "zea-fab-button-icon" }, index.h("slot", null)))));
    }
};
ZeaFabButton.style = zeaFabButtonCss;

exports.zea_fab_button = ZeaFabButton;
