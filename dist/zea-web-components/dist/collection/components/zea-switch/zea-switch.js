import { Component, Element, h, Prop, State, Watch } from '@stencil/core';
/**
 * Main Class for the component
 */
export class ZeaSwitch {
    constructor() {
        /**
         * Whether the switch is disabled
         */
        this.disabled = false;
        /**
         * Whether the switch is checked
         */
        this.checked = false;
    }
    /**
     * Listen for changes on the checked prop
     * @param {boolean} checked the checked state
     */
    onCheckedChanged(checked) {
        this.element.shadowRoot.querySelector('input').checked = checked;
        this.updateElementClass();
        this.stateLabel = checked ? 'On' : 'Off';
    }
    /**
     * Listen for changes on the disabled prop
     * @param {boolean} disabled the disabled state
     */
    onDisabledChanged(disabled) {
        this.element.shadowRoot.querySelector('input').disabled = disabled;
        this.updateElementClass();
    }
    /**
     * Update element class according to switch state
     */
    updateElementClass() {
        this.elementClass = this.checked ? 'checked' : '';
        this.elementClass += this.disabled ? ' disabled ' : '';
    }
    /**
     * Change switch state on click
     */
    toggleCheck() {
        if (!this.disabled) {
            this.checked = !this.checked;
        }
    }
    /**
     * Runs when component loads
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
        return (h("div", { class: 'zea-switch ' + this.elementClass, onClick: () => {
                this.toggleCheck();
            } },
            h("span", { class: "zea-switch-wrap" },
                h("span", { class: "zea-switch-track" }),
                h("span", { class: "zea-switch-button" }),
                h("span", { class: "zea-switch-label" }, this.stateLabel)),
            h("input", { type: "checkbox", name: this.name })));
    }
    static get is() { return "zea-switch"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-switch.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-switch.css"]
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
                "text": "Text/html to be displayed inside the button"
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
                "text": "Whether the switch is disabled"
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
                "text": "Whether the switch is checked"
            },
            "attribute": "checked",
            "reflect": false,
            "defaultValue": "false"
        },
        "stateLabel": {
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
                "text": "State label to show next to the switch"
            },
            "attribute": "state-label",
            "reflect": false
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
