import { Component, h, Prop } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaMenuColor {
    constructor() {
        /**
         * The color assigned to this item
         */
        this.color = '';
        /**
         * The color of the foreground (icon) for the tool
         */
        this.fgColor = '';
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        return (h("div", { class: "zea-menu-color", style: { backgroundColor: this.color } }));
    }
    static get is() { return "zea-menu-color"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-menu-color.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-menu-color.css"]
    }; }
    static get properties() { return {
        "color": {
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
                "text": "The color assigned to this item"
            },
            "attribute": "color",
            "reflect": false,
            "defaultValue": "''"
        },
        "fgColor": {
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
                "text": "The color of the foreground (icon) for the tool"
            },
            "attribute": "fg-color",
            "reflect": false,
            "defaultValue": "''"
        }
    }; }
}
