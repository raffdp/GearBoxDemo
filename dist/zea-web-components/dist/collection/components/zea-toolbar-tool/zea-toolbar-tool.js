import { Component, h, Prop, Event, Element, Listen, } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaToolbarTool {
    /**
     * zeaToolbarToolClickHandler
     * @param {any} event the event data
     */
    zeaToolbarToolClickHandler() {
        this.isActive = false;
    }
    /**
     * Handle click on user chip
     * @param {any} e the event
     */
    toolClickHandler(e) {
        this.zeaToolbarToolClick.emit(this.hostElement);
        this.isActive = true;
        if ('callback' in this.data) {
            this.data.callback(e);
        }
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        return (h("div", { ref: (el) => (this.outerWrap = el), class: `tool-wrap ${this.isActive ? 'active' : ''}`, title: this.data.toolName, onClick: this.toolClickHandler.bind(this) },
            h("zea-icon", { name: this.data.iconName, type: this.data.iconType })));
    }
    static get is() { return "zea-toolbar-tool"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-toolbar-tool.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-toolbar-tool.css"]
    }; }
    static get properties() { return {
        "data": {
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
                "text": "The tool data"
            },
            "attribute": "data",
            "reflect": false
        },
        "isActive": {
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
                "text": "Whether the tool is currently active"
            },
            "attribute": "is-active",
            "reflect": false
        }
    }; }
    static get events() { return [{
            "method": "zeaToolbarToolClick",
            "name": "zeaToolbarToolClick",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": "Event to emit when user chip gets clicked"
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }]; }
    static get elementRef() { return "hostElement"; }
    static get listeners() { return [{
            "name": "zeaToolbarToolClick",
            "method": "zeaToolbarToolClickHandler",
            "target": "window",
            "capture": false,
            "passive": false
        }]; }
}
