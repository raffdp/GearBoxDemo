import { Component, h, Prop } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaFormMeasurementsSettings {
    constructor() {
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
        return h("div", { class: "zea-form-measurements-settings" }, this.test);
    }
    static get is() { return "zea-form-measurements-settings"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-form-measurements-settings.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-form-measurements-settings.css"]
    }; }
    static get properties() { return {
        "test": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "A test prop."
            },
            "attribute": "test",
            "reflect": false,
            "defaultValue": "'Hello World'"
        }
    }; }
}
