'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaToolbarColorpickerCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-colopicker{background-repeat:no-repeat;background-position:37px 20px;background-size:5px;background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjAxQzcxOEE3NjJFQjExRUFBQzdFRTU5MkM3MEIwNjY1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjAxQzcxOEE4NjJFQjExRUFBQzdFRTU5MkM3MEIwNjY1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDFDNzE4QTU2MkVCMTFFQUFDN0VFNTkyQzcwQjA2NjUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDFDNzE4QTY2MkVCMTFFQUFDN0VFNTkyQzcwQjA2NjUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz59SANnAAAAN0lEQVR42qTMwQ0AIAwDsTI5oxt1Be6kPJ2DCd3Zg89dFatYxSpWsYpVrGIVq1jFKlaxircnwACIPE/UtxKEdgAAAABJRU5ErkJggg==')}.children{position:absolute;margin-left:56px;margin-top:-42px;background-color:var(--color-background-2);border-radius:20px;display:grid;grid-gap:10px;padding:10px;grid-template-columns:1fr 1fr 1fr}.colorpicker-color{width:26px;height:26px;border-radius:15px;margin:11px}.children .colorpicker-color{margin:0px}";

const ZeaToolbarColorpicker = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.children = [];
        this.mouseIsdown = false;
    }
    /**
     * Called everytime component renders
     */
    componentDidLoad() {
        this.setActiveTool({});
    }
    /**
     * Set the active tool
     * @param {any} e The event
     */
    setActiveTool(e) {
        if (!this.currentTool) {
            this.currentTool = this.children.shift();
        }
        this.currentContainer.appendChild(this.currentTool);
        this.displayChildren = false;
        document.documentElement.style.setProperty('--toolbar-active-fg-color', this.currentTool.style.color);
        document.documentElement.style.setProperty('--toolbar-active-bg-color', this.currentTool.style.backgroundColor);
        const key = this.currentTool.getAttribute('data-key');
        if ('callback' in this.data.colors[key])
            this.data.colors[key].callback(e);
    }
    /**
     * Handle click on color
     * @param {any} e the event
     */
    handleChildrenClick(e) {
        this.childrenContainer.style.display = 'none';
        const clickedTool = e.currentTarget;
        if (clickedTool == this.currentTool) {
            if (this.displayChildren) {
                this.displayChildren = false;
            }
            else {
                this.displayChildren = true;
                this.currentTool = clickedTool;
            }
        }
        else if (this.children.includes(clickedTool)) {
            this.childrenContainer.appendChild(this.currentTool);
            this.children.push(this.currentTool);
            this.currentTool = clickedTool;
            this.setActiveTool(e);
        }
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        const colorKeys = Object.keys(this.data.colors);
        return (index.h("div", { class: "zea-colopicker", ref: (el) => (this.colopickerElement = el) }, index.h("div", { class: "current", ref: (el) => (this.currentContainer = el) }), index.h("div", { class: "children", style: { display: this.displayChildren ? 'grid' : 'none' }, ref: (el) => (this.childrenContainer = el) }, colorKeys &&
            colorKeys.map((colorKey) => {
                const color = this.data.colors[colorKey];
                return (index.h("div", { class: "colorpicker-color", style: {
                        backgroundColor: color.background,
                        color: color.foreground,
                    }, "data-key": colorKey, key: colorKey, onClick: this.handleChildrenClick.bind(this), ref: (el) => this.children.push(el) }));
            }))));
    }
};
ZeaToolbarColorpicker.style = zeaToolbarColorpickerCss;

exports.zea_toolbar_colorpicker = ZeaToolbarColorpicker;
