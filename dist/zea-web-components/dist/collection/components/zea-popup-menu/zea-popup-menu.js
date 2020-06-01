import { Component, h, Prop, State, Listen, Element } from '@stencil/core';
/**
 * Main class for component
 */
export class ZeaPopupMenu {
    constructor() {
        /**
         * Whether the menu should be shown
         */
        this.shown = false;
        /**
         * Add twinkle effect on item click
         * @param {any} elmnt the item element
         */
        this.twinkleElement = (elmnt) => {
            elmnt.classList.toggle('twinkled');
            const interval = setInterval(() => {
                elmnt.classList.toggle('twinkled');
            }, 70);
            setTimeout(() => {
                clearTimeout(interval);
                elmnt.classList.remove('twinkled');
            }, 100);
        };
    }
    /**
     * Main render function
     * @param {any} ev the event
     */
    handleClick(ev) {
        if (ev.target == this.anchorElement) {
            this.bbox = ev.target.getBoundingClientRect();
            this.leftOffset = `${this.bbox.left}px`;
            this.topOffset = `${this.bbox.top}px`;
            this.shown = !this.shown;
            return;
        }
        // check if the clicked element is part of the menu
        if (this.hostElement.contains(ev.target)) {
            const item = ev.target.shadowRoot.querySelector('.zea-popup-menu-item');
            this.twinkleElement(item);
            setTimeout(() => {
                this.shown = false;
            }, 300);
        }
        else {
            if (this.anchorElement)
                this.shown = false;
        }
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        return (h("div", { ref: (node) => (this.node = node), class: `zea-popup-menu ${this.shown ? 'shown' : 'hidden'}`, style: {
                top: this.topOffset,
                left: this.leftOffset,
            } },
            h("slot", null)));
    }
    static get is() { return "zea-popup-menu"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-popup-menu.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-popup-menu.css"]
    }; }
    static get properties() { return {
        "anchorElement": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "HTMLElement",
                "resolved": "HTMLElement",
                "references": {
                    "HTMLElement": {
                        "location": "global"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Anchor element"
            }
        },
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
                "text": "Whether the menu should be shown"
            },
            "attribute": "shown",
            "reflect": false,
            "defaultValue": "false"
        },
        "topOffset": {
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
                "text": ""
            },
            "attribute": "top-offset",
            "reflect": false
        },
        "leftOffset": {
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
                "text": ""
            },
            "attribute": "left-offset",
            "reflect": false
        }
    }; }
    static get states() { return {
        "bbox": {},
        "node": {}
    }; }
    static get elementRef() { return "hostElement"; }
    static get listeners() { return [{
            "name": "click",
            "method": "handleClick",
            "target": "window",
            "capture": false,
            "passive": false
        }]; }
}
