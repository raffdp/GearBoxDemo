import { Component, h, Prop, State, Watch } from '@stencil/core';
import uxFactory from '../../assets/UxFactory.js';
import { ValueSetMode, NumberParameter } from '@zeainc/zea-engine';
import { ParameterValueChange } from '@zeainc/zea-ux';
/**
 * Main class for the component
 */
export class ZeaParamWidgetNumber {
    /**
     * Class constructor
     */
    constructor() {
        this.inputChanged = this.inputChanged.bind(this);
    }
    /**
     * Reinit input when paramater changes
     */
    parameterChangeHandler() {
        this.setUpInput();
    }
    /**
     * Run when component loads
     */
    componentDidLoad() {
        if (this.parameter) {
            this.setUpInput();
        }
    }
    /**
     * Set up the input
     */
    setUpInput() {
        this.range = this.parameter.getRange();
        this.step = this.parameter.getStep();
        this.setInputValue();
        this.parameter.on('valueChanged', (event) => {
            console.log('value changed');
            this.setInputValue();
            if (event.mode == ValueSetMode.REMOTEUSER_SETVALUE) {
                this.inputField.classList.add('user-edited');
                if (this.remoteUserEditedHighlightId)
                    clearTimeout(this.remoteUserEditedHighlightId);
                this.remoteUserEditedHighlightId = setTimeout(() => {
                    this.inputField.classList.remove('user-edited');
                    this.remoteUserEditedHighlightId = null;
                }, 1500);
            }
        });
    }
    /**
     * Sets the value of the input
     */
    setInputValue() {
        if (this.range) {
            this.value =
                ((this.parameter.getValue() - this.range[0]) /
                    (this.range[1] - this.range[0])) *
                    200;
        }
        else {
            this.value = this.parameter.getValue();
        }
    }
    /**
     * Run when input changes
     */
    inputChanged() {
        let value = this.round(this.inputField.valueAsNumber);
        if (this.range) {
            // Renmap from the 0..200 integer to the floating point
            // range specified in the parameter.
            value = this.range[0] + (value / 200) * (this.range[1] - this.range[0]);
            value = this.clamp(value, this.range[0], this.range[1]);
        }
        if (this.appData.undoRedoManager) {
            const change = new ParameterValueChange(this.parameter, value);
            this.appData.undoRedoManager.addChange(change);
        }
        else {
            this.parameter.setValue(value);
        }
    }
    /**
     * Round number
     * @param {number} value Number to be rounded
     * @param {number} decimals Number of decimal places
     * @return {number} Rounded number
     */
    round(value, decimals = 6) {
        return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
    }
    /**
     * Clamp number
     * @param {number} num Number to be rounded
     * @param {number} a Number of decimal places
     * @param {number} b Number of decimal places
     * @return {number} clamped number
     */
    clamp(num, a, b) {
        return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
    }
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render() {
        if (this.range) {
            return (h("div", { class: "zea-param-widget-number" },
                h("input", { onChange: this.inputChanged, ref: (el) => (this.inputField = el), class: "mdl-slider mdl-js-slider", type: "range", min: "0", max: "200", step: this.step ? this.step : 1, id: this.parameter.getName(), value: this.value, tabindex: "0" })));
        }
        return (h("div", { class: "zea-param-widget-number" },
            h("input", { onChange: this.inputChanged, ref: (el) => (this.inputField = el), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", id: this.parameter.getName(), value: this.value, tabindex: "0" })));
    }
    static get is() { return "zea-param-widget-number"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-param-widget-number.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-param-widget-number.css"]
    }; }
    static get properties() { return {
        "parameter": {
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
                "text": "Parameter to be edited"
            },
            "attribute": "parameter",
            "reflect": false
        },
        "inputType": {
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
                "text": "Html input type"
            },
            "attribute": "input-type",
            "reflect": false
        },
        "appData": {
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
                "text": "The application data"
            },
            "attribute": "app-data",
            "reflect": false
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
                "text": "The value of the number"
            },
            "attribute": "value",
            "reflect": false
        }
    }; }
    static get states() { return {
        "range": {},
        "step": {}
    }; }
    static get watchers() { return [{
            "propName": "parameter",
            "methodName": "parameterChangeHandler"
        }]; }
}
uxFactory.registerWidget('zea-param-widget-number', (p) => p.constructor.name == NumberParameter.name);
