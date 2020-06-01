import { Component, h, Prop } from '@stencil/core';
/**
 */
export class ZeaForm {
    constructor() {
        /**
         */
        this.submitText = 'SUBMIT';
        /**
         */
        this.validate = true;
        /**
         */
        this.isValid = true;
        /**
         */
        this.formValue = {};
        /**
         */
        this.inputs = [];
    }
    /**
     */
    getFormValue() {
        this.checkValidation();
        this.inputs.forEach((inputElement) => {
            this.formValue[inputElement.name] = inputElement.value;
        });
        return this.formValue;
    }
    /**
     */
    checkValidation() {
        if (!this.validate) {
            return true;
        }
        for (let i = 0; i < this.inputs.length; i++) {
            const inputElement = this.inputs[i];
            if (inputElement.isValid) {
                inputElement.invalidMessageShown = false;
                this.isValid = true;
            }
            else {
                inputElement.invalidMessageShown = true;
                this.isValid = false;
                return false;
            }
        }
        return true;
    }
    /**
     */
    onSubmit() {
        if (this.submitCallback) {
            this.submitCallback(this.getFormValue());
        }
    }
    /**
     */
    componentDidRender() {
        this.setupChildren();
    }
    /**
     * Run some setup for the children items
     */
    setupChildren() {
        this.formContainer
            .querySelector('slot')
            .assignedElements()
            .forEach((element) => {
            if (element.tagName.match(/^ZEA-INPUT/i)) {
                this.inputs.push(element);
            }
        });
    }
    // eslint-disable-next-line require-jsdoc
    render() {
        return (h("div", { class: "zea-form", ref: (el) => (this.formContainer = el) },
            h("slot", null),
            h("zea-button", { onClick: this.onSubmit.bind(this), class: "submit" }, this.submitText)));
    }
    static get is() { return "zea-form"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-form.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-form.css"]
    }; }
    static get properties() { return {
        "submitText": {
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
            "attribute": "submit-text",
            "reflect": false,
            "defaultValue": "'SUBMIT'"
        },
        "validate": {
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
            "attribute": "validate",
            "reflect": false,
            "defaultValue": "true"
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
        "formValue": {
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
            "attribute": "form-value",
            "reflect": false,
            "defaultValue": "{}"
        },
        "submitCallback": {
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
            "attribute": "submit-callback",
            "reflect": false
        }
    }; }
}
