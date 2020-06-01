'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaMenuColorCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-menu-color{--zea-menu-color-color:var(--theme-color);color:var(--zea-menu-color-color)}.zea-menu-color{width:24px;height:24px;border-radius:12px;display:block}";

const ZeaMenuColor = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        /**
         * The color assigned to this item
         */
        this.color = '';
        /**
         * The color of the foreground (icon) for the tool
         */
        this.fgColor = '';
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        return (index.h("div", { class: "zea-menu-color", style: { backgroundColor: this.color } }));
    }
};
ZeaMenuColor.style = zeaMenuColorCss;

exports.zea_menu_color = ZeaMenuColor;
