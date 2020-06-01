import { Component, h, Prop } from '@stencil/core';
/**
 * Main class for component
 */
export class ZeaPopupMenuItem {
    constructor() {
        /**
         * Handle item click
         * @param {Event} e The event
         */
        this.handleItemClick = (e) => {
            if (this.clickHandler)
                this.clickHandler(e);
        };
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        let startIcon;
        let endIcon;
        if (this.startIcon) {
            startIcon = (h("span", { class: "start-icon" },
                h("zea-icon", { name: this.startIcon })));
        }
        if (this.endIcon) {
            endIcon = (h("span", { class: "end-icon" },
                h("zea-icon", { name: this.endIcon })));
        }
        return (h("div", { onClick: (e) => this.handleItemClick(e), class: "zea-popup-menu-item" },
            startIcon,
            h("span", null,
                h("slot", null)),
            endIcon));
    }
    static get is() { return "zea-popup-menu-item"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-popup-menu-item.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-popup-menu-item.css"]
    }; }
    static get properties() { return {
        "clickHandler": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "CallableFunction",
                "resolved": "CallableFunction",
                "references": {
                    "CallableFunction": {
                        "location": "global"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Click Handler"
            }
        },
        "startIcon": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Material icon name for item start"
            },
            "attribute": "start-icon",
            "reflect": false
        },
        "endIcon": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Material icon name for item end"
            },
            "attribute": "end-icon",
            "reflect": false
        }
    }; }
}
