import { Component, h, Prop } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaInputPhoto {
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
        return h("div", { class: "zea-input-photo" }, this.test);
    }
    static get is() { return "zea-input-photo"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-input-photo.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-input-photo.css"]
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
