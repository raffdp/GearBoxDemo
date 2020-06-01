import { Component, h, Prop } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaButton {
    constructor() {
        /**
         * Style variant for the button
         */
        this.variant = 'solid';
        /**
         * Whether the button should be disabled (true) or not (false)
         */
        this.disabled = false;
        /**
         * Whether the button should be disabled (true) or not (false)
         */
        this.color = false;
        /**
         * Whether the button should be disabled (true) or not (false)
         */
        this.density = 'normal';
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        return (h("button", { class: `zea-button ${this.variant} ${this.density}`, disabled: this.disabled },
            h("span", { class: "zea-button-content-wrap" },
                h("span", { class: "zea-start-icon" },
                    h("slot", { name: "start-icon" })),
                this.htmlContent ? (h("span", { class: "zea-button-label", innerHTML: this.htmlContent })) : (h("span", { class: "zea-button-label" },
                    h("slot", null))),
                h("span", { class: "zea-end-icon" },
                    h("slot", { name: "end-icon" })))));
    }
    static get is() { return "zea-button"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-button.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-button.css"]
    }; }
    static get properties() { return {
        "htmlContent": {
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
                "text": "Text/html to be displayed inside the button"
            },
            "attribute": "html-content",
            "reflect": false
        },
        "variant": {
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
                "text": "Style variant for the button"
            },
            "attribute": "variant",
            "reflect": false,
            "defaultValue": "'solid'"
        },
        "disabled": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Whether the button should be disabled (true) or not (false)"
            },
            "attribute": "disabled",
            "reflect": false,
            "defaultValue": "false"
        },
        "color": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Whether the button should be disabled (true) or not (false)"
            },
            "attribute": "color",
            "reflect": false,
            "defaultValue": "false"
        },
        "density": {
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
                "text": "Whether the button should be disabled (true) or not (false)"
            },
            "attribute": "density",
            "reflect": false,
            "defaultValue": "'normal'"
        }
    }; }
}
