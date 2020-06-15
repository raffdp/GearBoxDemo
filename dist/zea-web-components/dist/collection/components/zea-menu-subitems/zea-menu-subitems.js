import { Component, h, Prop, Listen, Element, Watch } from '@stencil/core';
/**
 * Main component class
 */
export class ZeaMenuSubitems {
    constructor() {
        this.subitemsArray = [];
        /**
         * Whether it is/should be shown
         */
        this.shown = false;
        /**
         * Menu type
         */
        this.type = '';
        /**
         * Whether the children should have checkboxes and behave as a radio button
         */
        this.radioSelect = false;
    }
    /**
     * zeaMenuItemClickHandler
     * @param {any} e the event data
     */
    windowClickHandler(e) {
        const clickedItem = e.detail;
        const itemIsDescendant = this.isDescendant(this.hostElement, clickedItem);
        if (clickedItem == this.parentItem) {
            this.shown = !this.shown;
        }
        else {
            if (!itemIsDescendant || !clickedItem.hasSubitems) {
                this.shown = false;
            }
        }
    }
    /**
     * zeaMenuItemClickHandler
     * @param {any} e the event data
     */
    windowItemPressHandler(e) {
        const clickedItem = e.detail;
        const itemIsDescendant = this.isDescendant(this.hostElement, clickedItem);
        if (this.radioSelect && itemIsDescendant) {
            this.subitemsArray.forEach(element => {
                element.checked = false;
            });
        }
    }
    /**
     * Listen to click (mouse up) events on the whole window
     * @param {any} ev the event
     */
    handleWindowMouseup(ev) {
        if (!this.isDescendant(this.rootMenu, ev.target)) {
            this.shown = false;
        }
    }
    /**
     * isDescendant
     * @param {any} parent the parent
     * @param {any} child the parent
     * @return {any} whether or not is parent
     */
    isDescendant(parent, child) {
        let node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    /**
     * Called everytime the component renders
     * Apply the class to children
     */
    componentDidRender() {
        // this.setupChildren()
    }
    /**
     * Called everytime the component renders
     */
    watchHandler() {
        this.setupChildren();
    }
    /**
     * Run some setup for the children items
     */
    setupChildren() {
        this.subitemsElement
            .querySelector('slot')
            .assignedElements()
            .forEach((element) => {
            if ('itemParent' in element) {
                element.itemParent = this.hostElement;
            }
            if ('rootMenu' in element) {
                element.rootMenu = this.rootMenu;
            }
            if (this.radioSelect) {
                element.hasCheckbox = true;
            }
            this.subitemsArray.push(element);
        });
    }
    /**
     * Render function
     * @return {JSX}
     */
    render() {
        return (h("div", { class: `zea-menu-subitems ${this.type} ${this.shown ? 'shown' : ''} ` },
            h("div", { class: "arrow" },
                h("svg", { class: "branch-arrow-icon", xmlns: "http://www.w3.org/2000/svg", height: "13", viewBox: "0 0 24 24", width: "13" },
                    h("path", { d: "M8 5v14l11-7z", class: "fgpath" }),
                    h("path", { d: "M0 0h24v24H0z", fill: "none" }))),
            h("div", { class: "subitems", ref: el => (this.subitemsElement = el) },
                h("slot", null))));
    }
    static get is() { return "zea-menu-subitems"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-menu-subitems.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-menu-subitems.css"]
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
                "text": "Whether it is/should be shown"
            },
            "attribute": "shown",
            "reflect": false,
            "defaultValue": "false"
        },
        "type": {
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
                "text": "Menu type"
            },
            "attribute": "type",
            "reflect": false,
            "defaultValue": "''"
        },
        "parentItem": {
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
                "text": "The item this subitems belongs to"
            },
            "attribute": "parent-item",
            "reflect": false
        },
        "radioSelect": {
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
                "text": "Whether the children should have checkboxes and behave as a radio button"
            },
            "attribute": "radio-select",
            "reflect": false,
            "defaultValue": "false"
        },
        "rootMenu": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "HTMLElement",
                "resolved": "HTMLElement",
                "references": {
                    "HTMLElement": {
                        "location": "global"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The root menu this item belongs to"
            }
        }
    }; }
    static get elementRef() { return "hostElement"; }
    static get watchers() { return [{
            "propName": "rootMenu",
            "methodName": "watchHandler"
        }]; }
    static get listeners() { return [{
            "name": "zeaMenuItemClick",
            "method": "windowClickHandler",
            "target": "window",
            "capture": false,
            "passive": false
        }, {
            "name": "zeaMenuItemPressed",
            "method": "windowItemPressHandler",
            "target": "window",
            "capture": false,
            "passive": false
        }, {
            "name": "mouseup",
            "method": "handleWindowMouseup",
            "target": "window",
            "capture": false,
            "passive": true
        }]; }
}
