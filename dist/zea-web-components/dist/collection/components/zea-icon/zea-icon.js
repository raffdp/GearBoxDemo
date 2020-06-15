import { Component, h, Prop } from '@stencil/core';
import { getSvg } from './svg';
/**
 * Main class for the icon
 */
export class ZeaIcon {
    constructor() {
        /**
         * The library to load the icon from
         */
        this.type = 'ionic';
        /**
         * The icon size in pixels
         */
        this.size = 24;
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        if (this.type == 'ionic') {
            return (h("div", { class: "zea-icon ionic" },
                h("ion-icon", { name: this.name, style: { fontSize: `${this.size}px` } })));
        }
        else if (this.type == 'zea') {
            return (h("div", { class: `zea-icon zea-custom-icon zea-icon-${this.name}` },
                h("div", { class: "zea-custom-icon-inner", style: { fontSize: `${this.size}px` }, innerHTML: getSvg(this.name) })));
        }
    }
    static get is() { return "zea-icon"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-icon.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-icon.css"]
    }; }
    static get properties() { return {
        "type": {
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
                "text": "The library to load the icon from"
            },
            "attribute": "type",
            "reflect": false,
            "defaultValue": "'ionic'"
        },
        "name": {
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
                "text": "The icon name within the choosen library"
            },
            "attribute": "name",
            "reflect": false
        },
        "size": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The icon size in pixels"
            },
            "attribute": "size",
            "reflect": false,
            "defaultValue": "24"
        }
    }; }
}
