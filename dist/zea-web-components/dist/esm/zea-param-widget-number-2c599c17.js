import { r as registerInstance, h } from './index-12ee0265.js';
import { E, N, Z as Ze } from './index.esm-f69112c9.js';
import { u as uxFactory } from './UxFactory-caff4fc5.js';

const zeaParamWidgetNumberCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-number{color:var(--color-foreground-1);background-color:var(--color-background-2);max-width:400px}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}.zea-param-widget-number input{width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;color:var(--color-foreground-1);background-color:var(--color-background-3)}input[type='number']{padding:0.3em;font-size:0.9em;border:1px solid var(--color-grey-3);text-align:right}";

const ZeaParamWidgetNumber = class {
    /**
     * Class constructor
     */
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
            if (event.mode == E.REMOTEUSER_SETVALUE) {
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
            const change = new N(this.parameter, value);
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
            return (h("div", { class: "zea-param-widget-number" }, h("input", { onChange: this.inputChanged, ref: (el) => (this.inputField = el), class: "mdl-slider mdl-js-slider", type: "range", min: "0", max: "200", step: this.step ? this.step : 1, id: this.parameter.getName(), value: this.value, tabindex: "0" })));
        }
        return (h("div", { class: "zea-param-widget-number" }, h("input", { onChange: this.inputChanged, ref: (el) => (this.inputField = el), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", id: this.parameter.getName(), value: this.value, tabindex: "0" })));
    }
    static get watchers() { return {
        "parameter": ["parameterChangeHandler"]
    }; }
};
uxFactory.registerWidget('zea-param-widget-number', (p) => p.constructor.name == Ze.name);
ZeaParamWidgetNumber.style = zeaParamWidgetNumberCss;

export { ZeaParamWidgetNumber as Z };
