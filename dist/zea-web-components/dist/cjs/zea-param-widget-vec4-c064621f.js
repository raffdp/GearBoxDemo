'use strict';

const index = require('./index-81865576.js');
const zeaUx_esm = require('./zea-ux.esm-aa49a158.js');
const UxFactory = require('./UxFactory-16a95afe.js');

const zeaParamWidgetVec4Css = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-vec4{color:var(--color-foreground-1);background-color:var(--color-background-2);max-width:400px}.zea-param-widget-vec4 input{width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;margin-bottom:0.5em;color:var(--color-foreground-1);background-color:var(--color-background-3)}.zea-param-widget-vec4 input:last-child{margin-bottom:0}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}.vector-input-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;margin-bottom:0.5em}.vector-input-wrap label{font-size:0.7em;padding:0.3em 1em 0.3em 0.3em;opacity:0.5}input[type='number']{padding:0.3em;font-size:0.9em;border:1px solid var(--color-grey-3);text-align:right}";

const ZeaParamWidgetVec4 = class {
    /**
     * Class constructor
     */
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
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
            if (mode == zeaUx_esm.E.REMOTEUSER_SETVALUE) {
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
        const value = new zeaUx_esm.G(this.xField.valueAsNumber, this.yField.valueAsNumber, this.zField.valueAsNumber, this.tField.valueAsNumber);
        if (!this.change) {
            this.change = new zeaUx_esm.de(this.parameter, value);
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
        return (index.h("div", { class: "zea-param-widget-vec4", ref: (el) => (this.container = el) }, index.h("div", { class: "vector-input-wrap" }, index.h("label", null, "X"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.xField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.xValue })), index.h("div", { class: "vector-input-wrap" }, index.h("label", null, "Y"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.yField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.yValue })), index.h("div", { class: "vector-input-wrap" }, index.h("label", null, "Z"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.zField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.zValue })), index.h("div", { class: "vector-input-wrap" }, index.h("label", null, "T"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.tField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.tValue }))));
    }
    static get watchers() { return {
        "parameter": ["parameterChangeHandler"]
    }; }
};
UxFactory.uxFactory.registerWidget('zea-param-widget-vec4', (p) => p.constructor.name == zeaUx_esm.Re.name);
ZeaParamWidgetVec4.style = zeaParamWidgetVec4Css;

exports.ZeaParamWidgetVec4 = ZeaParamWidgetVec4;
