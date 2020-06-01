import { Component, h, Prop, Listen } from '@stencil/core';
/**
 */
export class ZeaNavigationDrawer {
    constructor() {
        /**
         */
        this.shown = false;
    }
    /**
     * Listen to click events on the whole document
     * @param {any} e The event
     */
    handleClick() {
        // if (!e.composedPath().includes(this.container)) {
        this.shown = false;
        // }
    }
    /**
     */
    onToggleClick() {
        this.shown = !this.shown;
    }
    /**
     */
    render() {
        return (h("div", { ref: (el) => (this.container = el), class: { 'zea-navigation-drawer': true, shown: this.shown } },
            h("div", { class: "drawer" },
                h("div", { class: "drawer-content" },
                    h("slot", null))),
            h("div", { class: "toggle", onClick: this.onToggleClick.bind(this) },
                h("zea-icon", { size: 30, name: "menu" }))));
    }
    static get is() { return "zea-navigation-drawer"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-navigation-drawer.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-navigation-drawer.css"]
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
            "name": "click",
            "method": "handleClick",
            "target": "document",
            "capture": true,
            "passive": false
        }]; }
}
