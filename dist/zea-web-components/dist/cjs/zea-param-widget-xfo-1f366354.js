'use strict';

const index = require('./index-81865576.js');
const zeaUx_esm = require('./zea-ux.esm-aa49a158.js');
const UxFactory = require('./UxFactory-16a95afe.js');

const zeaParamWidgetXfoCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-xfo{color:var(--color-foreground-1);background-color:var(--color-background-2);max-width:400px}.zea-param-widget-xfo input{width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;color:var(--color-foreground-1);background-color:var(--color-background-3)}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}.input-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;margin-bottom:0.5em}.input-wrap label{font-size:0.7em;padding:0.3em 1em 0.3em 0.3em;opacity:0.5;width:1.5em;text-align:center}input[type='number']{padding:0.3em;font-size:0.9em;border:1px solid var(--color-grey-3);text-align:right}fieldset{border:1px solid var(--color-grey-3)}legend{color:var(--color-foreground-2);font-size:0.8em}";

const ZeaParamWidgetXfo = class {
    /**
     * Class constructor
     */
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.settingValue = false;
        this.onInput = this.onInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    /**
     * Run when component loads
     */
    componentDidLoad() {
        this.setUpInputs();
        this.updateDisplayedValue(zeaUx_esm.E.USER_SETVALUE);
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
            if (mode == zeaUx_esm.E.REMOTEUSER_SETVALUE) {
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
        const xfo = new zeaUx_esm.S();
        xfo.tr.set(this.trxField.valueAsNumber, this.tryField.valueAsNumber, this.trzField.valueAsNumber);
        xfo.ori.set(this.orxField.valueAsNumber, this.oryField.valueAsNumber, this.orzField.valueAsNumber, this.orwField.valueAsNumber); /* value order is xyzw*/
        xfo.ori.normalizeInPlace();
        xfo.sc.set(this.scxField.valueAsNumber, this.scyField.valueAsNumber, this.sczField.valueAsNumber);
        if (!this.change) {
            this.change = new zeaUx_esm.de(this.parameter, xfo);
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
        return (index.h("div", { class: "zea-param-widget-xfo", ref: (el) => (this.widgetContainer = el) }, index.h("fieldset", null, index.h("legend", null, "Translation"), index.h("div", { class: "input-wrap" }, index.h("label", null, "X"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.trxField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), index.h("div", { class: "input-wrap" }, index.h("label", null, "Y"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.tryField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), index.h("div", { class: "input-wrap" }, index.h("label", null, "Z"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.trzField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" }))), index.h("fieldset", null, index.h("legend", null, "Rotation"), index.h("div", { class: "input-wrap" }, index.h("label", null, "X"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.orxField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), index.h("div", { class: "input-wrap" }, index.h("label", null, "Y"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.oryField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), index.h("div", { class: "input-wrap" }, index.h("label", null, "Z"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.orzField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), index.h("div", { class: "input-wrap" }, index.h("label", null, "W"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.orwField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" }))), index.h("fieldset", null, index.h("legend", null, "Scale"), index.h("div", { class: "input-wrap" }, index.h("label", null, "X"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.scxField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), index.h("div", { class: "input-wrap" }, index.h("label", null, "Y"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.scyField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), index.h("div", { class: "input-wrap" }, index.h("label", null, "Z"), index.h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.sczField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })))));
    }
};
UxFactory.uxFactory.registerWidget('zea-param-widget-xfo', (p) => p.constructor.name == zeaUx_esm.Le.name);
ZeaParamWidgetXfo.style = zeaParamWidgetXfoCss;

exports.ZeaParamWidgetXfo = ZeaParamWidgetXfo;
