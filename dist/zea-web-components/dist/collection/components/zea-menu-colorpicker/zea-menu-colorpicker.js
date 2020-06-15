import { Component, h, Prop } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaMenuColorpicker {
    constructor() {
        this.colorElements = [];
        this.shown = false;
    }
    /**
     * Handler for click events on the whole window
     * @param {any} e the event
     */
    handleDropDownColorClick(e) {
        if (e.target == this.currentColor)
            return;
        if (e.target.tagName == 'ZEA-MENU-COLOR') {
            // Re-insert the previous color at the start of the list
            const referenceNode = this.dropDownContainer.childNodes[0];
            this.dropDownContainer.insertBefore(this.currentColor, referenceNode);
            this.currentColor = e.target;
            this.setActiveColors();
            this.currentColorContainer.appendChild(this.currentColor);
            this.shown = false;
            if ('callback' in this.currentColor)
                this.runCallback(this.currentColor);
        }
    }
    /**
     * Set the active colors through css variables
     */
    setActiveColors() {
        document.documentElement.style.setProperty('--toolbar-active-bg-color', this.currentColor.color);
        document.documentElement.style.setProperty('--toolbar-active-fg-color', this.currentColor.fgColor);
    }
    /**
     * Handle click on currently selected color
     */
    handleCurrentColorClick() {
        this.shown = !this.shown;
    }
    /**
     * Called everytime the component renders to run some setup on child elements
     */
    componentDidRender() {
        this.setupChildren();
    }
    /**
     * Run some setup for the children items
     */
    setupChildren() {
        this.dropDownContainer
            .querySelector('slot')
            .assignedElements()
            .forEach((element) => {
            if (element.tagName == 'ZEA-MENU-COLOR') {
                this.colorElements.push(element);
                element.addEventListener('click', this.handleDropDownColorClick.bind(this));
            }
        });
        if (!this.currentColor) {
            this.currentColor = this.colorElements[0];
            this.setActiveColors();
        }
        this.currentColorContainer.appendChild(this.currentColor);
    }
    /**
     * Run the item's callback
     * @param {any} element The element whose callback to call
     */
    runCallback(element) {
        if (element.callback) {
            if (typeof element.callback == 'string') {
                eval(element.callback);
            }
            else {
                element.callback(element);
            }
        }
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        return (h("div", { class: "zea-menu-colorpicker" },
            h("div", { onClick: this.handleCurrentColorClick.bind(this), class: "currentColor", ref: el => (this.currentColorContainer = el) }),
            h("div", { class: `colorDropdown ${this.shown ? 'shown' : ''}`, ref: el => (this.dropDownContainer = el) },
                h("slot", null))));
    }
    static get is() { return "zea-menu-colorpicker"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-menu-colorpicker.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-menu-colorpicker.css"]
    }; }
    static get properties() { return {
        "shown": {
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
                "text": ""
            },
            "attribute": "shown",
            "reflect": false,
            "defaultValue": "false"
        }
    }; }
}
