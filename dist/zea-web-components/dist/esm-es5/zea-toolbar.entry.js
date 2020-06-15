import { r as registerInstance, h } from './index-12ee0265.js';
var zeaToolbarCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}:root{--toolbar-active-color:var(--color-primary-2)}.zea-toolbar{color:var(--color-foreground-1);background-color:var(--color-background-2);position:fixed;border-radius:30px}";
var ZeaToolbar = /** @class */ (function () {
    function ZeaToolbar(hostRef) {
        registerInstance(this, hostRef);
        this.offset = [0, 0];
        /**
         * Array of tools
         */
        this.tools = {};
    }
    /**
     * Listen to mousedown event
     * @param {any} event the event
     */
    ZeaToolbar.prototype.mousedownHandler = function (event) {
        if (event.currentTarget.tagName == 'ZEA-TOOLBAR') {
            this.mouseIsDown = true;
            this.offset = [
                this.toolbarElement.offsetLeft - event.clientX,
                this.toolbarElement.offsetTop - event.clientY,
            ];
        }
    };
    /**
     * Listen to mouseup event
     */
    ZeaToolbar.prototype.mouseupHandler = function () {
        this.mouseIsDown = false;
    };
    /**
     * Listen to mousemove event
     * @param {any} event the event
     */
    ZeaToolbar.prototype.mousemoveHandler = function (event) {
        if (this.mouseIsDown) {
            this.toolbarElement.style.left = event.clientX + this.offset[0] + "px";
            this.toolbarElement.style.top = event.clientY + this.offset[1] + "px";
        }
    };
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    ZeaToolbar.prototype.render = function () {
        var _this = this;
        var toolKeys = Object.keys(this.tools);
        return (h("div", { class: "zea-toolbar", ref: function (el) { return (_this.toolbarElement = el); } }, toolKeys &&
            toolKeys.map(function (toolKey) {
                var tool = _this.tools[toolKey];
                return h(tool.tag, { data: tool.data, key: toolKey });
            })));
    };
    return ZeaToolbar;
}());
ZeaToolbar.style = zeaToolbarCss;
export { ZeaToolbar as zea_toolbar };
