import { Component, h, Prop } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaInputSelectItem {
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-input-select-item" },
            h("slot", null)));
    }
    static get is() { return "zea-input-select-item"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-input-select-item.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-input-select-item.css"]
    }; }
    static get properties() { return {
        "value": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "value",
            "reflect": false
        }
    }; }
}
