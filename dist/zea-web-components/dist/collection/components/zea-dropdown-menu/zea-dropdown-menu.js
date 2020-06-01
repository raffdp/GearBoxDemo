import { Component, h, Prop, State, Listen } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaDropdownMenu {
    constructor() {
        this.hotkeysToActions = {};
        /**
         * Tree representation of the items and actions
         * based on path arrays
         */
        this.menuItems = { children: {} };
    }
    /**
     * Runs once when component first loads
     */
    componentDidLoad() {
        // subscribe to the actionAdded signal
        this.appData.actionRegistry.actionAdded.connect(() => {
            this.makeMenuTree();
        });
        this.makeMenuTree();
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
        if (comboString in this.hotkeysToActions) {
            const action = this.hotkeysToActions[comboString];
            action.callback(e);
        }
        e.preventDefault();
    }
    /**
     * Make a hierarchical representation out of
     * the path arrays in the action list
     */
    makeMenuTree() {
        this.actions = this.appData.actionRegistry.getActions();
        this.actions.forEach((action) => {
            const currentItem = this.getMenuTreeItem(action.path);
            currentItem['children'][action.name] = action;
        });
        this.feedHotKeys();
    }
    /**
     * Feed the list of hotkeys
     */
    feedHotKeys() {
        this.actions.forEach((action) => {
            const hotkey = this.keyComboAsText(action);
            if (hotkey)
                this.hotkeysToActions[hotkey] = action;
        });
    }
    /**
     * Get a specific tree location using an action's path
     * @param {any} path the path
     * @return {any} item
     */
    getMenuTreeItem(path) {
        // here menuItems is modified by reference
        let currentItem = this.menuItems;
        path.forEach((pathPart) => {
            if (!(pathPart in currentItem.children)) {
                currentItem.children[pathPart] = { children: {} };
            }
            // the reference runs deep
            currentItem = currentItem.children[pathPart];
        });
        return currentItem;
    }
    /**
     * Generate markup for a branch with children
     * @param {any} key the key
     * @param {any} item the item
     * @return {JSX} the ul
     */
    makeBranch(key, item) {
        return (h("li", { key: key },
            h("span", { class: "branch-label" },
                h("span", { class: "branch-name" }, key),
                h("span", { class: "branch-arrow" }, this.getBranchArrow())),
            h("ul", null, this.makeBranchItems(item))));
    }
    /**
     * Generate markup for the children of a branch
     * @param {any} item the item
     * @return {JSX} the ul
     */
    makeBranchItems(item) {
        const items = [];
        Object.keys(item.children).forEach((key) => {
            const currentItem = item.children[key];
            if ('children' in currentItem) {
                items.push(this.makeBranch(key, currentItem));
            }
            else {
                items.push(this.makeLeaf(key, currentItem));
            }
        });
        return items;
    }
    /**
     * Generate markup for a leaf item, with an anchor
     * and no children
     * @param {any} key the key
     * @param {any} action the action
     * @return {JSX} the ul
     */
    makeLeaf(key, action) {
        return (h("li", { key: key, onClick: (e) => {
                this.hadleLeafClick(e, action);
            } },
            h("span", { class: "leaf-label" },
                h("span", { class: "action-name" }, action.name),
                h("span", { class: "keyboard-shortcut" }, this.keyComboAsHtml(action)))));
    }
    /**
     * Handle click events on leafs
     * @param {any} event the event
     * @param {any} action the action
     */
    hadleLeafClick(event, action) {
        if ('callback' in action) {
            action.callback();
        }
        this.flashItem(event.currentTarget);
    }
    /**
     * Rapidly change items bg color to indicate it was clicked
     * @param {any} target the clicked li item
     */
    flashItem(target) {
        target.classList.toggle('flashed');
        const interval = setInterval(() => {
            target.classList.toggle('flashed');
        }, 80);
        setTimeout(() => {
            clearInterval(interval);
            target.classList.remove('flashed');
        }, 100);
    }
    /**
     * Generate markup for keyboard shortcut
     * @param {any} action the action
     * @return {array} the html elements
     */
    keyComboAsHtml(action) {
        const { metaKeys, key } = action;
        const elements = [];
        if (!key && !metaKeys) {
            return null;
        }
        if (metaKeys.control) {
            elements.push(h("span", { class: "keyboard-key" }, "Ctrl"));
            elements.push('+');
        }
        if (metaKeys.alt) {
            elements.push(h("span", { class: "keyboard-key" }, "Alt"));
            elements.push('+');
        }
        if (metaKeys.shift) {
            elements.push(h("span", { class: "keyboard-key" }, "Shift"));
            elements.push('+');
        }
        elements.push(h("span", { class: "keyboard-key" }, key));
        return elements;
    }
    /**
     * Generate markup for keyboard shortcut
     * @param {any} action the action
     * @return {string} the html elements
     */
    keyComboAsText(action) {
        const { metaKeys, key } = action;
        const elements = [];
        if (!key && !metaKeys) {
            return '';
        }
        if (metaKeys) {
            if (metaKeys.shift)
                elements.push('shift');
            if (metaKeys.alt)
                elements.push('alt');
            if (metaKeys.control)
                elements.push('ctrl');
        }
        elements.push(key);
        return elements.join('+').toLowerCase();
    }
    /**
     * Get arrow icon svg for branch
     * @return {JSX} the arrow svg
     */
    getBranchArrow() {
        return (h("svg", { class: "branch-arrow-icon", xmlns: "http://www.w3.org/2000/svg", height: "16", viewBox: "0 0 24 24", width: "16" },
            h("path", { d: "M8 5v14l11-7z" }),
            h("path", { d: "M0 0h24v24H0z", fill: "none" })));
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        return (h("div", { class: "zea-dropdown-menu" },
            h("ul", { class: "menu-root" }, this.makeBranchItems(this.menuItems))));
    }
    static get is() { return "zea-dropdown-menu"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-dropdown-menu.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-dropdown-menu.css"]
    }; }
    static get properties() { return {
        "appData": {
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
                "text": "The application data\nTODO: pass actionRegistry only instead of whole appData"
            },
            "attribute": "app-data",
            "reflect": false
        }
    }; }
    static get states() { return {
        "actions": {},
        "menuItems": {}
    }; }
    static get listeners() { return [{
            "name": "keydown",
            "method": "keydownHandler",
            "target": "document",
            "capture": false,
            "passive": false
        }]; }
}
