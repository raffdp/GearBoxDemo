import { Component, h, Prop } from '@stencil/core';
import uxFactory from '../../assets/UxFactory.js';
import { ValueSetMode, Box3 } from '@zeainc/zea-engine';
import { ParameterValueChange } from '@zeainc/zea-ux';
/**
 * Main class for the component
 */
export class ZeaParamWidgetBbox {
    /**
     * Class constructor
     */
    constructor() {
        this.onInput = this.onInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    /**
     * Run when component loads
     */
    componentDidLoad() {
        if (this.parameter) {
            this.setUpInputs();
            this.onValueChanged(0);
        }
    }
    /**
     * Set the inputs up
     */
    setUpInputs() {
        this.parameter.on('valueChanged', (event) => {
            this.onValueChanged(event.mode);
        });
    }
    /**
     * Value change handler
     * @param {object} event The event object with details about the change.
     */
    onValueChanged(mode) {
        if (!this.change) {
            const bbox = this.parameter.getValue();
            if (bbox.isValid()) {
                this.minxField.value = bbox.p0.x;
                this.minyField.value = bbox.p0.y;
                this.minzField.value = bbox.p0.z;
                this.maxxField.value = bbox.p1.x;
                this.maxyField.value = bbox.p1.y;
                this.maxzField.value = bbox.p1.z;
            }
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
        // eslint-disable-next-line new-cap
        const value = new Box3();
        value.p0.set(this.minxField.valueAsNumber, this.minyField.valueAsNumber, this.minzField.valueAsNumber);
        value.p1.set(this.maxxField.valueAsNumber, this.maxyField.valueAsNumber, this.maxzField.valueAsNumber);
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
     * Render method.
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-param-widget-bbox", ref: (el) => (this.container = el) },
            h("fieldset", null,
                h("legend", null, "Min"),
                h("div", { class: "input-wrap" },
                    h("label", null, "X"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.minxField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })),
                h("div", { class: "input-wrap" },
                    h("label", null, "Y"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.minyField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })),
                h("div", { class: "input-wrap" },
                    h("label", null, "Z"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.minzField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" }))),
            h("fieldset", null,
                h("legend", null, "Max"),
                h("div", { class: "input-wrap" },
                    h("label", null, "X"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.maxxField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })),
                h("div", { class: "input-wrap" },
                    h("label", null, "Y"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.maxyField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })),
                h("div", { class: "input-wrap" },
                    h("label", null, "Z"),
                    h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.maxzField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })))));
    }
    static get is() { return "zea-param-widget-bbox"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-param-widget-bbox.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-param-widget-bbox.css"]
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
uxFactory.registerWidget('zea-param-widget-bbox', (p) => p.getValue().constructor.name == Box3.name);
