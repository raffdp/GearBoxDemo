import { Component, h, Prop, Method, Event, Element, } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaDialog {
    constructor() {
        this.shown = false;
        this.width = 'auto';
        this.allowClose = true;
        this.showBackdrop = true;
        this.addPadding = true;
    }
    /**
     */
    async prompt() {
        this.shown = true;
    }
    /**
     */
    onBackdropClick() {
        if (this.allowClose) {
            this.shown = false;
            this.dialogClose.emit(this.hostElement);
        }
    }
    /**
     */
    resetSize() {
        if (!this.dialogContainer)
            return;
        if (this.width) {
            this.dialogContainer.style.width = this.width;
        }
        else {
            this.dialogContainer.style.width = `fit-content`;
        }
        this.dialogContainer.style.height = `fit-content`;
        if (this.dialogContainer.offsetHeight) {
            this.dialogContainer.style.height = `${this.dialogContainer.offsetHeight}px`;
        }
        if (this.dialogContainer.offsetWidth) {
            this.dialogContainer.style.width = `${this.dialogContainer.offsetWidth}px`;
        }
    }
    /**
     */
    componentDidRender() {
        this.resetSize();
    }
    /**
     */
    componentWillLoad() {
        window.addEventListener('resize', () => {
            this.resetSize();
        });
    }
    /**
     */
    setupContainer(el) {
        if (this.dialogContainer)
            return;
        this.dialogContainer = el;
        this.dialogContainer.addEventListener('dialogResize', () => {
            this.resetSize();
        });
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        return (h("div", { class: {
                'zea-dialog': true,
                shown: this.shown,
                'with-padding': this.addPadding,
            } },
            this.showBackdrop && (h("div", { class: "backdrop", onClick: this.onBackdropClick.bind(this) })),
            h("div", { class: "zea-dialog-container", ref: (el) => this.setupContainer(el) },
                h("div", { class: "zea-dialog-title" },
                    h("slot", { name: "title" })),
                h("div", { class: "zea-dialog-body" },
                    h("slot", { name: "body" })),
                h("div", { class: "zea-dialog-footer" },
                    h("slot", { name: "footer" })))));
    }
    static get is() { return "zea-dialog"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-dialog.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-dialog.css"]
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
        },
        "width": {
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
            "attribute": "width",
            "reflect": false,
            "defaultValue": "'auto'"
        },
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
        "showBackdrop": {
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
            "attribute": "show-backdrop",
            "reflect": false,
            "defaultValue": "true"
        },
        "addPadding": {
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
            "attribute": "add-padding",
            "reflect": false,
            "defaultValue": "true"
        }
    }; }
    static get events() { return [{
            "method": "dialogClose",
            "name": "dialogClose",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": ""
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }]; }
    static get methods() { return {
        "prompt": {
            "complexType": {
                "signature": "() => Promise<void>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        }
    }; }
    static get elementRef() { return "hostElement"; }
}
