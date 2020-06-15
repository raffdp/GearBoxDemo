'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');
require('./global-ad93eec5.js');
require('./index-7e350ca9.js');
require('./buffer-es6-40c1bb4d.js');
const index_esm = require('./index.esm-7e77262a.js');
const UxFactory = require('./UxFactory-c2d7fcf7.js');
const iro_es = require('./iro.es-94b38cd2.js');

const zeaParamWidgetMaterialColorCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-material-color{color:var(--color-foreground-1)}.color-sample{height:30px;line-height:30px;border:1px solid var(--color-foreground-1);margin-bottom:0.5em;text-align:center;font-size:0.8em}";

const ZeaParamWidgetMaterialColor = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.colorPickerHeight = 200;
    }
    /**
     * Listen to window resize event
     */
    handlewindowResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => this.resizeColorPicker(), 500);
    }
    /**
     * Actualy resize color picker
     */
    resizeColorPicker() {
        this.colorPicker.resize(this.container.offsetWidth, this.colorPickerHeight);
    }
    /**
     * Run when component loads
     */
    componentDidLoad() {
        this.setUpColorPicker();
        if (this.parameter) {
            this.parameter.on('valueChanged', (event) => {
                this.onValueChange(event.mode);
            });
            this.onValueChange(index_esm.E.USER_SETVALUE);
        }
    }
    /**
     * Called when the parameter value changes externally
     * @param {any} mode the change mode
     */
    onValueChange(mode) {
        if (!this.change) {
            this.undoing = true;
            this.colorPicker.color.rgb = this.parameter.getValue().getAsRGBDict();
            this.undoing = false;
            this.sampleColor = this.colorPicker.color.hslString;
            this.setSampleTextColor();
            console.log(index_esm.E);
            if (mode == index_esm.E.REMOTEUSER_SETVALUE) {
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
     * Set the color of the text in the sample box
     */
    setSampleTextColor() {
        const l = 100 - this.colorPicker.color.hsl.l;
        this.sampleTextColor = `hsl(1, 0%, ${l}%)`;
    }
    /**
     * Setup the color picker and it's events
     */
    setUpColorPicker() {
        this.colorPicker = iro_es.iro.ColorPicker(this.colorPickerContainer, {
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
                    component: iro_es.iro.ui.Slider,
                    options: {
                        sliderType: 'hue',
                    },
                },
                {
                    // saturation slider
                    component: iro_es.iro.ui.Slider,
                    options: {
                        sliderType: 'saturation',
                    },
                },
                {
                    // regular value slider
                    component: iro_es.iro.ui.Slider,
                    options: {},
                },
            ],
        });
        this.colorPicker.on('input:start', () => {
            this.change = new index_esm.N(this.parameter);
            this.appData.undoRedoManager.addChange(this.change);
        });
        this.colorPicker.on('input:end', () => {
            this.change = undefined;
        });
        this.colorPicker.on('color:change', () => {
            if (this.undoing)
                return;
            const value = new index_esm.y();
            value.setFromRGBDict(this.colorPicker.color.rgb);
            this.sampleColor = this.colorPicker.color.hslString;
            this.setSampleTextColor();
            if (!this.change) {
                this.change = new index_esm.N(this.parameter, value);
                this.appData.undoRedoManager.addChange(this.change);
            }
            else {
                this.change.update({ value });
            }
        });
    }
    /**
     * Main render method.
     * @return {JSX} The generated html
     */
    render() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => this.resizeColorPicker(), 500);
        return (index.h("div", { ref: (el) => (this.container = el), class: "zea-param-widget-material-color" }, index.h("div", { style: {
                color: this.sampleTextColor,
                backgroundColor: this.sampleColor,
            }, class: "color-sample" }, this.sampleColor), index.h("div", { ref: (el) => (this.colorPickerContainer = el), class: "color-picker" })));
    }
};
UxFactory.uxFactory.registerWidget('zea-param-widget-material-color', (p) => p.constructor.name == index_esm.Ue.name);
ZeaParamWidgetMaterialColor.style = zeaParamWidgetMaterialColorCss;

exports.zea_param_widget_material_color = ZeaParamWidgetMaterialColor;
