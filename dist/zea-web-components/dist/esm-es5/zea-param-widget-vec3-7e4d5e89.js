import { r as registerInstance, h } from './index-12ee0265.js';
import { E, c as Z, N, f as fe } from './index.esm-f69112c9.js';
import { u as uxFactory } from './UxFactory-caff4fc5.js';
var zeaParamWidgetVec3Css = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-vec3{color:var(--color-foreground-1);background-color:var(--color-background-2);max-width:400px}.zea-param-widget-vec3 input{width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;margin-bottom:0.5em;color:var(--color-foreground-1);background-color:var(--color-background-3)}.zea-param-widget-vec3 input:last-child{margin-bottom:0}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}.vector-input-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;margin-bottom:0.5em}.vector-input-wrap label{font-size:0.7em;padding:0.3em 1em 0.3em 0.3em;opacity:0.5}input[type='number']{padding:0.3em;font-size:0.9em;border:1px solid var(--color-grey-3);text-align:right}";
var ZeaParamWidgetVec3 = /** @class */ (function () {
    /**
     * Class constructor
     */
    function ZeaParamWidgetVec3(hostRef) {
        registerInstance(this, hostRef);
        this.onInput = this.onInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    /**
     * Reinit input when paramater changes
     */
    ZeaParamWidgetVec3.prototype.parameterChangeHandler = function () {
        this.setUpInputs();
    };
    /**
     * Run when component loads
     */
    ZeaParamWidgetVec3.prototype.componentDidLoad = function () {
        if (this.parameter) {
            this.setUpInputs();
            this.onValueChanged(0);
        }
    };
    /**
     * Set the inputs up
     */
    ZeaParamWidgetVec3.prototype.setUpInputs = function () {
        var _this = this;
        this.parameter.on('valueChanged', function (event) {
            _this.onValueChanged(event.mode);
        });
    };
    /**
     * Value change handler
     * @param {object} event The event object with details about the change.
     */
    ZeaParamWidgetVec3.prototype.onValueChanged = function (mode) {
        var _this = this;
        if (!this.change) {
            var vec3 = this.parameter.getValue();
            this.xField.value = "" + this.round(vec3.x);
            this.yField.value = "" + this.round(vec3.y);
            this.zField.value = "" + this.round(vec3.z);
            if (mode == E.REMOTEUSER_SETVALUE) {
                this.container.classList.add('user-edited');
                if (this.remoteUserEditedHighlightId)
                    clearTimeout(this.remoteUserEditedHighlightId);
                this.remoteUserEditedHighlightId = setTimeout(function () {
                    _this.container.classList.remove('user-edited');
                    _this.remoteUserEditedHighlightId = null;
                }, 1500);
            }
        }
    };
    /**
     * Input handler
     */
    ZeaParamWidgetVec3.prototype.onInput = function () {
        var value = new Z(this.xField.valueAsNumber, this.yField.valueAsNumber, this.zField.valueAsNumber);
        if (!this.change) {
            this.change = new N(this.parameter, value);
            this.appData.undoRedoManager.addChange(this.change);
        }
        else {
            this.change.update({ value: value });
        }
    };
    /**
     * Change handler
     */
    ZeaParamWidgetVec3.prototype.onChange = function () {
        this.onInput();
        this.change = undefined;
    };
    /**
     * Round number
     * @param {number} value Number to be rounded
     * @param {number} decimals Number of decimal places
     * @return {number} Rounded number
     */
    ZeaParamWidgetVec3.prototype.round = function (value, decimals) {
        if (decimals === void 0) { decimals = 6; }
        return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
    };
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    ZeaParamWidgetVec3.prototype.render = function () {
        var _this = this;
        return (h("div", { class: "zea-param-widget-vec3", ref: function (el) { return (_this.container = el); } }, h("div", { class: "vector-input-wrap" }, h("label", null, "X"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.xField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.xValue })), h("div", { class: "vector-input-wrap" }, h("label", null, "Y"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.yField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.yValue })), h("div", { class: "vector-input-wrap" }, h("label", null, "Z"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.zField = el); }, id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0", value: this.zValue }))));
    };
    Object.defineProperty(ZeaParamWidgetVec3, "watchers", {
        get: function () {
            return {
                "parameter": ["parameterChangeHandler"]
            };
        },
        enumerable: true,
        configurable: true
    });
    return ZeaParamWidgetVec3;
}());
uxFactory.registerWidget('zea-param-widget-vec3', function (p) { return p.constructor.name == fe.name; });
ZeaParamWidgetVec3.style = zeaParamWidgetVec3Css;
export { ZeaParamWidgetVec3 as Z };
