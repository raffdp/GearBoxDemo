import { r as registerInstance, h } from './index-12ee0265.js';
import './global-6e332181.js';
import './index-27446e12.js';
import './buffer-es6-d7e2ddd2.js';
import { E, N, y, U as Ue } from './index.esm-ae9384d6.js';
import { u as uxFactory } from './UxFactory-10f4c9f8.js';
import { i as iro } from './iro.es-02ba6fa3.js';
var zeaParamWidgetMaterialColorCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-material-color{color:var(--color-foreground-1)}.color-sample{height:30px;line-height:30px;border:1px solid var(--color-foreground-1);margin-bottom:0.5em;text-align:center;font-size:0.8em}";
var ZeaParamWidgetMaterialColor = /** @class */ (function () {
    function ZeaParamWidgetMaterialColor(hostRef) {
        registerInstance(this, hostRef);
        this.colorPickerHeight = 200;
    }
    /**
     * Listen to window resize event
     */
    ZeaParamWidgetMaterialColor.prototype.handlewindowResize = function () {
        var _this = this;
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(function () { return _this.resizeColorPicker(); }, 500);
    };
    /**
     * Actualy resize color picker
     */
    ZeaParamWidgetMaterialColor.prototype.resizeColorPicker = function () {
        this.colorPicker.resize(this.container.offsetWidth, this.colorPickerHeight);
    };
    /**
     * Run when component loads
     */
    ZeaParamWidgetMaterialColor.prototype.componentDidLoad = function () {
        var _this = this;
        this.setUpColorPicker();
        if (this.parameter) {
            this.parameter.on('valueChanged', function (event) {
                _this.onValueChange(event.mode);
            });
            this.onValueChange(E.USER_SETVALUE);
        }
    };
    /**
     * Called when the parameter value changes externally
     * @param {any} mode the change mode
     */
    ZeaParamWidgetMaterialColor.prototype.onValueChange = function (mode) {
        var _this = this;
        if (!this.change) {
            this.undoing = true;
            this.colorPicker.color.rgb = this.parameter.getValue().getAsRGBDict();
            this.undoing = false;
            this.sampleColor = this.colorPicker.color.hslString;
            this.setSampleTextColor();
            console.log(E);
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
     * Set the color of the text in the sample box
     */
    ZeaParamWidgetMaterialColor.prototype.setSampleTextColor = function () {
        var l = 100 - this.colorPicker.color.hsl.l;
        this.sampleTextColor = "hsl(1, 0%, " + l + "%)";
    };
    /**
     * Setup the color picker and it's events
     */
    ZeaParamWidgetMaterialColor.prototype.setUpColorPicker = function () {
        var _this = this;
        this.colorPicker = iro.ColorPicker(this.colorPickerContainer, {
            // Color picker options:
            // https://iro.js.org/guide.html
            width: this.container.offsetWidth,
            height: this.colorPickerHeight,
            anticlockwise: true,
            borderWidth: 0,
            borderColor: '#fff',
            sliderHeight: '10px',
            padding: 1,
            sliderMargin: 4,
            handleRadius: 4,
            layout: [
                {
                    // hue slider
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'hue',
                    },
                },
                {
                    // saturation slider
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'saturation',
                    },
                },
                {
                    // regular value slider
                    component: iro.ui.Slider,
                    options: {},
                },
            ],
        });
        this.colorPicker.on('input:start', function () {
            _this.change = new N(_this.parameter);
            _this.appData.undoRedoManager.addChange(_this.change);
        });
        this.colorPicker.on('input:end', function () {
            _this.change = undefined;
        });
        this.colorPicker.on('color:change', function () {
            if (_this.undoing)
                return;
            var value = new y();
            value.setFromRGBDict(_this.colorPicker.color.rgb);
            _this.sampleColor = _this.colorPicker.color.hslString;
            _this.setSampleTextColor();
            if (!_this.change) {
                _this.change = new N(_this.parameter, value);
                _this.appData.undoRedoManager.addChange(_this.change);
            }
            else {
                _this.change.update({ value: value });
            }
        });
    };
    /**
     * Main render method.
     * @return {JSX} The generated html
     */
    ZeaParamWidgetMaterialColor.prototype.render = function () {
        var _this = this;
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(function () { return _this.resizeColorPicker(); }, 500);
        return (h("div", { ref: function (el) { return (_this.container = el); }, class: "zea-param-widget-material-color" }, h("div", { style: {
                color: this.sampleTextColor,
                backgroundColor: this.sampleColor,
            }, class: "color-sample" }, this.sampleColor), h("div", { ref: function (el) { return (_this.colorPickerContainer = el); }, class: "color-picker" })));
    };
    return ZeaParamWidgetMaterialColor;
}());
uxFactory.registerWidget('zea-param-widget-material-color', function (p) { return p.constructor.name == Ue.name; });
ZeaParamWidgetMaterialColor.style = zeaParamWidgetMaterialColorCss;
export { ZeaParamWidgetMaterialColor as zea_param_widget_material_color };
