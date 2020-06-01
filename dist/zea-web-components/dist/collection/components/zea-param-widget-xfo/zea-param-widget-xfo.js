import { Component, h, Prop } from '@stencil/core';
import uxFactory from '../../assets/UxFactory.js';
import { ValueSetMode, XfoParameter, Xfo } from '@zeainc/zea-engine';
import { ParameterValueChange } from '@zeainc/zea-ux';
/**
 * Main class for the component
 */
export class ZeaParamWidgetXfo {
    /**
     * Class constructor
     */
    constructor() {
        this.settingValue = false;
        this.onInput = this.onInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    /**
     * Run when component loads
     */
    componentDidLoad() {
        this.setUpInputs();
        this.updateDisplayedValue(ValueSetMode.USER_SETVALUE);
    }
    /**
     * Value change handler
     * @param {any} mode The value set mode
     */
    updateDisplayedValue(mode) {
        if (!this.settingValue) {
            const xfo = this.parameter.getValue();
            this.trxField.value = `${this.round(xfo.tr.x)}`;
            this.tryField.value = `${this.round(xfo.tr.y)}`;
            this.trzField.value = `${this.round(xfo.tr.z)}`;
            this.orxField.value = `${this.round(xfo.ori.x)}`;
            this.oryField.value = `${this.round(xfo.ori.y)}`;
            this.orzField.value = `${this.round(xfo.ori.z)}`;
            this.orwField.value = `${this.round(xfo.ori.w)}`;
            this.scxField.value = `${this.round(xfo.sc.x)}`;
            this.scyField.value = `${this.round(xfo.sc.y)}`;
            this.sczField.value = `${this.round(xfo.sc.z)}`;
            if (mode == ValueSetMode.REMOTEUSER_SETVALUE) {
                this.widgetContainer.classList.add('user-edited');
                if (this.remoteUserEditedHighlightId)
                    clearTimeout(this.remoteUserEditedHighlightId);
                this.remoteUserEditedHighlightId = setTimeout(() => {
                    this.widgetContainer.classList.remove('user-edited');
                    this.remoteUserEditedHighlightId = null;
                }, 1500);
            }
        }
    }
    /**
     * Set the inputs up
     */
    setUpInputs() {
        this.parameter.valueChanged.connect((mode) => {
            this.updateDisplayedValue(mode);
        });
    }
    /**
     * Input handler
     */
    onInput() {
        this.settingValue = true;
        const xfo = new Xfo();
        xfo.tr.set(this.trxField.valueAsNumber, this.tryField.valueAsNumber, this.trzField.valueAsNumber);
        xfo.ori.set(this.orxField.valueAsNumber, this.oryField.valueAsNumber, this.orzField.valueAsNumber, this.orwField.valueAsNumber); /* value order is xyzw*/
        xfo.ori.normalizeInPlace();
        xfo.sc.set(this.scxField.valueAsNumber, this.scyField.valueAsNumber, this.sczField.valueAsNumber);
        if (!this.change) {
            this.change = new ParameterValueChange(this.parameter, xfo);
            this.appData.undoRedoManager.addChange(this.change);
        }
        else {
            this.change.update({ value: xfo });
        }
    }
    /**
     * Change handler
     */
    onChange() {
        this.onInput();
        this.settingValue = false;
        this.change = undefined;
    }
    /**
     * Round number
     * @param {number} value the value to be rounded
     * @param {number} decimals decimal places to keep
     * @return {number} the rouunded value
     */
    round(value, decimals = 6) {
        if (Math.abs(value) < Number('1e-6'))
            return 0;
        return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
    }
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-param-widget-xfo", ref: (el) => (this.widgetContainer = el) },
            h("fieldset", null,
                h("legend", null, "Translation"),
                h("div", { class: "input-wrap" },
                    h("label", null, "X"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.trxField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })),
                h("div", { class: "input-wrap" },
                    h("label", null, "Y"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.tryField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })),
                h("div", { class: "input-wrap" },
                    h("label", null, "Z"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.trzField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" }))),
            h("fieldset", null,
                h("legend", null, "Rotation"),
                h("div", { class: "input-wrap" },
                    h("label", null, "X"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.orxField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })),
                h("div", { class: "input-wrap" },
                    h("label", null, "Y"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.oryField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })),
                h("div", { class: "input-wrap" },
                    h("label", null, "Z"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.orzField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })),
                h("div", { class: "input-wrap" },
                    h("label", null, "W"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.orwField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" }))),
            h("fieldset", null,
                h("legend", null, "Scale"),
                h("div", { class: "input-wrap" },
                    h("label", null, "X"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.scxField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })),
                h("div", { class: "input-wrap" },
                    h("label", null, "Y"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.scyField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })),
                h("div", { class: "input-wrap" },
                    h("label", null, "Z"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.sczField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })))));
    }
    static get is() { return "zea-param-widget-xfo"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-param-widget-xfo.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-param-widget-xfo.css"]
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
}
uxFactory.registerWidget('zea-param-widget-xfo', (p) => p.constructor.name == XfoParameter.name);
