import { Component, h, Prop, Listen, Element } from '@stencil/core';
/**
 * Main component class
 */
export class ZeaMenu {
    constructor() {
        this.offset = [0, 0];
        this.leftOffset = '';
        this.topOffset = '';
        this.type = 'dropdown';
        this.shown = false;
        this.showAnchor = false;
        this.anchorIcon = 'ellipsis-vertical-circle-outline';
        this.contextualAlign = 'top-left';
    }
    /**
     * Listen to click (mouse up) events on the whole window
     * @param {any} ev the event
     */
    handleClick(ev) {
        if (ev.currentTarget == this.anchorElement) {
            this.shown = !this.shown;
            return;
        }
        else if (this.type == 'contextual' &&
            !this.isDescendant(this.hostElement, ev.target)) {
            this.shown = false;
        }
        this.mouseIsDown = false;
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
     * Listen to zeaMenuItemClick events on the whole window
     * @param {any} ev The zeaMenuItemClick event
     */
    handleItemClick(ev) {
        if (this.type == 'contextual' && !ev.detail.hasSubitems) {
            this.shown = false;
        }
    }
    /**
     * Listen to mousedown event
     * @param {any} event the event
     */
    mousedownHandler(event) {
        if (this.type == 'toolbar' && event.currentTarget.tagName == 'ZEA-MENU') {
            this.mouseIsDown = true;
            this.offset = [
                this.menuElement.offsetLeft - event.clientX,
                this.menuElement.offsetTop - event.clientY,
            ];
        }
    }
    /**
     * Listen to mousemove event
     * @param {any} event the event
     */
    mousemoveHandler(event) {
        if (this.type == 'toolbar' && this.mouseIsDown) {
            this.menuElement.style.left = `${event.clientX + this.offset[0]}px`;
            this.menuElement.style.top = `${event.clientY + this.offset[1]}px`;
        }
    }
    /**
     * Listen to click events on anchor
     * @param {any} ev the event
     */
    handleAnchorClick(ev) {
        this.handleClick(ev);
        ev.stopPropagation();
    }
    /**
     * Called once when component first loads
     */
    componentDidLoad() {
        // the menu is hidden by default to avoid flashing
        if (this.type != 'contextual') {
            this.shown = true;
        }
    }
    /**
     * Called everytime the component renders
     * Apply the class to children
     */
    componentDidRender() {
        this.setupChildren();
    }
    /**
     * Run some setup for the children items
     */
    setupChildren() {
        this.itemsContainer
            .querySelector('slot')
            .assignedNodes()
            .forEach((element) => {
            if ('type' in element) {
                element.type = this.type;
            }
            if ('itemParent' in element) {
                element.itemParent = this.hostElement;
            }
            if ('rootMenu' in element) {
                element.rootMenu = this.hostElement;
            }
        });
    }
    /**
     * Render function
     * @return {JSX}
     */
    render() {
        const anchor = this.type == 'contextual' && this.showAnchor ? (h("div", { onMouseUp: this.handleAnchorClick.bind(this), class: "menu-anchor", ref: (el) => (this.anchorElement = el) },
            h("zea-icon", { name: this.anchorIcon }))) : null;
        const menuClass = {};
        menuClass['zea-menu'] = true;
        menuClass[this.type] = true;
        menuClass['shown'] = this.shown;
        menuClass[this.contextualAlign] = true;
        const containerStyle = {
            top: this.topOffset,
            left: this.leftOffset,
        };
        return (h("div", { class: menuClass, ref: (el) => (this.menuElement = el) },
            anchor,
            h("div", { ref: (el) => (this.itemsContainer = el), class: "items", style: containerStyle },
                h("slot", null))));
    }
    static get is() { return "zea-menu"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-menu.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-menu.css"]
    }; }
    static get properties() { return {
        "leftOffset": {
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
            "attribute": "left-offset",
            "reflect": false,
            "defaultValue": "''"
        },
        "topOffset": {
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
            "attribute": "top-offset",
            "reflect": false,
            "defaultValue": "''"
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
                "text": ""
            },
            "attribute": "type",
            "reflect": false,
            "defaultValue": "'dropdown'"
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
        "showAnchor": {
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
            "attribute": "show-anchor",
            "reflect": false,
            "defaultValue": "false"
        },
        "anchorIcon": {
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
            "attribute": "anchor-icon",
            "reflect": false,
            "defaultValue": "'ellipsis-vertical-circle-outline'"
        },
        "contextualAlign": {
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
            "attribute": "contextual-align",
            "reflect": false,
            "defaultValue": "'top-left'"
        }
    }; }
    static get elementRef() { return "hostElement"; }
    static get listeners() { return [{
            "name": "mouseup",
            "method": "handleClick",
            "target": undefined,
            "capture": false,
            "passive": true
        }, {
            "name": "zeaMenuItemClick",
            "method": "handleItemClick",
            "target": "window",
            "capture": false,
            "passive": false
        }, {
            "name": "mousedown",
            "method": "mousedownHandler",
            "target": undefined,
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
