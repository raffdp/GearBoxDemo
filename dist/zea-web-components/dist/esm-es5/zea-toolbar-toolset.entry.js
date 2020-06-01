import { r as registerInstance, h, d as getElement } from './index-12ee0265.js';
var zeaToolbarToolsetCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-toolset{background-repeat:no-repeat;background-position:38px 34px;background-size:5px;background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjAxQzcxOEE3NjJFQjExRUFBQzdFRTU5MkM3MEIwNjY1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjAxQzcxOEE4NjJFQjExRUFBQzdFRTU5MkM3MEIwNjY1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDFDNzE4QTU2MkVCMTFFQUFDN0VFNTkyQzcwQjA2NjUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDFDNzE4QTY2MkVCMTFFQUFDN0VFNTkyQzcwQjA2NjUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz59SANnAAAAN0lEQVR42qTMwQ0AIAwDsTI5oxt1Be6kPJ2DCd3Zg89dFatYxSpWsYpVrGIVq1jFKlaxircnwACIPE/UtxKEdgAAAABJRU5ErkJggg==')}.children{position:absolute;margin-left:56px;margin-top:-48px;background-color:var(--color-background-2);border-radius:30px;display:-ms-flexbox;display:flex}";
var ZeaToolbar = /** @class */ (function () {
    function ZeaToolbar(hostRef) {
        registerInstance(this, hostRef);
        this.children = [];
        this.mouseIsdown = false;
    }
    /**
     * zeaToolbarToolClickHandler
     * @param {any} e the event data
     */
    ZeaToolbar.prototype.zeaToolbarToolClickHandler = function (e) {
        this.childrenContainer.style.display = 'none';
        var clickedTool = e.detail;
        if (this.currentTool == clickedTool) {
            if (clickedTool.isActive) {
                this.childrenContainer.style.display = 'flex';
            }
            return;
        }
        if (this.children.includes(clickedTool)) {
            this.children.push(this.currentTool);
            this.childrenContainer.appendChild(this.currentTool);
            this.currentTool = clickedTool;
            this.setActiveTool();
        }
    };
    /**
     * Called everytime component renders
     */
    ZeaToolbar.prototype.componentDidLoad = function () {
        this.setActiveTool();
    };
    /**
     * setActiveTool
     */
    ZeaToolbar.prototype.setActiveTool = function () {
        if (!this.currentTool) {
            this.currentTool = this.children.shift();
        }
        this.currentContainer.appendChild(this.currentTool);
        this.childrenContainer.style.display = 'none';
    };
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    ZeaToolbar.prototype.render = function () {
        var _this = this;
        var toolKeys = Object.keys(this.data.tools);
        return (h("div", { class: "zea-toolset", ref: function (el) { return (_this.toolsetElement = el); } }, h("div", { class: "current", ref: function (el) { return (_this.currentContainer = el); } }), h("div", { class: "children", ref: function (el) { return (_this.childrenContainer = el); } }, toolKeys &&
            toolKeys.map(function (toolKey) {
                var tool = _this.data.tools[toolKey];
                return (h(tool.tag, { key: toolKey, data: tool.data, ref: function (el) { return _this.children.push(el); } }));
            }))));
    };
    Object.defineProperty(ZeaToolbar.prototype, "hostElement", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return ZeaToolbar;
}());
ZeaToolbar.style = zeaToolbarToolsetCss;
export { ZeaToolbar as zea_toolbar_toolset };
