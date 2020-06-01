import { Component, h, Prop, Listen } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaInputSelect {
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
        this.optionsShown = false;
    }
    /**
     * Listen to click events on the whole document
     * @param {any} e The event
     */
    handleClick(e) {
        if (!e.composedPath().includes(this.inputWrapElement)) {
            this.optionsShown = false;
        }
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
    onContainerClick() {
        this.optionsShown = !this.optionsShown;
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
    componentDidLoad() {
        this.optionsContainer.addEventListener('click', (e) => {
            e.composedPath().forEach((element) => {
                if (element.tagName == 'ZEA-INPUT-SELECT-ITEM') {
                    this.value = element.value;
                    this.optionsShown = false;
                    const selContainer = this.selectionContainer.querySelector('.selection');
                    selContainer.innerHTML = '';
                    selContainer.appendChild(element.cloneNode(true));
                    if (this.selectCallback)
                        this.selectCallback(this.value);
                }
            });
        });
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: `input-wrap ${this.value ? 'not-empty' : 'empty'} ${this.optionsShown ? 'focused' : ''}`, ref: (el) => (this.inputWrapElement = el) },
            this.showLabel && h("label", { class: "input-label" }, this.label),
            h("div", { ref: (el) => (this.selectionContainer = el), class: "selection-container", onClick: this.onContainerClick.bind(this) },
                h("div", { class: "selection" }),
                h("zea-icon", { name: this.optionsShown ? 'chevron-up-outline' : 'chevron-down-outline', size: 13 })),
            h("div", { ref: (el) => (this.optionsContainer = el), class: { 'options-container': true, shown: this.optionsShown } },
                h("zea-scroll-pane", null,
                    h("slot", null))),
            h("div", { class: "underliner" },
                h("div", { class: "expander" })),
            !this.isValid && this.invalidMessageShown && (h("div", { class: "invalid-message" }, this.invalidMessage))));
    }
    static get is() { return "zea-input-select"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-input-select.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-input-select.css"]
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
        "optionsShown": {
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
            "attribute": "options-shown",
            "reflect": false,
            "defaultValue": "false"
        },
        "selectCallback": {
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
            "attribute": "select-callback",
            "reflect": false
        }
    }; }
    static get listeners() { return [{
            "name": "click",
            "method": "handleClick",
            "target": "document",
            "capture": true,
            "passive": false
        }]; }
}
