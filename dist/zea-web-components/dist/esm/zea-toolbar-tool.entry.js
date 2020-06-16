import { r as registerInstance, c as createEvent, h, d as getElement } from './index-12ee0265.js';

const zeaToolbarToolCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.tool-wrap{padding:8px;margin:4px;border-radius:20px;color:var(--color-foreground-1)}.tool-wrap:hover{background-color:var(--color-grey-3)}.tool-wrap.active,.tool-wrap.active:hover{background-color:var(--toolbar-active-bg-color, var(--color-primary-1));color:var(--toolbar-active-fg-color, var(--color-background-1))}";

const ZeaToolbarTool = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.zeaToolbarToolClick = createEvent(this, "zeaToolbarToolClick", 7);
    }
    /**
     * zeaToolbarToolClickHandler
     * @param {any} event the event data
     */
    zeaToolbarToolClickHandler() {
        this.isActive = false;
    }
    /**
     * Handle click on user chip
     * @param {any} e the event
     */
    toolClickHandler(e) {
        this.zeaToolbarToolClick.emit(this.hostElement);
        this.isActive = true;
        if ('callback' in this.data) {
            this.data.callback(e);
        }
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        return (h("div", { ref: (el) => (this.outerWrap = el), class: `tool-wrap ${this.isActive ? 'active' : ''}`, title: this.data.toolName, onClick: this.toolClickHandler.bind(this) }, h("zea-icon", { name: this.data.iconName, type: this.data.iconType })));
    }
    get hostElement() { return getElement(this); }
};
ZeaToolbarTool.style = zeaToolbarToolCss;

export { ZeaToolbarTool as zea_toolbar_tool };