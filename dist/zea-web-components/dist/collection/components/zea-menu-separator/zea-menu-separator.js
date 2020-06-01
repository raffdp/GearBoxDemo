import { Component, h, Prop } from '@stencil/core';
/**
 * Main component class
 */
export class ZeaMenuSeparator {
    constructor() {
        /**
         */
        this.class = '';
        /**
         */
        this.orientation = 'horizontal';
    }
    /**
     * Render function
     * @return {JSX}
     */
    render() {
        return (h("div", { class: `zea-menu-separator ${this.class} ${this.orientation}` },
            h("div", { class: "ruler" })));
    }
    static get is() { return "zea-menu-separator"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-menu-separator.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-menu-separator.css"]
    }; }
    static get properties() { return {
        "class": {
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
                "text": ""
            },
            "attribute": "class",
            "reflect": false,
            "defaultValue": "''"
        },
        "orientation": {
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
                "text": ""
            },
            "attribute": "orientation",
            "reflect": false,
            "defaultValue": "'horizontal'"
        }
    }; }
}
