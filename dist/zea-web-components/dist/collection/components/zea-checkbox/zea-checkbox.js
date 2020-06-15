import { Component, Element, h, Prop, State, Watch } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaCheckbox {
    constructor() {
        /**
        /**
         * Whether the checkbox is disabled
         */
        this.disabled = false;
        /**
        /**
         * Whether the checkbox is checked
         */
        this.checked = false;
    }
    /**
    /**
     * Listen for changes on the checked prop
     * @param {boolean} checked New value for the checked prop
     */
    onCheckedChanged(checked) {
        this.element.shadowRoot.querySelector('input').checked = checked;
        this.updateElementClass();
    }
    /**
    /**
     * Listen for changes on the disabled prop
     * @param {boolean} disabled New value for the disabled prop
     */
    onDisabledChanged(disabled) {
        this.element.shadowRoot.querySelector('input').disabled = disabled;
        this.updateElementClass();
    }
    /**
    /**
     * Update element class according to checkbox state
     */
    updateElementClass() {
        this.elementClass = this.checked ? 'checked' : '';
        this.elementClass += this.disabled ? ' disabled ' : '';
    }
    /**
     * Change checkbox state on click
     */
    toggleCheck() {
        if (!this.disabled) {
            this.checked = !this.checked;
        }
    }
    /**
     * Called everytime component loads
     */
    componentDidLoad() {
        this.onCheckedChanged(this.checked);
        this.onDisabledChanged(this.disabled);
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        return (h("div", { class: 'zea-checkbox ' + this.elementClass, onClick: () => {
                this.toggleCheck();
            } },
            h("span", { class: "zea-checkbox-wrap" },
                h("span", { class: "zea-checkbox-icon" },
                    h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "100%", height: "100%", viewBox: "0 0 24 24" },
                        h("path", { class: "icon-path", d: "M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z" })))),
            h("input", { type: "checkbox", name: this.name })));
    }
    static get is() { return "zea-checkbox"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-checkbox.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-checkbox.css"]
    }; }
    static get properties() { return {
        "name": {
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
                "text": "/**\r\n   Text/html to be displayed inside the button"
            },
            "attribute": "name",
            "reflect": false
        },
        "disabled": {
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
                "text": "/**\r\n   Whether the checkbox is disabled"
            },
            "attribute": "disabled",
            "reflect": false,
            "defaultValue": "false"
        },
        "checked": {
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
                "text": "/**\r\n   Whether the checkbox is checked"
            },
            "attribute": "checked",
            "reflect": false,
            "defaultValue": "false"
        }
    }; }
    static get states() { return {
        "elementClass": {}
    }; }
    static get elementRef() { return "element"; }
    static get watchers() { return [{
            "propName": "checked",
            "methodName": "onCheckedChanged"
        }, {
            "propName": "disabled",
            "methodName": "onDisabledChanged"
        }]; }
}
