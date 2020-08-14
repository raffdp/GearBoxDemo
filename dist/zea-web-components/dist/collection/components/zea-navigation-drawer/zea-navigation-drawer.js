import { Component, h, Prop, Listen, Event } from '@stencil/core';
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
    handleClick(e) {
        if (!e.composedPath().includes(this.container) ||
            !e.composedPath().includes(this.toggleButton)) {
            this.shown = false;
            this.navDrawerClosed.emit(this);
        }
    }
    /**
     */
    onToggleClick() {
        this.shown = !this.shown;
        if (this.shown) {
            this.navDrawerOpen.emit(this);
        }
        else {
            this.navDrawerClosed.emit(this);
        }
    }
    /**
     */
    render() {
        return (h("div", { ref: (el) => (this.container = el), class: { 'zea-navigation-drawer': true, shown: this.shown } },
            h("div", { class: "drawer" },
                h("div", { class: "drawer-content" },
                    h("slot", null))),
            h("div", { class: "toggle", ref: (el) => (this.toggleButton = el), onClick: this.onToggleClick.bind(this) },
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
    static get events() { return [{
            "method": "navDrawerOpen",
            "name": "navDrawerOpen",
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
        }, {
            "method": "navDrawerClosed",
            "name": "navDrawerClosed",
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
    static get listeners() { return [{
            "name": "click",
            "method": "handleClick",
            "target": "document",
            "capture": false,
            "passive": false
        }]; }
}
