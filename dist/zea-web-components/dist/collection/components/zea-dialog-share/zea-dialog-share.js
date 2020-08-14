import { Component, h, Prop, Listen } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaDialogShare {
    constructor() {
        /**
         */
        this.shown = false;
    }
    /**
     */
    dialogCloseHandler(event) {
        if (event.detail == this.dialog)
            this.shown = false;
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (h("zea-dialog", { ref: (el) => (this.dialog = el), width: "fit-content", class: "share-dialog", shown: this.shown },
            h("div", { slot: "title" }, "Share"),
            h("div", { slot: "body" },
                h("div", { class: "scrollpane-container" },
                    h("zea-scroll-pane", null,
                        h("zea-tabs", { orientation: "horizontal", density: "small" },
                            h("div", { slot: "tab-bar" }, "Share Link"),
                            h("div", null,
                                h("zea-qr-code", { scale: 4 }),
                                h("zea-copy-link", null)),
                            h("div", { slot: "tab-bar" }, "Send SMS"),
                            h("div", null, "Tab Content 2"),
                            h("div", { slot: "tab-bar" }, "Send Email"),
                            h("div", null, "Tab Content 3")))))));
    }
    static get is() { return "zea-dialog-share"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-dialog-share.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-dialog-share.css"]
    }; }
    static get properties() { return {
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
        }
    }; }
    static get listeners() { return [{
            "name": "dialogClose",
            "method": "dialogCloseHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }]; }
}
