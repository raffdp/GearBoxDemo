import { Component, h, Prop, Element, Listen } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaToolbar {
    constructor() {
        this.children = [];
        this.mouseIsdown = false;
    }
    /**
     * zeaToolbarToolClickHandler
     * @param {any} e the event data
     */
    zeaToolbarToolClickHandler(e) {
        this.childrenContainer.style.display = 'none';
        const clickedTool = e.detail;
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
    }
    /**
     * Called everytime component renders
     */
    componentDidLoad() {
        this.setActiveTool();
    }
    /**
     * setActiveTool
     */
    setActiveTool() {
        if (!this.currentTool) {
            this.currentTool = this.children.shift();
        }
        this.currentContainer.appendChild(this.currentTool);
        this.childrenContainer.style.display = 'none';
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        const toolKeys = Object.keys(this.data.tools);
        return (h("div", { class: "zea-toolset", ref: (el) => (this.toolsetElement = el) },
            h("div", { class: "current", ref: (el) => (this.currentContainer = el) }),
            h("div", { class: "children", ref: (el) => (this.childrenContainer = el) }, toolKeys &&
                toolKeys.map((toolKey) => {
                    const tool = this.data.tools[toolKey];
                    return (h(tool.tag, { key: toolKey, data: tool.data, ref: (el) => this.children.push(el) }));
                }))));
    }
    static get is() { return "zea-toolbar-toolset"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-toolbar-toolset.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-toolbar-toolset.css"]
    }; }
    static get properties() { return {
        "data": {
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
                "text": "Array of tools"
            },
            "attribute": "data",
            "reflect": false
        }
    }; }
    static get elementRef() { return "hostElement"; }
    static get listeners() { return [{
            "name": "zeaToolbarToolClick",
            "method": "zeaToolbarToolClickHandler",
            "target": "window",
            "capture": false,
            "passive": false
        }]; }
}
