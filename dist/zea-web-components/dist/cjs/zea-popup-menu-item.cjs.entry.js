'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaPopupMenuItemCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-popup-menu-item{color:var(--color-foreground-1);font-family:sans-serif;padding:0.3em 0.6em;cursor:pointer;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:left;justify-content:left}.zea-popup-menu-item:hover{background-color:var(--color-grey-3)}.zea-popup-menu-item.twinkled{background-color:var(--color-secondary-3)}.start-icon{margin-right:0.5em;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.end-icon{margin-left:0.5em;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}";

const ZeaPopupMenuItem = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        /**
         * Handle item click
         * @param {Event} e The event
         */
        this.handleItemClick = (e) => {
            if (this.clickHandler)
                this.clickHandler(e);
        };
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        let startIcon;
        let endIcon;
        if (this.startIcon) {
            startIcon = (index.h("span", { class: "start-icon" }, index.h("zea-icon", { name: this.startIcon })));
        }
        if (this.endIcon) {
            endIcon = (index.h("span", { class: "end-icon" }, index.h("zea-icon", { name: this.endIcon })));
        }
        return (index.h("div", { onClick: (e) => this.handleItemClick(e), class: "zea-popup-menu-item" }, startIcon, index.h("span", null, index.h("slot", null)), endIcon));
    }
};
ZeaPopupMenuItem.style = zeaPopupMenuItemCss;

exports.zea_popup_menu_item = ZeaPopupMenuItem;
