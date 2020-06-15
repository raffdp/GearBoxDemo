import { r as registerInstance, h } from './index-12ee0265.js';

const zeaToolbarCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}:root{--toolbar-active-color:var(--color-primary-2)}.zea-toolbar{color:var(--color-foreground-1);background-color:var(--color-background-2);position:fixed;border-radius:30px}";

const ZeaToolbar = class {
    constructor(hostRef) {
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
    mousedownHandler(event) {
        if (event.currentTarget.tagName == 'ZEA-TOOLBAR') {
            this.mouseIsDown = true;
            this.offset = [
                this.toolbarElement.offsetLeft - event.clientX,
                this.toolbarElement.offsetTop - event.clientY,
            ];
        }
    }
    /**
     * Listen to mouseup event
     */
    mouseupHandler() {
        this.mouseIsDown = false;
    }
    /**
     * Listen to mousemove event
     * @param {any} event the event
     */
    mousemoveHandler(event) {
        if (this.mouseIsDown) {
            this.toolbarElement.style.left = `${event.clientX + this.offset[0]}px`;
            this.toolbarElement.style.top = `${event.clientY + this.offset[1]}px`;
        }
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        const toolKeys = Object.keys(this.tools);
        return (h("div", { class: "zea-toolbar", ref: (el) => (this.toolbarElement = el) }, toolKeys &&
            toolKeys.map((toolKey) => {
                const tool = this.tools[toolKey];
                return h(tool.tag, { data: tool.data, key: toolKey });
            })));
    }
};
ZeaToolbar.style = zeaToolbarCss;

export { ZeaToolbar as zea_toolbar };
