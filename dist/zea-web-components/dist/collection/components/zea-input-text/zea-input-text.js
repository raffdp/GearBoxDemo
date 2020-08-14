import { Component, h, Host, Prop } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaInputText {
    constructor() {
        /**
         */
        this.name = 'zea-input';
        /**
         */
        this.label = 'Enter text...';
        /**
         */
        this.invalidMessage = 'Not valid';
        /**
         */
        this.required = false;
        /**
         */
        this.disabled = false;
        /**
         */
        this.isValid = true;
        /**
         */
        this.autoValidate = false;
        /**
         */
        this.invalidMessageShown = false;
        /**
         */
        this.showLabel = true;
        /**
         */
        this.hidden = false;
    }
    /**
     */
    checkValue() {
        if (!this.inputElement)
            return;
        this.value = this.inputElement.value;
        this.value.replace(/(^\s+|\s+$)/, ''); // trim
        if (this.required) {
            if (!this.value) {
                this.invalidMessage = 'Field is required';
                this.isValid = false;
                if (this.autoValidate)
                    this.invalidMessageShown = true;
            }
            else {
                this.isValid = true;
                this.invalidMessageShown = false;
            }
        }
    }
    /**
     */
    onKeyUp(e) {
        this.checkValue();
        e.stopPropagation();
    }
    /**
     */
    onKeyDown(e) {
        e.stopPropagation();
    }
    /**
     */
    onBlur() {
        this.inputWrapElement.classList.remove('focused');
    }
    /**
     */
    onFocus() {
        this.inputWrapElement.classList.add('focused');
    }
    /**
     */
    componentDidRender() {
        this.checkValue();
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (h(Host, { class: `${this.hidden ? 'hidden' : ''}` },
            h("div", { class: `input-wrap ${this.value ? 'not-empty' : 'empty'} ${!this.invalidMessageShown ? 'valid' : 'invalid'} ${this.disabled ? 'disabled' : ''} ${this.hidden ? 'hidden' : ''}`, ref: (el) => (this.inputWrapElement = el) },
                this.showLabel && h("label", { class: "input-label" }, this.label),
                h("input", { ref: (el) => (this.inputElement = el), 
                    // placeholder={this.showLabel ? '' : this.label}
                    type: "text", value: this.value, onKeyDown: this.onKeyDown.bind(this), onKeyUp: this.onKeyUp.bind(this), onBlur: this.onBlur.bind(this), onFocus: this.onFocus.bind(this), disabled: this.disabled, class: {
                        invalid: (this.autoValidate || this.invalidMessageShown) &&
                            !this.isValid,
                    } }),
                h("div", { class: "underliner" },
                    h("div", { class: "expander" })),
                !this.isValid && this.invalidMessageShown && (h("div", { class: "invalid-message" }, this.invalidMessage)))));
    }
    static get is() { return "zea-input-text"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-input-text.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-input-text.css"]
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
                "text": ""
            },
            "attribute": "name",
            "reflect": false,
            "defaultValue": "'zea-input'"
        },
        "value": {
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
                "text": ""
            },
            "attribute": "value",
            "reflect": false
        },
        "label": {
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
            "attribute": "label",
            "reflect": false,
            "defaultValue": "'Enter text...'"
        },
        "invalidMessage": {
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
            "attribute": "invalid-message",
            "reflect": false,
            "defaultValue": "'Not valid'"
        },
        "required": {
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
            "attribute": "required",
            "reflect": false,
            "defaultValue": "false"
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
                "text": ""
            },
            "attribute": "disabled",
            "reflect": false,
            "defaultValue": "false"
        },
        "isValid": {
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
            "attribute": "is-valid",
            "reflect": false,
            "defaultValue": "true"
        },
        "autoValidate": {
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
            "attribute": "auto-validate",
            "reflect": false,
            "defaultValue": "false"
        },
        "invalidMessageShown": {
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
            "attribute": "invalid-message-shown",
            "reflect": false,
            "defaultValue": "false"
        },
        "showLabel": {
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
            "attribute": "show-label",
            "reflect": false,
            "defaultValue": "true"
        },
        "hidden": {
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
            "attribute": "hidden",
            "reflect": false,
            "defaultValue": "false"
        }
    }; }
}
