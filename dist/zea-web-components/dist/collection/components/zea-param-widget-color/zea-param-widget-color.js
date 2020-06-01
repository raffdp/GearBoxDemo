import { Component, h, Prop, State, Listen } from '@stencil/core';
import uxFactory from '../../assets/UxFactory.js';
import iro from '@jaames/iro';
import { ValueSetMode, Color, ColorParameter } from '@zeainc/zea-engine';
import { ParameterValueChange } from '@zeainc/zea-ux';
/**
 * Main class for the component
 */
export class ZeaParamWidgetColor {
    constructor() {
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
        this.parameter.valueChanged.connect((mode) => {
            this.onValueChange(mode);
        });
        this.onValueChange(ValueSetMode.USER_SETVALUE);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 1000);
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
            console.log(ValueSetMode);
            if (mode == ValueSetMode.REMOTEUSER_SETVALUE) {
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
        this.colorPicker.on('input:start', () => {
            this.change = new ParameterValueChange(this.parameter);
            this.appData.undoRedoManager.addChange(this.change);
        });
        this.colorPicker.on('input:end', () => {
            this.change = undefined;
        });
        this.colorPicker.on('color:change', () => {
            if (this.undoing)
                return;
            const value = new Color();
            value.setFromRGBDict(this.colorPicker.color.rgb);
            this.sampleColor = this.colorPicker.color.hslString;
            this.setSampleTextColor();
            if (!this.change) {
                this.change = new ParameterValueChange(this.parameter, value);
                this.appData.undoRedoManager.addChange(this.change);
            }
            else {
                this.change.update({ value });
            }
        });
    }
    /**
     * Main ender method.
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { ref: (el) => (this.container = el), class: "zea-param-widget-color" },
            h("div", { style: {
                    color: this.sampleTextColor,
                    backgroundColor: this.sampleColor,
                }, class: "color-sample" }, this.sampleColor),
            h("div", { ref: (el) => (this.colorPickerContainer = el), class: "color-picker" })));
    }
    static get is() { return "zea-param-widget-color"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-param-widget-color.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-param-widget-color.css"]
    }; }
    static get properties() { return {
        "parameter": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Parameter to be edited"
            },
            "attribute": "parameter",
            "reflect": false
        },
        "appData": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The application data"
            },
            "attribute": "app-data",
            "reflect": false
        }
    }; }
    static get states() { return {
        "sampleColor": {}
    }; }
    static get listeners() { return [{
            "name": "resize",
            "method": "handlewindowResize",
            "target": "window",
            "capture": false,
            "passive": true
        }]; }
}
uxFactory.registerWidget('zea-param-widget-color', (p) => p.constructor.name == ColorParameter.name);
