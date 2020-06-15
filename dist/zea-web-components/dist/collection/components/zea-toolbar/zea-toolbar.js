import { Component, h, Prop, Listen } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaToolbar {
    constructor() {
        this.offset = [0, 0];
        /**
         * Array of tools
         */
        this.tools = {};
    }
    /**
     * Listen to mousedown event
     * @param {any} event the event
     */
    mousedownHandler(event) {
        if (event.currentTarget.tagName == 'ZEA-TOOLBAR') {
            this.mouseIsDown = true;
            this.offset = [
                this.toolbarElement.offsetLeft - event.clientX,
                this.toolbarElement.offsetTop - event.clientY,
            ];
        }
    }
    /**
     * Listen to mouseup event
     */
    mouseupHandler() {
        this.mouseIsDown = false;
    }
    /**
     * Listen to mousemove event
     * @param {any} event the event
     */
    mousemoveHandler(event) {
        if (this.mouseIsDown) {
            this.toolbarElement.style.left = `${event.clientX + this.offset[0]}px`;
            this.toolbarElement.style.top = `${event.clientY + this.offset[1]}px`;
        }
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        const toolKeys = Object.keys(this.tools);
        return (h("div", { class: "zea-toolbar", ref: (el) => (this.toolbarElement = el) }, toolKeys &&
            toolKeys.map((toolKey) => {
                const tool = this.tools[toolKey];
                return h(tool.tag, { data: tool.data, key: toolKey });
            })));
    }
    static get is() { return "zea-toolbar"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-toolbar.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-toolbar.css"]
    }; }
    static get properties() { return {
        "tools": {
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
                "text": "Array of tools"
            },
            "attribute": "tools",
            "reflect": false,
            "defaultValue": "{}"
        }
    }; }
    static get listeners() { return [{
            "name": "mousedown",
            "method": "mousedownHandler",
            "target": undefined,
            "capture": false,
            "passive": true
        }, {
            "name": "mouseup",
            "method": "mouseupHandler",
            "target": "document",
            "capture": false,
            "passive": true
        }, {
            "name": "mousemove",
            "method": "mousemoveHandler",
            "target": "document",
            "capture": false,
            "passive": true
        }]; }
}
