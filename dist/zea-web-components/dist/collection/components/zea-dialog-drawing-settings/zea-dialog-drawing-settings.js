import { Component, h, Prop, Listen } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaDialogDrawingSettings {
    constructor() {
        /**
         */
        this.allowClose = true;
        /**
         */
        this.shown = false;
        /**
         */
        this.showLabels = true;
    }
    /**
     */
    todoCompletedHandler() {
        this.shown = false;
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-dialog-pdf-drawing-settings" },
            h("zea-dialog", { allowClose: this.allowClose, showBackdrop: true, shown: this.shown, addPadding: false },
                h("div", { slot: "body", id: "tabs-container" },
                    h("zea-tabs", { orientation: "horizontal", density: "small" },
                        h("div", { slot: "tab-bar" }, "Drawing Disciplines"),
                        h("zea-form-disciplines-settings", null),
                        h("div", { slot: "tab-bar" }, "Measurements"),
                        h("zea-form-measurements-settings", null))))));
    }
    static get is() { return "zea-dialog-drawing-settings"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-dialog-drawing-settings.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-dialog-drawing-settings.css"]
    }; }
    static get properties() { return {
        "allowClose": {
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
                "text": ""
            },
            "attribute": "allow-close",
            "reflect": false,
            "defaultValue": "true"
        },
        "shown": {
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
                "text": ""
            },
            "attribute": "shown",
            "reflect": false,
            "defaultValue": "false"
        },
        "showLabels": {
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
                "text": ""
            },
            "attribute": "show-labels",
            "reflect": false,
            "defaultValue": "true"
        },
        "userData": {
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
            "attribute": "user-data",
            "reflect": false
        }
    }; }
    static get listeners() { return [{
            "name": "dialogClose",
            "method": "todoCompletedHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }]; }
}
