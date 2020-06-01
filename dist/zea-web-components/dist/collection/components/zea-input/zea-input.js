import { Component, h, Prop, Listen } from '@stencil/core';
/**
 */
export class ZeaInput {
    constructor() {
        /**
         */
        this.name = 'zea-input';
        /**
         */
        this.type = 'text';
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
        this.showLabel = false;
        /**
         */
        this.photoBase64 = '';
        /**
         */
        this.colorPopupShown = false;
        /**
         */
        this.colorPopupAlign = 'bottom-right';
        /**
         */
        this.colorOptions = [
            '#F34235',
            '#E81D62',
            '#292929',
            '#9B26AF',
            '#6639B6',
            '#3E50B4',
            '#2095F2',
            '#02A8F3',
            '#00BBD3',
            '#009587',
            '#4BAE4F',
            '#8AC249',
            '#CCDB38',
            '#FEEA3A',
            '#FEC006',
            '#FE9700',
            '#FE5621',
            '#785447',
            '#9D9D9D',
            '#5F7C8A',
        ];
    }
    /**
     * Listen to click events on the whole document
     * @param {any} e The event
     */
    handleClick(e) {
        if (!e.composedPath().includes(this.colorPopup) &&
            !e.composedPath().includes(this.selectedColorContainer)) {
            this.colorPopupShown = false;
        }
    }
    /**
     */
    checkValue() {
        if (!this.inputElement)
            return;
        if (this.type == 'photo') {
            this.value = this.photoBase64;
        }
        else if (this.type == 'color') {
            this.value = this.selectedColor;
        }
        else {
            this.value = this.inputElement.value;
            this.value.replace(/(^\s+|\s+$)/, ''); // trim
        }
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
    onColorClick(e) {
        this.selectColor(e.currentTarget.dataset.color);
    }
    /**
     */
    selectColor(color) {
        const colorElement = this.inputWrapElement.querySelector(`.color-option[data-color="${color}"]`);
        if (!colorElement)
            return;
        this.selectedColor = colorElement.dataset.color;
        if (this.currentColorElement)
            this.currentColorElement.classList.remove('active');
        colorElement.classList.add('active');
        this.currentColorElement = colorElement;
        this.value = this.selectedColor;
    }
    /**
     */
    onPhotoChange(e) {
        const file = e.currentTarget.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            this.photoBase64 = `${reader.result}`;
            this.value = this.photoBase64;
            this.checkValue();
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    /**
     */
    componentDidRender() {
        // this.checkValue()
    }
    /**
     */
    componentWillLoad() {
        if (this.type == 'color' && !this.selectedColor && !this.value) {
            this.selectedColor = this.colorOptions[Math.floor(Math.random() * this.colorOptions.length)];
            this.value = this.selectedColor;
        }
        else if (this.type == 'color' && this.value) {
            this.selectedColor = this.value;
        }
        if (this.type == 'photo' && this.value) {
            this.photoBase64 = this.value; // TODO: check it's actually base64
        }
    }
    /**
     */
    componentDidLoad() {
        this.selectColor(this.selectedColor);
    }
    /**
     */
    render() {
        const inputTypes = {
            text: [
                this.showLabel && h("label", { class: "input-label" }, this.label),
                h("input", { ref: (el) => (this.inputElement = el), placeholder: this.showLabel ? '' : this.label, type: "text", value: this.value, onKeyDown: this.onKeyDown.bind(this), onKeyUp: this.onKeyUp.bind(this), class: {
                        invalid: (this.autoValidate || this.invalidMessageShown) && !this.isValid,
                    } }),
            ],
            photo: (h("div", { class: "photo-input" },
                h("div", { class: "photo-thumb", onClick: () => {
                        this.inputElement.dispatchEvent(new MouseEvent('click'));
                    } },
                    h("zea-icon", { name: "camera-outline", size: 30 }),
                    h("div", { id: "photo-preview", style: { backgroundImage: `url(${this.value})` } })),
                h("div", { class: "photo-copy" },
                    h("label", { class: "input-label" }, this.label),
                    "Your photo lets people recognize you while working together."),
                h("input", { ref: (el) => (this.inputElement = el), type: "file", onChange: this.onPhotoChange.bind(this), class: {
                        invalid: (this.autoValidate || this.invalidMessageShown) &&
                            !this.isValid,
                    } }))),
            color: (h("div", { class: "color-input" },
                h("div", { class: "color-thumb" },
                    h("div", { ref: (el) => (this.selectedColorContainer = el), class: "choosen-color", style: { backgroundColor: this.selectedColor }, onClick: () => {
                            this.colorPopupShown = !this.colorPopupShown;
                        } }),
                    h("div", { ref: (el) => (this.colorPopup = el), class: `color-popup ${this.colorPopupShown ? 'shown' : ''} ${this.colorPopupAlign}` }, this.colorOptions.map((colorOption) => (h("div", { class: "color-option", "data-color": colorOption, onMouseDown: this.onColorClick.bind(this), onMouseUp: () => {
                            this.colorPopupShown = false;
                        } },
                        h("div", { class: "color-sample", style: { backgroundColor: colorOption } })))))),
                this.showLabel && (h("div", { class: "color-copy" },
                    h("label", { class: "input-label" }, this.label),
                    "Your color helps you stand out from other people.")))),
        };
        return (h("div", { class: "input-wrap", ref: (el) => (this.inputWrapElement = el) },
            inputTypes[this.type],
            !this.isValid && this.invalidMessageShown && (h("div", { class: "invalid-message" }, this.invalidMessage))));
    }
    static get is() { return "zea-input"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-input.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-input.css"]
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
        "type": {
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
            "attribute": "type",
            "reflect": false,
            "defaultValue": "'text'"
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
            "defaultValue": "false"
        },
        "photoBase64": {
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
            "attribute": "photo-base-6-4",
            "reflect": false,
            "defaultValue": "''"
        },
        "colorPopupShown": {
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
            "attribute": "color-popup-shown",
            "reflect": false,
            "defaultValue": "false"
        },
        "colorPopupAlign": {
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
            "attribute": "color-popup-align",
            "reflect": false,
            "defaultValue": "'bottom-right'"
        },
        "colorOptions": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "string[]",
                "resolved": "string[]",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "defaultValue": "[\n    '#F34235',\n    '#E81D62',\n    '#292929',\n    '#9B26AF',\n    '#6639B6',\n    '#3E50B4',\n    '#2095F2',\n    '#02A8F3',\n    '#00BBD3',\n    '#009587',\n    '#4BAE4F',\n    '#8AC249',\n    '#CCDB38',\n    '#FEEA3A',\n    '#FEC006',\n    '#FE9700',\n    '#FE5621',\n    '#785447',\n    '#9D9D9D',\n    '#5F7C8A',\n  ]"
        },
        "selectedColor": {
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
            "attribute": "selected-color",
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
