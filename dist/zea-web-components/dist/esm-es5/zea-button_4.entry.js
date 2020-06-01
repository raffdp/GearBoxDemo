import { r as registerInstance, h } from './index-12ee0265.js';
var zeaButtonCss = ":host{display:inline-block}:host,input,button,select,textarea{font-family:'Roboto', sans-serif;font-size:13px}.small{font-size:11px}.zea-button{border-radius:2px;outline:none;padding:0;width:100%}.zea-button-label{padding:0.5em 1em;white-space:nowrap}.zea-button-content-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.zea-button{color:var(--color-foreground-1);background-color:var(--color-background-1);border:1px solid var(--color-background-1)}.zea-button:hover{background-color:var(--color-primary-3)}.zea-button:disabled{background-color:var(--color-disabled-2);border:1px solid var(--color-disabled-2);color:var(--color-disabled-1)}.zea-button.solid{color:var(--color-foreground-1);background-color:var(--color-secondary-1);border:1px solid var(--color-secondary-1)}.zea-button.solid:hover{background-color:var(--color-secondary-2);border:1px solid var(--color-secondary-2)}.zea-button.solid:disabled{background-color:var(--color-disabled-2);border:1px solid var(--color-disabled-2);color:var(--color-disabled-1)}.zea-button.outlined{color:var(--color-secondary-1);background-color:transparent;border:1px solid var(--color-secondary-1)}.zea-button.outlined:hover{background-color:var(--color-secondary-3)}.zea-button.outlined:disabled{background-color:var(--color-disabled-2);border:1px solid var(--color-disabled-2);color:var(--color-disabled-1)}.zea-button.pill{color:var(--color-button-text-1);background-color:var(--color-primary-1);border:1px solid var(--color-primary-1);border-radius:20px;min-height:40px}.zea-button.pill:hover{background-color:var(--color-primary-2);border:1px solid var(--color-primary-2)}.zea-button.pill:disabled{background-color:var(--color-disabled-2);border:1px solid var(--color-disabled-2);color:var(--color-foreground-1)}.zea-start-icon ::slotted(zea-icon){vertical-align:middle;padding-left:0.5em}.zea-end-icon ::slotted(zea-icon){vertical-align:middle;padding-right:0.5em}";
var ZeaButton = /** @class */ (function () {
    function ZeaButton(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Style variant for the button
         */
        this.variant = 'solid';
        /**
         * Whether the button should be disabled (true) or not (false)
         */
        this.disabled = false;
        /**
         * Whether the button should be disabled (true) or not (false)
         */
        this.color = false;
        /**
         * Whether the button should be disabled (true) or not (false)
         */
        this.density = 'normal';
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    ZeaButton.prototype.render = function () {
        return (h("button", { class: "zea-button " + this.variant + " " + this.density, disabled: this.disabled }, h("span", { class: "zea-button-content-wrap" }, h("span", { class: "zea-start-icon" }, h("slot", { name: "start-icon" })), this.htmlContent ? (h("span", { class: "zea-button-label", innerHTML: this.htmlContent })) : (h("span", { class: "zea-button-label" }, h("slot", null))), h("span", { class: "zea-end-icon" }, h("slot", { name: "end-icon" })))));
    };
    return ZeaButton;
}());
ZeaButton.style = zeaButtonCss;
var zeaFormCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-form{color:var(--color-foreground-1)}zea-button.submit{margin-top:2em;width:100%}";
var ZeaForm = /** @class */ (function () {
    function ZeaForm(hostRef) {
        registerInstance(this, hostRef);
        /**
         */
        this.submitText = 'SUBMIT';
        /**
         */
        this.validate = true;
        /**
         */
        this.isValid = true;
        /**
         */
        this.formValue = {};
        /**
         */
        this.inputs = [];
    }
    /**
     */
    ZeaForm.prototype.getFormValue = function () {
        var _this = this;
        this.checkValidation();
        this.inputs.forEach(function (inputElement) {
            _this.formValue[inputElement.name] = inputElement.value;
        });
        return this.formValue;
    };
    /**
     */
    ZeaForm.prototype.checkValidation = function () {
        if (!this.validate) {
            return true;
        }
        for (var i = 0; i < this.inputs.length; i++) {
            var inputElement = this.inputs[i];
            if (inputElement.isValid) {
                inputElement.invalidMessageShown = false;
                this.isValid = true;
            }
            else {
                inputElement.invalidMessageShown = true;
                this.isValid = false;
                return false;
            }
        }
        return true;
    };
    /**
     */
    ZeaForm.prototype.onSubmit = function () {
        if (this.submitCallback) {
            this.submitCallback(this.getFormValue());
        }
    };
    /**
     */
    ZeaForm.prototype.componentDidRender = function () {
        this.setupChildren();
    };
    /**
     * Run some setup for the children items
     */
    ZeaForm.prototype.setupChildren = function () {
        var _this = this;
        this.formContainer
            .querySelector('slot')
            .assignedElements()
            .forEach(function (element) {
            if (element.tagName.match(/^ZEA-INPUT/i)) {
                _this.inputs.push(element);
            }
        });
    };
    // eslint-disable-next-line require-jsdoc
    ZeaForm.prototype.render = function () {
        var _this = this;
        return (h("div", { class: "zea-form", ref: function (el) { return (_this.formContainer = el); } }, h("slot", null), h("zea-button", { onClick: this.onSubmit.bind(this), class: "submit" }, this.submitText)));
    };
    return ZeaForm;
}());
ZeaForm.style = zeaFormCss;
var zeaInputCss = ".zea-input{color:var(--color-foreground-1)}.input-label{font-size:11px;color:var(--color-grey-3)}.input-wrap{display:block;}input[type='text']{-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;color:var(--color-foreground-2);background-color:transparent;border:none;outline:none;font-size:1em;border-bottom:1px solid var(--color-grey-3)}input[type='text'].invalid{border-bottom:1px solid var(--color-warning-2)}.invalid-message{color:var(--color-warning-2);padding:0.3em 0;font-size:12px}.photo-input{display:-ms-flexbox;display:flex;overflow:hidden}.photo-input input{position:absolute;left:-100000px}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.photo-input .input-label{display:block}.photo-thumb{-ms-flex-negative:0;flex-shrink:0;display:block;width:54px;height:54px;border-radius:30px;margin-right:10px;background-color:var(--color-secondary-1);display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;font-size:12px;position:relative}.photo-copy{font-size:12px;color:var(--color-foreground-2)}#photo-preview{position:absolute;width:100%;height:100%;background-size:cover;border-radius:30px}.color-input{display:-ms-flexbox;display:flex;overflow:hidden}.color-input .input-label{display:block}.color-thumb{-ms-flex-negative:0;flex-shrink:0;display:block;width:54px;height:54px;border-radius:30px;margin-right:10px;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;font-size:12px}.color-copy{font-size:12px;color:var(--color-foreground-2)}.color-popup{padding:7px;position:absolute;grid-template-columns:1fr 1fr 1fr 1fr;margin-top:-70px;margin-left:43px;border-radius:10px;background-color:var(--color-background-2);display:none;z-index:1000}.color-popup.top-left{margin-top:110px;margin-left:-54px}.color-popup.shown{display:grid}.color-option{padding:8px}.color-option.active{padding:0}.color-option.active .color-sample{width:32px;height:32px;border-radius:20px}.color-sample{width:16px;height:16px;border-radius:10px}.choosen-color{width:32px;height:32px;border-radius:20px}";
var ZeaInput = /** @class */ (function () {
    function ZeaInput(hostRef) {
        registerInstance(this, hostRef);
        /**
         */
        this.name = 'zea-input';
        /**
         */
        this.type = 'text';
        /**
         */
        this.label = 'Enter text...';
        /**
         */
        this.invalidMessage = 'Not valid';
        /**
         */
        this.required = false;
        /**
         */
        this.isValid = true;
        /**
         */
        this.autoValidate = false;
        /**
         */
        this.invalidMessageShown = false;
        /**
         */
        this.showLabel = false;
        /**
         */
        this.photoBase64 = '';
        /**
         */
        this.colorPopupShown = false;
        /**
         */
        this.colorPopupAlign = 'bottom-right';
        /**
         */
        this.colorOptions = [
            '#F34235',
            '#E81D62',
            '#292929',
            '#9B26AF',
            '#6639B6',
            '#3E50B4',
            '#2095F2',
            '#02A8F3',
            '#00BBD3',
            '#009587',
            '#4BAE4F',
            '#8AC249',
            '#CCDB38',
            '#FEEA3A',
            '#FEC006',
            '#FE9700',
            '#FE5621',
            '#785447',
            '#9D9D9D',
            '#5F7C8A',
        ];
    }
    /**
     * Listen to click events on the whole document
     * @param {any} e The event
     */
    ZeaInput.prototype.handleClick = function (e) {
        if (!e.composedPath().includes(this.colorPopup) &&
            !e.composedPath().includes(this.selectedColorContainer)) {
            this.colorPopupShown = false;
        }
    };
    /**
     */
    ZeaInput.prototype.checkValue = function () {
        if (!this.inputElement)
            return;
        if (this.type == 'photo') {
            this.value = this.photoBase64;
        }
        else if (this.type == 'color') {
            this.value = this.selectedColor;
        }
        else {
            this.value = this.inputElement.value;
            this.value.replace(/(^\s+|\s+$)/, ''); // trim
        }
        if (this.required) {
            if (!this.value) {
                this.invalidMessage = 'Field is required';
                this.isValid = false;
                if (this.autoValidate)
                    this.invalidMessageShown = true;
            }
            else {
                this.isValid = true;
                this.invalidMessageShown = false;
            }
        }
    };
    /**
     */
    ZeaInput.prototype.onKeyUp = function (e) {
        this.checkValue();
        e.stopPropagation();
    };
    /**
     */
    ZeaInput.prototype.onKeyDown = function (e) {
        e.stopPropagation();
    };
    /**
     */
    ZeaInput.prototype.onColorClick = function (e) {
        this.selectColor(e.currentTarget.dataset.color);
    };
    /**
     */
    ZeaInput.prototype.selectColor = function (color) {
        var colorElement = this.inputWrapElement.querySelector(".color-option[data-color=\"" + color + "\"]");
        if (!colorElement)
            return;
        this.selectedColor = colorElement.dataset.color;
        if (this.currentColorElement)
            this.currentColorElement.classList.remove('active');
        colorElement.classList.add('active');
        this.currentColorElement = colorElement;
        this.value = this.selectedColor;
    };
    /**
     */
    ZeaInput.prototype.onPhotoChange = function (e) {
        var _this = this;
        var file = e.currentTarget.files[0];
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            _this.photoBase64 = "" + reader.result;
            _this.value = _this.photoBase64;
            _this.checkValue();
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    /**
     */
    ZeaInput.prototype.componentDidRender = function () {
        // this.checkValue()
    };
    /**
     */
    ZeaInput.prototype.componentWillLoad = function () {
        if (this.type == 'color' && !this.selectedColor && !this.value) {
            this.selectedColor = this.colorOptions[Math.floor(Math.random() * this.colorOptions.length)];
            this.value = this.selectedColor;
        }
        else if (this.type == 'color' && this.value) {
            this.selectedColor = this.value;
        }
        if (this.type == 'photo' && this.value) {
            this.photoBase64 = this.value; // TODO: check it's actually base64
        }
    };
    /**
     */
    ZeaInput.prototype.componentDidLoad = function () {
        this.selectColor(this.selectedColor);
    };
    /**
     */
    ZeaInput.prototype.render = function () {
        var _this = this;
        var inputTypes = {
            text: [
                this.showLabel && h("label", { class: "input-label" }, this.label),
                h("input", { ref: function (el) { return (_this.inputElement = el); }, placeholder: this.showLabel ? '' : this.label, type: "text", value: this.value, onKeyDown: this.onKeyDown.bind(this), onKeyUp: this.onKeyUp.bind(this), class: {
                        invalid: (this.autoValidate || this.invalidMessageShown) && !this.isValid,
                    } }),
            ],
            photo: (h("div", { class: "photo-input" }, h("div", { class: "photo-thumb", onClick: function () {
                    _this.inputElement.dispatchEvent(new MouseEvent('click'));
                } }, h("zea-icon", { name: "camera-outline", size: 30 }), h("div", { id: "photo-preview", style: { backgroundImage: "url(" + this.value + ")" } })), h("div", { class: "photo-copy" }, h("label", { class: "input-label" }, this.label), "Your photo lets people recognize you while working together."), h("input", { ref: function (el) { return (_this.inputElement = el); }, type: "file", onChange: this.onPhotoChange.bind(this), class: {
                    invalid: (this.autoValidate || this.invalidMessageShown) &&
                        !this.isValid,
                } }))),
            color: (h("div", { class: "color-input" }, h("div", { class: "color-thumb" }, h("div", { ref: function (el) { return (_this.selectedColorContainer = el); }, class: "choosen-color", style: { backgroundColor: this.selectedColor }, onClick: function () {
                    _this.colorPopupShown = !_this.colorPopupShown;
                } }), h("div", { ref: function (el) { return (_this.colorPopup = el); }, class: "color-popup " + (this.colorPopupShown ? 'shown' : '') + " " + this.colorPopupAlign }, this.colorOptions.map(function (colorOption) { return (h("div", { class: "color-option", "data-color": colorOption, onMouseDown: _this.onColorClick.bind(_this), onMouseUp: function () {
                    _this.colorPopupShown = false;
                } }, h("div", { class: "color-sample", style: { backgroundColor: colorOption } }))); }))), this.showLabel && (h("div", { class: "color-copy" }, h("label", { class: "input-label" }, this.label), "Your color helps you stand out from other people.")))),
        };
        return (h("div", { class: "input-wrap", ref: function (el) { return (_this.inputWrapElement = el); } }, inputTypes[this.type], !this.isValid && this.invalidMessageShown && (h("div", { class: "invalid-message" }, this.invalidMessage))));
    };
    return ZeaInput;
}());
ZeaInput.style = zeaInputCss;
var zeaInputTextCss = ":host{display:inline-block;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-input{color:var(--color-foreground-1)}.input-label{color:var(--color-grey-3);position:relative;-webkit-transition:all 0.2s linear;transition:all 0.2s linear;pointer-events:none}.empty .input-label{top:18px;font-size:13px}.not-empty .input-label,.focused .input-label{top:0;font-size:11px}.focused .input-label{color:var(--color-secondary-1)}.input-wrap{display:block;position:relative}input[type='text']{-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;color:var(--color-foreground-2);background-color:transparent;border:none;outline:none;font-size:1em;font-size:13px}.invalid-message{color:var(--color-warning-1);padding:0.3em 0;font-size:12px}.underliner{text-align:center;height:1px;background-color:var(--color-grey-3);overflow:hidden;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}.underliner .expander{height:1px;background-color:var(--color-secondary-1);overflow:hidden;display:inline-block;width:0;-webkit-transition:width 0.2s linear;transition:width 0.2s linear}.focused .underliner .expander{width:100%}.invalid .underliner .expander{background-color:var(--color-warning-1);width:100%}.disabled .underliner{background-color:transparent;border-bottom:1px dotted var(--color-grey-3)}";
var ZeaInputText = /** @class */ (function () {
    function ZeaInputText(hostRef) {
        registerInstance(this, hostRef);
        /**
         */
        this.name = 'zea-input';
        /**
         */
        this.label = 'Enter text...';
        /**
         */
        this.invalidMessage = 'Not valid';
        /**
         */
        this.required = false;
        /**
         */
        this.disabled = false;
        /**
         */
        this.isValid = true;
        /**
         */
        this.autoValidate = false;
        /**
         */
        this.invalidMessageShown = false;
        /**
         */
        this.showLabel = true;
    }
    /**
     */
    ZeaInputText.prototype.checkValue = function () {
        if (!this.inputElement)
            return;
        this.value = this.inputElement.value;
        this.value.replace(/(^\s+|\s+$)/, ''); // trim
        if (this.required) {
            if (!this.value) {
                this.invalidMessage = 'Field is required';
                this.isValid = false;
                if (this.autoValidate)
                    this.invalidMessageShown = true;
            }
            else {
                this.isValid = true;
                this.invalidMessageShown = false;
            }
        }
    };
    /**
     */
    ZeaInputText.prototype.onKeyUp = function (e) {
        this.checkValue();
        e.stopPropagation();
    };
    /**
     */
    ZeaInputText.prototype.onKeyDown = function (e) {
        e.stopPropagation();
    };
    /**
     */
    ZeaInputText.prototype.onBlur = function () {
        this.inputWrapElement.classList.remove('focused');
    };
    /**
     */
    ZeaInputText.prototype.onFocus = function () {
        this.inputWrapElement.classList.add('focused');
    };
    /**
     */
    ZeaInputText.prototype.componentDidRender = function () {
        this.checkValue();
    };
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    ZeaInputText.prototype.render = function () {
        var _this = this;
        return (h("div", { class: "input-wrap " + (this.value ? 'not-empty' : 'empty') + " " + (!this.invalidMessageShown ? 'valid' : 'invalid') + " " + (this.disabled ? 'disabled' : ''), ref: function (el) { return (_this.inputWrapElement = el); } }, this.showLabel && h("label", { class: "input-label" }, this.label), h("input", { ref: function (el) { return (_this.inputElement = el); },
            // placeholder={this.showLabel ? '' : this.label}
            type: "text", value: this.value, onKeyDown: this.onKeyDown.bind(this), onKeyUp: this.onKeyUp.bind(this), onBlur: this.onBlur.bind(this), onFocus: this.onFocus.bind(this), disabled: this.disabled, class: {
                invalid: (this.autoValidate || this.invalidMessageShown) && !this.isValid,
            } }), h("div", { class: "underliner" }, h("div", { class: "expander" })), !this.isValid && this.invalidMessageShown && (h("div", { class: "invalid-message" }, this.invalidMessage))));
    };
    return ZeaInputText;
}());
ZeaInputText.style = zeaInputTextCss;
export { ZeaButton as zea_button, ZeaForm as zea_form, ZeaInput as zea_input, ZeaInputText as zea_input_text };
