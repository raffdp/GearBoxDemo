import { r as registerInstance, h } from './index-12ee0265.js';
import { E, N, L as Le } from './index.esm-f69112c9.js';
import { u as uxFactory } from './UxFactory-caff4fc5.js';
var zeaParamWidgetStringCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-string{color:var(--color-foreground-1);background-color:var(--color-background-2)}input{width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;padding:0.3em;font-size:0.9em;border:1px solid var(--color-grey-3);color:var(--color-foreground-1);background-color:var(--color-background-3)}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}";
var ZeaParamWidgetString = /** @class */ (function () {
    /**
     * Class constructor
     */
    function ZeaParamWidgetString(hostRef) {
        registerInstance(this, hostRef);
        this.onInput = this.onInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    /**
     * Run when component loads
     */
    ZeaParamWidgetString.prototype.componentDidLoad = function () {
        if (this.parameter) {
            this.setUpInputs();
            this.onValueChanged(E.USER_SETVALUE);
        }
    };
    /**
     * Set the inputs up
     */
    ZeaParamWidgetString.prototype.setUpInputs = function () {
        var _this = this;
        this.parameter.on('valueChanged', function (event) {
            _this.onValueChanged(event.mode);
        });
    };
    /**
     * Value change handler
     * @param {object} event The event object with details about the change.
     */
    ZeaParamWidgetString.prototype.onValueChanged = function (mode) {
        var _this = this;
        if (!this.change) {
            this.txtField.value = this.parameter.getValue();
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
     * Input handler
     */
    ZeaParamWidgetString.prototype.onInput = function () {
        var value = this.txtField.value;
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
    ZeaParamWidgetString.prototype.onChange = function () {
        this.onInput();
        this.change = undefined;
    };
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    ZeaParamWidgetString.prototype.render = function () {
        var _this = this;
        return (h("div", { class: "zea-param-widget-string", ref: function (el) { return (_this.widgetContainer = el); } }, h("input", { onInput: this.onInput, onChange: this.onChange, ref: function (el) { return (_this.txtField = el); }, id: this.parameter.getName(), type: "text", tabindex: "0" })));
    };
    return ZeaParamWidgetString;
}());
uxFactory.registerWidget('zea-param-widget-string', function (p) { return p.constructor.name == Le.name; });
ZeaParamWidgetString.style = zeaParamWidgetStringCss;
export { ZeaParamWidgetString as Z };
