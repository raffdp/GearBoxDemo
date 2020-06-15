import { Component, h, Prop } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaFabButton {
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        return (h("button", { class: "zea-fab-button", disabled: this.disabled },
            h("span", { class: "zea-fab-button-wrap" },
                h("span", { class: "zea-fab-button-icon" },
                    h("slot", null)))));
    }
    static get is() { return "zea-fab-button"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-fab-button.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-fab-button.css"]
    }; }
    static get properties() { return {
        "disabled": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "false",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "/**\r\n   Whether the button should be disabled (true) or not (false)"
            },
            "attribute": "disabled",
            "reflect": false
        }
    }; }
}
