import { r as registerInstance, c as createEvent, h, d as getElement } from './index-12ee0265.js';
var zeaToolbarToolCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.tool-wrap{padding:8px;margin:4px;border-radius:20px;color:var(--color-foreground-1)}.tool-wrap:hover{background-color:var(--color-grey-3)}.tool-wrap.active,.tool-wrap.active:hover{background-color:var(--toolbar-active-bg-color, var(--color-primary-1));color:var(--toolbar-active-fg-color, var(--color-background-1))}";
var ZeaToolbarTool = /** @class */ (function () {
    function ZeaToolbarTool(hostRef) {
        registerInstance(this, hostRef);
        this.zeaToolbarToolClick = createEvent(this, "zeaToolbarToolClick", 7);
    }
    /**
     * zeaToolbarToolClickHandler
     * @param {any} event the event data
     */
    ZeaToolbarTool.prototype.zeaToolbarToolClickHandler = function () {
        this.isActive = false;
    };
    /**
     * Handle click on user chip
     * @param {any} e the event
     */
    ZeaToolbarTool.prototype.toolClickHandler = function (e) {
        this.zeaToolbarToolClick.emit(this.hostElement);
        this.isActive = true;
        if ('callback' in this.data) {
            this.data.callback(e);
        }
    };
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    ZeaToolbarTool.prototype.render = function () {
        var _this = this;
        return (h("div", { ref: function (el) { return (_this.outerWrap = el); }, class: "tool-wrap " + (this.isActive ? 'active' : ''), title: this.data.toolName, onClick: this.toolClickHandler.bind(this) }, h("zea-icon", { name: this.data.iconName, type: this.data.iconType })));
    };
    Object.defineProperty(ZeaToolbarTool.prototype, "hostElement", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return ZeaToolbarTool;
}());
ZeaToolbarTool.style = zeaToolbarToolCss;
export { ZeaToolbarTool as zea_toolbar_tool };
