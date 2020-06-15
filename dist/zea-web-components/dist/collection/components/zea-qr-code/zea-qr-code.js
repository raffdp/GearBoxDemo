import { Component, h, Prop, Watch } from '@stencil/core';
import QRCode from 'qrcode';
/**
 * Renders a string into a QR code image (html canvas)
 */
export class ZeaQrCode {
    constructor() {
        /**
         * The content to code into the QR
         */
        this.content = window.location.href;
        /**
         * The content to code into the QR
         */
        this.scale = 4;
    }
    /**
    /**
     * Listen for changes on the content prop
     */
    onContentChanged() {
        this.makeQR();
    }
    /**
     * Runs when component finishes loading
     */
    componentDidLoad() {
        this.makeQR();
    }
    /**
     * Make the QR image as a canvas
     */
    makeQR() {
        if (this.canvas)
            this.canvas.remove();
        QRCode.toCanvas(this.content, { scale: this.scale }).then((canvas) => {
            this.canvas = canvas;
            this.container.appendChild(this.canvas);
        });
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        return (h("div", { class: "zea-qr-code", ref: (el) => (this.container = el) }));
    }
    static get is() { return "zea-qr-code"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-qr-code.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-qr-code.css"]
    }; }
    static get properties() { return {
        "content": {
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
                "text": "The content to code into the QR"
            },
            "attribute": "content",
            "reflect": false,
            "defaultValue": "window.location.href"
        },
        "scale": {
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
                "text": "The content to code into the QR"
            },
            "attribute": "scale",
            "reflect": false,
            "defaultValue": "4"
        }
    }; }
    static get watchers() { return [{
            "propName": "content",
            "methodName": "onContentChanged"
        }]; }
}
