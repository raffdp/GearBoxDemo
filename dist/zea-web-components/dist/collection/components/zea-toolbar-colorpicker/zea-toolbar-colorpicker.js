import { Component, h, Prop } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaToolbarColorpicker {
    constructor() {
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
        return (h("div", { class: "zea-colopicker", ref: (el) => (this.colopickerElement = el) },
            h("div", { class: "current", ref: (el) => (this.currentContainer = el) }),
            h("div", { class: "children", style: { display: this.displayChildren ? 'grid' : 'none' }, ref: (el) => (this.childrenContainer = el) }, colorKeys &&
                colorKeys.map((colorKey) => {
                    const color = this.data.colors[colorKey];
                    return (h("div", { class: "colorpicker-color", style: {
                            backgroundColor: color.background,
                            color: color.foreground,
                        }, "data-key": colorKey, key: colorKey, onClick: this.handleChildrenClick.bind(this), ref: (el) => this.children.push(el) }));
                }))));
    }
    static get is() { return "zea-toolbar-colorpicker"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-toolbar-colorpicker.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-toolbar-colorpicker.css"]
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
        },
        "displayChildren": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Whether the color dropdown should be shown"
            },
            "attribute": "display-children",
            "reflect": false
        }
    }; }
}
