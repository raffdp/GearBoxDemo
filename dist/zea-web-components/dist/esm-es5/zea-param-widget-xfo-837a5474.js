import { r as registerInstance, h } from './index-12ee0265.js';
import { E, S, N, d as Se } from './index.esm-f69112c9.js';
import { u as uxFactory } from './UxFactory-caff4fc5.js';
var zeaParamWidgetXfoCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-xfo{color:var(--color-foreground-1);background-color:var(--color-background-2);max-width:400px}.zea-param-widget-xfo input{width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;color:var(--color-foreground-1);background-color:var(--color-background-3)}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}.input-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;margin-bottom:0.5em}.input-wrap label{font-size:0.7em;padding:0.3em 1em 0.3em 0.3em;opacity:0.5;width:1.5em;text-align:center}input[type='number']{padding:0.3em;font-size:0.9em;border:1px solid var(--color-grey-3);text-align:right}fieldset{border:1px solid var(--color-grey-3)}legend{color:var(--color-foreground-2);font-size:0.8em}";
var ZeaParamWidgetXfo = /** @class */ (function () {
    /**
     * Class constructor
     */
    function ZeaParamWidgetXfo(hostRef) {
        registerInstance(this, hostRef);
        this.settingValue = false;
        this.onInput = this.onInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    /**
     * Run when component loads
     */
    ZeaParamWidgetXfo.prototype.componentDidLoad = function () {
        if (this.parameter) {
            this.setUpInputs();
            this.updateDisplayedValue(E.USER_SETVALUE);
        }
    };
    /**
     * Value change handler
     * @param {object} event The event object with details about the change.
     */
    ZeaParamWidgetXfo.prototype.updateDisplayedValue = function (mode) {
        var _this = this;
        if (!this.settingValue) {
            var xfo = this.parameter.getValue();
            this.trxField.value = "" + this.round(xfo.tr.x);
            this.tryField.value = "" + this.round(xfo.tr.y);
            this.trzField.value = "" + this.round(xfo.tr.z);
            this.orxField.value = "" + this.round(xfo.ori.x);
            this.oryField.value = "" + this.round(xfo.ori.y);
            this.orzField.value = "" + this.round(xfo.ori.z);
            this.orwField.value = "" + this.round(xfo.ori.w);
            this.scxField.value = "" + this.round(xfo.sc.x);
            this.scyField.value = "" + this.round(xfo.sc.y);
            this.sczField.value = "" + this.round(xfo.sc.z);
            if (mode == E.REMOTEUSER_SETVALUE) {
                this.widgetContainer.classList.add('user-edited');
                if (this.remoteUserEditedHighlightId)
                    clearTimeout(this.remoteUserEditedHighlightId);
                this.remoteUserEditedHighlightId = setTimeout(function () {
                    _this.widgetContainer.classList.remove('user-edited');
                    _this.remoteUserEditedHighlightId = null;
                }, 1500);
            }
        }
    };
    /**
     * Set the inputs up
     */
    ZeaParamWidgetXfo.prototype.setUpInputs = function () {
        var _this = this;
        this.parameter.on('valueChanged', function (event) {
            _this.updateDisplayedValue(event.mode);
        });
    };
    /**
     * Input handler
     */
    ZeaParamWidgetXfo.prototype.onInput = function () {
        this.settingValue = true;
        var xfo = new S();
        xfo.tr.set(this.trxField.valueAsNumber, this.tryField.valueAsNumber, this.trzField.valueAsNumber);
        xfo.ori.set(this.orxField.valueAsNumber, this.oryField.valueAsNumber, this.orzField.valueAsNumber, this.orwField.valueAsNumber); /* value order is xyzw*/
        xfo.ori.normalizeInPlace();
        xfo.sc.set(this.scxField.valueAsNumber, this.scyField.valueAsNumber, this.sczField.valueAsNumber);
        if (!this.change) {
            this.change = new N(this.parameter, xfo);
            this.appData.undoRedoManager.addChange(this.change);
        }
        else {
            this.change.update({ value: xfo });
        }
    };
    /**
     * Change handler
     */
    ZeaParamWidgetXfo.prototype.onChange = function () {
        this.onInput();
        this.settingValue = false;
        this.change = undefined;
    };
    /**
     * Round number
     * @param {number} value the value to be rounded
     * @param {number} decimals decimal places to keep
     * @return {number} the rouunded value
     */
    ZeaParamWidgetXfo.prototype.round = function (value, decimals) {
        if (decimals === void 0) { decimals = 6; }
        if (Math.abs(value) < Number('1e-6'))
            return 0;
        return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
    };
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    ZeaParamWidgetXfo.prototype.render = function () {
        var _this = this;
        return (h("div", { class: "zea-param-widget-xfo", ref: function (el) { return (_this.widgetContainer = el); } }, h("fieldset", null, h("legend", null, "Translation"), h("div", { class: "input-wrap" }, h("label", null, "X"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.trxField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), h("div", { class: "input-wrap" }, h("label", null, "Y"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.tryField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), h("div", { class: "input-wrap" }, h("label", null, "Z"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.trzField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" }))), h("fieldset", null, h("legend", null, "Rotation"), h("div", { class: "input-wrap" }, h("label", null, "X"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.orxField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), h("div", { class: "input-wrap" }, h("label", null, "Y"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.oryField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), h("div", { class: "input-wrap" }, h("label", null, "Z"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.orzField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), h("div", { class: "input-wrap" }, h("label", null, "W"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.orwField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" }))), h("fieldset", null, h("legend", null, "Scale"), h("div", { class: "input-wrap" }, h("label", null, "X"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.scxField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), h("div", { class: "input-wrap" }, h("label", null, "Y"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.scyField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), h("div", { class: "input-wrap" }, h("label", null, "Z"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.sczField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })))));
    };
    return ZeaParamWidgetXfo;
}());
uxFactory.registerWidget('zea-param-widget-xfo', function (p) { return p.constructor.name == Se.name; });
ZeaParamWidgetXfo.style = zeaParamWidgetXfoCss;
export { ZeaParamWidgetXfo as Z };
