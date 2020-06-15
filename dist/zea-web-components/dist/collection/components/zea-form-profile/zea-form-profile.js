import { Component, h, Prop, Event } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaProfileForm {
    constructor() {
        /**
         * A test prop.
         */
        this.welcomeHtml = `Welcome to Zea Construction. We just need <br />a few details and
  then you're ready to go.`;
        /**
         * A test prop.
         */
        this.submitButtonText = 'SAVE';
        /**
         */
        this.showLabels = true;
        /**
         */
        this.userData = {};
    }
    /**
     */
    submitCallback(formValues) {
        if (this.formElement.isValid) {
            this.userRegistered.emit(formValues);
        }
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-form-profile" },
            h("zea-form", { ref: (el) => (this.formElement = el), id: "quick-access-form", submitCallback: this.submitCallback.bind(this), "submit-text": this.submitButtonText, validate: true },
                this.welcomeHtml && h("div", { innerHTML: this.welcomeHtml }),
                h("zea-input-text", { id: "quick-access-name", label: "First Name (required)", name: "firstName", showLabel: true, required: true, value: this.userData.firstName || '' }),
                h("zea-input-text", { id: "quick-access-lastname", label: "Last Name", showLabel: this.showLabels, name: "lastName", value: this.userData.lastName || '' }),
                h("zea-input-text", { id: "quick-access-email", label: "Email", showLabel: this.showLabels, name: "email", value: this.userData.email || '' }),
                h("zea-input-text", { id: "quick-access-phone", label: "Phone", showLabel: this.showLabels, name: "phone", value: this.userData.phone || '' }),
                h("zea-input-text", { id: "quick-access-company", label: "Company", showLabel: this.showLabels, name: "company", value: this.userData.company || '' }),
                h("zea-input", { id: "quick-access-photo", type: "photo", label: "Photo", showLabel: this.showLabels, name: "avatar", value: this.userData.avatar || '' }),
                h("zea-input", { id: "quick-access-color", type: "color", label: "Color", showLabel: this.showLabels, name: "color", value: this.userData.color || '' }))));
    }
    static get is() { return "zea-form-profile"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-form-profile.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-form-profile.css"]
    }; }
    static get properties() { return {
        "welcomeHtml": {
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
                "text": "A test prop."
            },
            "attribute": "welcome-html",
            "reflect": false,
            "defaultValue": "`Welcome to Zea Construction. We just need <br />a few details and\r\n  then you're ready to go.`"
        },
        "submitButtonText": {
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
                "text": "A test prop."
            },
            "attribute": "submit-button-text",
            "reflect": false,
            "defaultValue": "'SAVE'"
        },
        "showLabels": {
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
            "attribute": "show-labels",
            "reflect": false,
            "defaultValue": "true"
        },
        "userData": {
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
            "attribute": "user-data",
            "reflect": false,
            "defaultValue": "{}"
        }
    }; }
    static get events() { return [{
            "method": "userRegistered",
            "name": "userRegistered",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": ""
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }]; }
}
