import { Component, h, Prop, Element, Listen, Event, Watch, } from '@stencil/core';
/**
 * Main component class
 */
export class ZeaMenuItem {
    constructor() {
        this.switch = false;
        this.active = false;
        this.hasCheckbox = false;
        this.checked = false;
        this.shown = false;
        this.allowHover = false;
        this.hotkey = '';
        this.type = '';
        this.hasSubitems = false;
    }
    /**
     * Listen to the event emitted when any item is clicked
     * @param {any} e the event data
     */
    windowClickHandler(e) {
        this.active = false;
        e.detail.active = true;
        /* if (this.isDescendant(this.subitemsElement, e.detail)) {
          this.active = true
        } */
        if (!e.detail.hasSubitems && this.type != 'toolbar') {
            this.active = false;
        }
    }
    /**
     * Listen to click (mouse up) events on the whole window
     * and make sure the item is deactivated if the click was
     * on an external element
     * @param {any} ev the event
     */
    handleWindowMouseup(ev) {
        if (!this.isDescendant(this.rootMenu, ev.target) &&
            this.type != 'toolbar') {
            this.active = false;
        }
    }
    /**
     * Check if an element is child of another
     * @param {any} parent the parent
     * @param {any} child the child
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
        this.container
            .querySelector('slot')
            .assignedElements()
            .forEach((element) => {
            if (element.tagName == 'ZEA-MENU-SUBITEMS') {
                this.hasSubitems = true;
                this.subitemsElement = element;
                this.subitemsElement.rootMenu = this.rootMenu;
                this.subitemsElement.parentItem = this.hostElement;
                this.subitemsElement.type = this.hostElement.parentElement['type'];
                this.outerWrap.appendChild(this.subitemsElement);
                this.container.classList.add('has-subitems');
                if (this.hostElement.parentElement.tagName == 'ZEA-MENU') {
                    this.subitemsElement.belongsToRoot = true;
                }
            }
        });
    }
    /**
     * Handle click/tap
     * @param {any} e The event
     */
    handleItemClick(e) {
        this.zeaMenuItemClick.emit(this.hostElement);
        /* const zeaSwitch = this.container.querySelector('ZEA-SWITCH')
        if (zeaSwitch && (!e.target || e.target.tagName != 'ZEA-SWITCH'))
          zeaSwitch.checked = !zeaSwitch.checked */
        /* if (
          this.checkboxElement &&
          (!e.target || e.target.tagName != 'ZEA-CHECKBOX')
        )
          this.checked = !this.checked */
        this.active = true;
        this.runCallback(e);
    }
    /**
     * Handle Mouse down
     * @param {any} e The event
     */
    handleItemMouseDown() {
        this.container.classList.add('pressed');
        this.zeaMenuItemPressed.emit(this.hostElement);
        this.checked = !this.checked;
    }
    /**
     * Handle mouse up
     * @param {any} e The event
     */
    handleItemMouseUp(e) {
        this.container.classList.remove('pressed');
        this.handleItemClick(e);
        if (!this.hasSubitems && this.type != 'toolbar') {
            this.active = false;
        }
    }
    /**
     * Run the item's callback
     * @param {any} payLoad The data to pass to the callback
     */
    runCallback(payLoad) {
        if (this.callback) {
            if (typeof this.callback == 'string') {
                eval(this.callback);
            }
            else {
                this.callback(payLoad);
            }
        }
    }
    /**
     * Listen for keyboard shortcuts
     * @param {any} e the event
     */
    keydownHandler(e) {
        if (e.target instanceof HTMLInputElement)
            return;
        const keys = [];
        if (e.shiftKey)
            keys.push('shift');
        if (e.altKey)
            keys.push('alt');
        if (e.metaKey)
            keys.push('ctrl');
        if (e.ctrlKey)
            keys.push('ctrl');
        if (e.key != 'Alt' &&
            e.key != 'Control' &&
            e.key != 'Ctrl' &&
            e.key != 'Shift') {
            keys.push(e.key);
        }
        const comboString = keys.join('+').toLowerCase();
        if (comboString == this.hotkey.toLowerCase()) {
            this.handleItemClick(new MouseEvent('click'));
        }
        e.preventDefault();
    }
    /**
     * Generate markup for keyboard shortcut
     * @param {any} action the action
     * @return {array} the html elements
     */
    keyComboAsHtml() {
        const hotkeyParts = this.hotkey.split('+');
        const elements = [];
        hotkeyParts.forEach((part) => {
            part = part.toLowerCase();
            if (part == 'ctrl') {
                elements.push(h("span", { class: "keyboard-key" }, "Ctrl"));
                elements.push('+');
            }
            else if (part == 'alt') {
                elements.push(h("span", { class: "keyboard-key" }, "Alt"));
                elements.push('+');
            }
            else if (part == 'shift') {
                elements.push(h("span", { class: "keyboard-key" }, "Shift"));
                elements.push('+');
            }
            else {
                elements.push(h("span", { class: "keyboard-key" }, part));
            }
        });
        return elements;
    }
    /**
     * Render function
     * @return {JSX}
     */
    render() {
        return (h("div", { ref: (el) => (this.container = el), class: `zea-menu-item ${this.type} ${this.active ? 'active' : ''} ${this.allowHover ? 'allow-hover' : ''}` },
            h("div", { class: "outer-wrap", ref: (el) => (this.outerWrap = el) },
                h("div", { class: "inner-wrap", onMouseDown: this.handleItemMouseDown.bind(this), onMouseUp: this.handleItemMouseUp.bind(this) },
                    this.hasCheckbox ? (h("zea-checkbox", { checked: this.checked, ref: (el) => (this.checkboxElement = el) })) : null,
                    h("slot", null),
                    this.switch ? (h("zea-switch", { checked: this.checked })) : null,
                    this.hotkey ? (h("span", { class: "hotkey" }, this.keyComboAsHtml())) : null))));
    }
    static get is() { return "zea-menu-item"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-menu-item.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-menu-item.css"]
    }; }
    static get properties() { return {
        "switch": {
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
            "attribute": "switch",
            "reflect": false,
            "defaultValue": "false"
        },
        "active": {
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
            "attribute": "active",
            "reflect": false,
            "defaultValue": "false"
        },
        "hasCheckbox": {
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
            "attribute": "has-checkbox",
            "reflect": false,
            "defaultValue": "false"
        },
        "checked": {
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
            "attribute": "checked",
            "reflect": false,
            "defaultValue": "false"
        },
        "callback": {
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
            "attribute": "callback",
            "reflect": false
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
        "allowHover": {
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
            "attribute": "allow-hover",
            "reflect": false,
            "defaultValue": "false"
        },
        "hotkey": {
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
            "attribute": "hotkey",
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
            "defaultValue": "''"
        },
        "hasSubitems": {
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
            "attribute": "has-subitems",
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
                "text": ""
            }
        }
    }; }
    static get events() { return [{
            "method": "zeaMenuItemClick",
            "name": "zeaMenuItemClick",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": "Event to emit when an item gets clicked"
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }, {
            "method": "zeaMenuItemPressed",
            "name": "zeaMenuItemPressed",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": "Event to emit when an item gets clicked"
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }]; }
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
            "name": "mouseup",
            "method": "handleWindowMouseup",
            "target": "window",
            "capture": false,
            "passive": true
        }, {
            "name": "keydown",
            "method": "keydownHandler",
            "target": "document",
            "capture": false,
            "passive": false
        }]; }
}
