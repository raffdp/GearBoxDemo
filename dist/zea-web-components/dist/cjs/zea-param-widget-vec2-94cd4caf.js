'use strict';

const index = require('./index-81865576.js');
const zeaUx_esm = require('./zea-ux.esm-aa49a158.js');
const UxFactory = require('./UxFactory-16a95afe.js');

const zeaParamWidgetVec2Css = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-vec2{color:var(--color-foreground-1);background-color:var(--color-background-2);max-width:400px}.zea-param-widget-vec2 input{width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;color:var(--color-foreground-1);background-color:var(--color-background-3)}.zea-param-widget-vec2 input:first-child{margin-bottom:0.5em}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}.vector-input-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;margin-bottom:0.5em}.vector-input-wrap label{font-size:0.7em;padding:0.3em 1em 0.3em 0.3em;opacity:0.5}input[type='number']{padding:0.3em;font-size:0.9em;border:1px solid var(--color-grey-3);text-align:right}";

const ZeaParamWidgetVec2 = class {
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
            const vec2 = this.parameter.getValue();
            this.xField.value = `${this.round(vec2.x)}`;
            this.yField.value = `${this.round(vec2.y)}`;
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
        const value = new zeaUx_esm._(this.xField.valueAsNumber, this.yField.valueAsNumber);
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
        return (index.h("div", { class: "zea-param-widget-vec2", ref: (el) => (this.container = el) }, index.h("div", { class: "vector-input-wrap" }, index.h("label", null, "X"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.xField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.xValue })), index.h("div", { class: "vector-input-wrap" }, index.h("label", null, "Y"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.yField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.yValue }))));
    }
    static get watchers() { return {
        "parameter": ["parameterChangeHandler"]
    }; }
};
UxFactory.uxFactory.registerWidget('zea-param-widget-vec2', (p) => p.constructor.name == zeaUx_esm.Ve.name);
ZeaParamWidgetVec2.style = zeaParamWidgetVec2Css;

exports.ZeaParamWidgetVec2 = ZeaParamWidgetVec2;
