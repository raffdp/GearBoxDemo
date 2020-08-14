import { Component, h, Prop, Listen } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaProfileDialog {
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
     */
    userRegisteredHandler() {
        this.shown = false;
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-dialog-profile" },
            h("zea-dialog", { width: "320px", allowClose: this.allowClose, showBackdrop: true, shown: this.shown, addPadding: false },
                h("div", { slot: "title" }, "My Profile"),
                h("div", { slot: "body" },
                    h("div", { class: "scrollpane-container" },
                        h("zea-scroll-pane", null,
                            h("zea-form-profile", { userData: this.userData, showLabels: this.showLabels, welcomeHtml: "" })))))));
    }
    static get is() { return "zea-dialog-profile"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-dialog-profile.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-dialog-profile.css"]
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
        }, {
            "name": "userRegistered",
            "method": "userRegisteredHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }]; }
}
