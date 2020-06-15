import { r as registerInstance, h } from './index-12ee0265.js';
import { E, N, X as Xe } from './index.esm-f69112c9.js';
import { u as uxFactory } from './UxFactory-caff4fc5.js';
var zeaParamWidgetBooleanCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-boolean{color:var(--color-foreground-1);background-color:var(--color-background-2)}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}";
var ZeaParamWidgetBoolean = /** @class */ (function () {
    /**
     * Class constructor
     */
    function ZeaParamWidgetBoolean(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Whether the checkbox should be checked
         */
        this.checked = false;
        this.inputChanged = this.inputChanged.bind(this);
    }
    /**
     * Run when component loads
     */
    ZeaParamWidgetBoolean.prototype.componentDidLoad = function () {
        var _this = this;
        if (this.parameter) {
            this.checked = this.parameter.getValue();
            this.parameter.on('valueChanged', function (event) {
                _this.checked = _this.parameter.getValue();
                if (event.mode == E.REMOTEUSER_SETVALUE) {
                    _this.cheboxInput.classList.add('user-edited');
                    if (_this.remoteUserEditedHighlightId) {
                        clearTimeout(_this.remoteUserEditedHighlightId);
                    }
                    _this.remoteUserEditedHighlightId = setTimeout(function () {
                        _this.cheboxInput.classList.remove('user-edited');
                        _this.remoteUserEditedHighlightId = null;
                    }, 1500);
                }
            });
        }
    };
    /**
     * Run when input changes
     */
    ZeaParamWidgetBoolean.prototype.inputChanged = function () {
        if (this.appData.undoRedoManager) {
            var change = new N(this.parameter, this.cheboxInput.checked);
            this.appData.undoRedoManager.addChange(change);
        }
        else {
            this.parameter.setValue(this.cheboxInput.checked);
        }
    };
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    ZeaParamWidgetBoolean.prototype.render = function () {
        var _this = this;
        return (h("div", { class: "zea-param-widget-boolean" }, h("input", { onChange: this.inputChanged, ref: function (el) { return (_this.cheboxInput = el); }, type: "checkbox", name: this.parameter.getName(), tabindex: "0", checked: this.checked })));
    };
    return ZeaParamWidgetBoolean;
}());
uxFactory.registerWidget('zea-param-widget-boolean', function (p) { return p.constructor.name == Xe.name; });
ZeaParamWidgetBoolean.style = zeaParamWidgetBooleanCss;
export { ZeaParamWidgetBoolean as Z };
