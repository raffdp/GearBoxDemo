import { Component, h, Prop, State, Watch } from '@stencil/core';
import uxFactory from '../../assets/UxFactory.js';
import { ValueSetMode, Vec4Parameter, Vec4 } from '@zeainc/zea-engine';
import { ParameterValueChange } from '@zeainc/zea-ux';
/**
 * Main class for the component
 */
export class ZeaParamWidgetVec4 {
    /**
     * Class constructor
     */
    constructor() {
        this.onInput = this.onInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    /**
     * Reinit input when paramater changes
     */
    parameterChangeHandler() {
        this.setUpInputs();
    }
    /**
     * Run when component loads
     */
    componentDidLoad() {
        this.setUpInputs();
        this.onValueChanged(0);
    }
    /**
     * Set the inputs up
     */
    setUpInputs() {
        this.parameter.valueChanged.connect((mode) => {
            this.onValueChanged(mode);
        });
    }
    /**
     * Value change handler
     * @param {any} mode The value set mode
     */
    onValueChanged(mode) {
        if (!this.change) {
            const vec4 = this.parameter.getValue();
            this.xField.value = `${this.round(vec4.x)}`;
            this.yField.value = `${this.round(vec4.y)}`;
            this.zField.value = `${this.round(vec4.z)}`;
            this.tField.value = `${this.round(vec4.t)}`;
            if (mode == ValueSetMode.REMOTEUSER_SETVALUE) {
                this.container.classList.add('user-edited');
                if (this.remoteUserEditedHighlightId)
                    clearTimeout(this.remoteUserEditedHighlightId);
                this.remoteUserEditedHighlightId = setTimeout(() => {
                    this.container.classList.remove('user-edited');
                    this.remoteUserEditedHighlightId = null;
                }, 1500);
            }
        }
    }
    /**
     * Input handler
     */
    onInput() {
        const value = new Vec4(this.xField.valueAsNumber, this.yField.valueAsNumber, this.zField.valueAsNumber, this.tField.valueAsNumber);
        if (!this.change) {
            this.change = new ParameterValueChange(this.parameter, value);
            this.appData.undoRedoManager.addChange(this.change);
        }
        else {
            this.change.update({ value });
        }
    }
    /**
     * Change handler
     */
    onChange() {
        this.onInput();
        this.change = undefined;
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
     * Render method.
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-param-widget-vec4", ref: (el) => (this.container = el) },
            h("div", { class: "vector-input-wrap" },
                h("label", null, "X"),
                h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.xField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.xValue })),
            h("div", { class: "vector-input-wrap" },
                h("label", null, "Y"),
                h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.yField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.yValue })),
            h("div", { class: "vector-input-wrap" },
                h("label", null, "Z"),
                h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.zField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.zValue })),
            h("div", { class: "vector-input-wrap" },
                h("label", null, "T"),
                h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.tField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.tValue }))));
    }
    static get is() { return "zea-param-widget-vec4"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-param-widget-vec4.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-param-widget-vec4.css"]
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
        }
    }; }
    static get states() { return {
        "xValue": {},
        "yValue": {},
        "zValue": {},
        "tValue": {}
    }; }
    static get watchers() { return [{
            "propName": "parameter",
            "methodName": "parameterChangeHandler"
        }]; }
}
uxFactory.registerWidget('zea-param-widget-vec4', (p) => p.constructor.name == Vec4Parameter.name);
