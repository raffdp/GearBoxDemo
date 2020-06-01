'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaMenuSubitemsCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.fgpath{fill:var(--color-foreground-1)}.arrow{display:-ms-flexbox;display:flex}.subitems{display:none;position:absolute;left:100%;margin-top:-24px;padding-left:1px;background-color:var(--color-background-2)}.shown .subitems{display:block}.dropdown .subitems{left:0;margin-top:13px;padding-top:1px}";

const ZeaMenuSubitems = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
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
        return (index.h("div", { class: `zea-menu-subitems ${this.type} ${this.shown ? 'shown' : ''} ` }, index.h("div", { class: "arrow" }, index.h("svg", { class: "branch-arrow-icon", xmlns: "http://www.w3.org/2000/svg", height: "13", viewBox: "0 0 24 24", width: "13" }, index.h("path", { d: "M8 5v14l11-7z", class: "fgpath" }), index.h("path", { d: "M0 0h24v24H0z", fill: "none" }))), index.h("div", { class: "subitems", ref: el => (this.subitemsElement = el) }, index.h("slot", null))));
    }
    get hostElement() { return index.getElement(this); }
    static get watchers() { return {
        "rootMenu": ["watchHandler"]
    }; }
};
ZeaMenuSubitems.style = zeaMenuSubitemsCss;

exports.zea_menu_subitems = ZeaMenuSubitems;
