import { r as registerInstance, h, H as Host, d as getElement } from './index-12ee0265.js';
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
        var _this_1 = this;
        var file = e.currentTarget.files[0];
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            _this_1.photoBase64 = "" + reader.result;
            _this_1.value = _this_1.photoBase64;
            _this_1.checkValue();
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
        var _this_1 = this;
        var inputTypes = {
            text: [
                this.showLabel && h("label", { class: "input-label" }, this.label),
                h("input", { ref: function (el) { return (_this_1.inputElement = el); }, placeholder: this.showLabel ? '' : this.label, type: "text", value: this.value, onKeyDown: this.onKeyDown.bind(this), onKeyUp: this.onKeyUp.bind(this), class: {
                        invalid: (this.autoValidate || this.invalidMessageShown) && !this.isValid,
                    } }),
            ],
            photo: (h("div", { class: "photo-input" }, h("div", { class: "photo-thumb", onClick: function () {
                    _this_1.inputElement.dispatchEvent(new MouseEvent('click'));
                } }, h("zea-icon", { name: "camera-outline", size: 30 }), h("div", { id: "photo-preview", style: { backgroundImage: "url(" + this.value + ")" } })), h("div", { class: "photo-copy" }, h("label", { class: "input-label" }, this.label), "Your photo lets people recognize you while working together."), h("input", { ref: function (el) { return (_this_1.inputElement = el); }, type: "file", onChange: this.onPhotoChange.bind(this), class: {
                    invalid: (this.autoValidate || this.invalidMessageShown) &&
                        !this.isValid,
                } }))),
            color: (h("div", { class: "color-input" }, h("div", { class: "color-thumb" }, h("div", { ref: function (el) { return (_this_1.selectedColorContainer = el); }, class: "choosen-color", style: { backgroundColor: this.selectedColor }, onClick: function () {
                    _this_1.colorPopupShown = !_this_1.colorPopupShown;
                } }), h("div", { ref: function (el) { return (_this_1.colorPopup = el); }, class: "color-popup " + (this.colorPopupShown ? 'shown' : '') + " " + this.colorPopupAlign }, this.colorOptions.map(function (colorOption) { return (h("div", { class: "color-option", "data-color": colorOption, onMouseDown: _this_1.onColorClick.bind(_this_1), onMouseUp: function () {
                    _this_1.colorPopupShown = false;
                } }, h("div", { class: "color-sample", style: { backgroundColor: colorOption } }))); }))), this.showLabel && (h("div", { class: "color-copy" }, h("label", { class: "input-label" }, this.label), "Your color helps you stand out from other people.")))),
        };
        return (h("div", { class: "input-wrap", ref: function (el) { return (_this_1.inputWrapElement = el); } }, inputTypes[this.type], !this.isValid && this.invalidMessageShown && (h("div", { class: "invalid-message" }, this.invalidMessage))));
    };
    return ZeaInput;
}());
ZeaInput.style = zeaInputCss;
var zeaInputTextCss = ":host{display:inline-block;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box}:host(.hidden){display:none}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-input{color:var(--color-foreground-1)}.input-label{color:var(--color-foreground-3);position:relative;-webkit-transition:all 0.2s linear;transition:all 0.2s linear;pointer-events:none}.empty .input-label{top:18px;font-size:13px}.not-empty .input-label,.focused .input-label{top:0;font-size:11px}.focused .input-label{color:var(--color-secondary-1)}.input-wrap{display:block;position:relative}input[type='text']{-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;color:var(--color-foreground-1);background-color:transparent;border:none;outline:none;font-size:1em;font-size:13px}.invalid-message{color:var(--color-warning-1);padding:0.3em 0;font-size:12px}.underliner{text-align:center;height:1px;background-color:var(--color-grey-3);overflow:hidden;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}.underliner .expander{height:1px;background-color:var(--color-secondary-1);overflow:hidden;display:inline-block;width:0;-webkit-transition:width 0.2s linear;transition:width 0.2s linear}.focused .underliner .expander{width:100%}.invalid .underliner .expander{background-color:var(--color-warning-1);width:100%}.disabled .underliner{background-color:transparent;border-bottom:1px dotted var(--color-grey-3)}.hidden{display:none}";
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
        /**
         */
        this.hidden = false;
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
        var _this_1 = this;
        return (h(Host, { class: "" + (this.hidden ? 'hidden' : '') }, h("div", { class: "input-wrap " + (this.value ? 'not-empty' : 'empty') + " " + (!this.invalidMessageShown ? 'valid' : 'invalid') + " " + (this.disabled ? 'disabled' : '') + " " + (this.hidden ? 'hidden' : ''), ref: function (el) { return (_this_1.inputWrapElement = el); } }, this.showLabel && h("label", { class: "input-label" }, this.label), h("input", { ref: function (el) { return (_this_1.inputElement = el); },
            // placeholder={this.showLabel ? '' : this.label}
            type: "text", value: this.value, onKeyDown: this.onKeyDown.bind(this), onKeyUp: this.onKeyUp.bind(this), onBlur: this.onBlur.bind(this), onFocus: this.onFocus.bind(this), disabled: this.disabled, class: {
                invalid: (this.autoValidate || this.invalidMessageShown) &&
                    !this.isValid,
            } }), h("div", { class: "underliner" }, h("div", { class: "expander" })), !this.isValid && this.invalidMessageShown && (h("div", { class: "invalid-message" }, this.invalidMessage)))));
    };
    return ZeaInputText;
}());
ZeaInputText.style = zeaInputTextCss;
var resizeObservers = [];
var hasActiveObservations = function () {
    return resizeObservers.some(function (ro) { return ro.activeTargets.length > 0; });
};
var hasSkippedObservations = function () {
    return resizeObservers.some(function (ro) { return ro.skippedTargets.length > 0; });
};
var msg = 'ResizeObserver loop completed with undelivered notifications.';
var deliverResizeLoopError = function () {
    var event;
    if (typeof ErrorEvent === 'function') {
        event = new ErrorEvent('error', {
            message: msg
        });
    }
    else {
        event = document.createEvent('Event');
        event.initEvent('error', false, false);
        event.message = msg;
    }
    window.dispatchEvent(event);
};
var ResizeObserverBoxOptions;
(function (ResizeObserverBoxOptions) {
    ResizeObserverBoxOptions["BORDER_BOX"] = "border-box";
    ResizeObserverBoxOptions["CONTENT_BOX"] = "content-box";
    ResizeObserverBoxOptions["DEVICE_PIXEL_CONTENT_BOX"] = "device-pixel-content-box";
})(ResizeObserverBoxOptions || (ResizeObserverBoxOptions = {}));
var DOMRectReadOnly = (function () {
    function DOMRectReadOnly(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.top = this.y;
        this.left = this.x;
        this.bottom = this.top + this.height;
        this.right = this.left + this.width;
        return Object.freeze(this);
    }
    DOMRectReadOnly.prototype.toJSON = function () {
        var _a = this, x = _a.x, y = _a.y, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left, width = _a.width, height = _a.height;
        return { x: x, y: y, top: top, right: right, bottom: bottom, left: left, width: width, height: height };
    };
    DOMRectReadOnly.fromRect = function (rectangle) {
        return new DOMRectReadOnly(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    };
    return DOMRectReadOnly;
}());
var isSVG = function (target) { return target instanceof SVGElement && 'getBBox' in target; };
var isHidden = function (target) {
    if (isSVG(target)) {
        var _a = target.getBBox(), width = _a.width, height = _a.height;
        return !width && !height;
    }
    var _b = target, offsetWidth = _b.offsetWidth, offsetHeight = _b.offsetHeight;
    return !(offsetWidth || offsetHeight || target.getClientRects().length);
};
var isElement = function (obj) {
    var _a, _b;
    var scope = (_b = (_a = obj) === null || _a === void 0 ? void 0 : _a.ownerDocument) === null || _b === void 0 ? void 0 : _b.defaultView;
    return !!(scope && obj instanceof scope.Element);
};
var isReplacedElement = function (target) {
    switch (target.tagName) {
        case 'INPUT':
            if (target.type !== 'image') {
                break;
            }
        case 'VIDEO':
        case 'AUDIO':
        case 'EMBED':
        case 'OBJECT':
        case 'CANVAS':
        case 'IFRAME':
        case 'IMG':
            return true;
    }
    return false;
};
var global = typeof window !== 'undefined' ? window : {};
var cache = new Map();
var scrollRegexp = /auto|scroll/;
var verticalRegexp = /^tb|vertical/;
var IE = (/msie|trident/i).test(global.navigator && global.navigator.userAgent);
var parseDimension = function (pixel) { return parseFloat(pixel || '0'); };
var size = function (inlineSize, blockSize, switchSizes) {
    if (inlineSize === void 0) {
        inlineSize = 0;
    }
    if (blockSize === void 0) {
        blockSize = 0;
    }
    if (switchSizes === void 0) {
        switchSizes = false;
    }
    return Object.freeze({
        inlineSize: (switchSizes ? blockSize : inlineSize) || 0,
        blockSize: (switchSizes ? inlineSize : blockSize) || 0
    });
};
var zeroBoxes = Object.freeze({
    devicePixelContentBoxSize: size(),
    borderBoxSize: size(),
    contentBoxSize: size(),
    contentRect: new DOMRectReadOnly(0, 0, 0, 0)
});
var calculateBoxSizes = function (target) {
    if (cache.has(target)) {
        return cache.get(target);
    }
    if (isHidden(target)) {
        cache.set(target, zeroBoxes);
        return zeroBoxes;
    }
    var cs = getComputedStyle(target);
    var svg = isSVG(target) && target.ownerSVGElement && target.getBBox();
    var removePadding = !IE && cs.boxSizing === 'border-box';
    var switchSizes = verticalRegexp.test(cs.writingMode || '');
    var canScrollVertically = !svg && scrollRegexp.test(cs.overflowY || '');
    var canScrollHorizontally = !svg && scrollRegexp.test(cs.overflowX || '');
    var paddingTop = svg ? 0 : parseDimension(cs.paddingTop);
    var paddingRight = svg ? 0 : parseDimension(cs.paddingRight);
    var paddingBottom = svg ? 0 : parseDimension(cs.paddingBottom);
    var paddingLeft = svg ? 0 : parseDimension(cs.paddingLeft);
    var borderTop = svg ? 0 : parseDimension(cs.borderTopWidth);
    var borderRight = svg ? 0 : parseDimension(cs.borderRightWidth);
    var borderBottom = svg ? 0 : parseDimension(cs.borderBottomWidth);
    var borderLeft = svg ? 0 : parseDimension(cs.borderLeftWidth);
    var horizontalPadding = paddingLeft + paddingRight;
    var verticalPadding = paddingTop + paddingBottom;
    var horizontalBorderArea = borderLeft + borderRight;
    var verticalBorderArea = borderTop + borderBottom;
    var horizontalScrollbarThickness = !canScrollHorizontally ? 0 : target.offsetHeight - verticalBorderArea - target.clientHeight;
    var verticalScrollbarThickness = !canScrollVertically ? 0 : target.offsetWidth - horizontalBorderArea - target.clientWidth;
    var widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0;
    var heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0;
    var contentWidth = svg ? svg.width : parseDimension(cs.width) - widthReduction - verticalScrollbarThickness;
    var contentHeight = svg ? svg.height : parseDimension(cs.height) - heightReduction - horizontalScrollbarThickness;
    var borderBoxWidth = contentWidth + horizontalPadding + verticalScrollbarThickness + horizontalBorderArea;
    var borderBoxHeight = contentHeight + verticalPadding + horizontalScrollbarThickness + verticalBorderArea;
    var boxes = Object.freeze({
        devicePixelContentBoxSize: size(Math.round(contentWidth * devicePixelRatio), Math.round(contentHeight * devicePixelRatio), switchSizes),
        borderBoxSize: size(borderBoxWidth, borderBoxHeight, switchSizes),
        contentBoxSize: size(contentWidth, contentHeight, switchSizes),
        contentRect: new DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight)
    });
    cache.set(target, boxes);
    return boxes;
};
var calculateBoxSize = function (target, observedBox) {
    var _a = calculateBoxSizes(target), borderBoxSize = _a.borderBoxSize, contentBoxSize = _a.contentBoxSize, devicePixelContentBoxSize = _a.devicePixelContentBoxSize;
    switch (observedBox) {
        case ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
            return devicePixelContentBoxSize;
        case ResizeObserverBoxOptions.BORDER_BOX:
            return borderBoxSize;
        default:
            return contentBoxSize;
    }
};
var ResizeObserverEntry = (function () {
    function ResizeObserverEntry(target) {
        var boxes = calculateBoxSizes(target);
        this.target = target;
        this.contentRect = boxes.contentRect;
        this.borderBoxSize = [boxes.borderBoxSize];
        this.contentBoxSize = [boxes.contentBoxSize];
        this.devicePixelContentBoxSize = [boxes.devicePixelContentBoxSize];
    }
    return ResizeObserverEntry;
}());
var calculateDepthForNode = function (node) {
    if (isHidden(node)) {
        return Infinity;
    }
    var depth = 0;
    var parent = node.parentNode;
    while (parent) {
        depth += 1;
        parent = parent.parentNode;
    }
    return depth;
};
var broadcastActiveObservations = function () {
    var shallowestDepth = Infinity;
    var callbacks = [];
    resizeObservers.forEach(function processObserver(ro) {
        if (ro.activeTargets.length === 0) {
            return;
        }
        var entries = [];
        ro.activeTargets.forEach(function processTarget(ot) {
            var entry = new ResizeObserverEntry(ot.target);
            var targetDepth = calculateDepthForNode(ot.target);
            entries.push(entry);
            ot.lastReportedSize = calculateBoxSize(ot.target, ot.observedBox);
            if (targetDepth < shallowestDepth) {
                shallowestDepth = targetDepth;
            }
        });
        callbacks.push(function resizeObserverCallback() {
            ro.callback.call(ro.observer, entries, ro.observer);
        });
        ro.activeTargets.splice(0, ro.activeTargets.length);
    });
    for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
        var callback = callbacks_1[_i];
        callback();
    }
    return shallowestDepth;
};
var gatherActiveObservationsAtDepth = function (depth) {
    cache.clear();
    resizeObservers.forEach(function processObserver(ro) {
        ro.activeTargets.splice(0, ro.activeTargets.length);
        ro.skippedTargets.splice(0, ro.skippedTargets.length);
        ro.observationTargets.forEach(function processTarget(ot) {
            if (ot.isActive()) {
                if (calculateDepthForNode(ot.target) > depth) {
                    ro.activeTargets.push(ot);
                }
                else {
                    ro.skippedTargets.push(ot);
                }
            }
        });
    });
};
var process = function () {
    var depth = 0;
    gatherActiveObservationsAtDepth(depth);
    while (hasActiveObservations()) {
        depth = broadcastActiveObservations();
        gatherActiveObservationsAtDepth(depth);
    }
    if (hasSkippedObservations()) {
        deliverResizeLoopError();
    }
    return depth > 0;
};
var trigger;
var callbacks = [];
var notify = function () { return callbacks.splice(0).forEach(function (cb) { return cb(); }); };
var queueMicroTask = function (callback) {
    if (!trigger) {
        var toggle_1 = 0;
        var el_1 = document.createTextNode('');
        var config = { characterData: true };
        new MutationObserver(function () { return notify(); }).observe(el_1, config);
        trigger = function () { el_1.textContent = "" + (toggle_1 ? toggle_1-- : toggle_1++); };
    }
    callbacks.push(callback);
    trigger();
};
var queueResizeObserver = function (cb) {
    queueMicroTask(function ResizeObserver() {
        requestAnimationFrame(cb);
    });
};
var watching = 0;
var isWatching = function () { return !!watching; };
var CATCH_FRAMES = 60 / 5;
var observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };
var events = [
    'resize',
    'load',
    'transitionend',
    'animationend',
    'animationstart',
    'animationiteration',
    'keyup',
    'keydown',
    'mouseup',
    'mousedown',
    'mouseover',
    'mouseout',
    'blur',
    'focus'
];
var scheduled = false;
var Scheduler = (function () {
    function Scheduler() {
        var _this = this;
        this.stopped = true;
        this.listener = function () { return _this.schedule(); };
    }
    Scheduler.prototype.run = function (frames) {
        var _this = this;
        if (scheduled) {
            return;
        }
        scheduled = true;
        queueResizeObserver(function () {
            var elementsHaveResized = false;
            try {
                elementsHaveResized = process();
            }
            finally {
                scheduled = false;
                if (!isWatching()) {
                    return;
                }
                if (elementsHaveResized) {
                    _this.run(60);
                }
                else if (frames) {
                    _this.run(frames - 1);
                }
                else {
                    _this.start();
                }
            }
        });
    };
    Scheduler.prototype.schedule = function () {
        this.stop();
        this.run(CATCH_FRAMES);
    };
    Scheduler.prototype.observe = function () {
        var _this = this;
        var cb = function () { return _this.observer && _this.observer.observe(document.body, observerConfig); };
        document.body ? cb() : global.addEventListener('DOMContentLoaded', cb);
    };
    Scheduler.prototype.start = function () {
        var _this = this;
        if (this.stopped) {
            this.stopped = false;
            this.observer = new MutationObserver(this.listener);
            this.observe();
            events.forEach(function (name) { return global.addEventListener(name, _this.listener, true); });
        }
    };
    Scheduler.prototype.stop = function () {
        var _this = this;
        if (!this.stopped) {
            this.observer && this.observer.disconnect();
            events.forEach(function (name) { return global.removeEventListener(name, _this.listener, true); });
            this.stopped = true;
        }
    };
    return Scheduler;
}());
var scheduler = new Scheduler();
var updateCount = function (n) {
    !watching && n > 0 && scheduler.start();
    watching += n;
    !watching && scheduler.stop();
};
var skipNotifyOnElement = function (target) {
    return !isSVG(target)
        && !isReplacedElement(target)
        && getComputedStyle(target).display === 'inline';
};
var ResizeObservation = (function () {
    function ResizeObservation(target, observedBox) {
        this.target = target;
        this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX;
        this.lastReportedSize = {
            inlineSize: 0,
            blockSize: 0
        };
    }
    ResizeObservation.prototype.isActive = function () {
        var size = calculateBoxSize(this.target, this.observedBox);
        if (skipNotifyOnElement(this.target)) {
            this.lastReportedSize = size;
        }
        if (this.lastReportedSize.inlineSize !== size.inlineSize
            || this.lastReportedSize.blockSize !== size.blockSize) {
            return true;
        }
        return false;
    };
    return ResizeObservation;
}());
var ResizeObserverDetail = (function () {
    function ResizeObserverDetail(resizeObserver, callback) {
        this.activeTargets = [];
        this.skippedTargets = [];
        this.observationTargets = [];
        this.observer = resizeObserver;
        this.callback = callback;
    }
    return ResizeObserverDetail;
}());
var observerMap = new Map();
var getObservationIndex = function (observationTargets, target) {
    for (var i = 0; i < observationTargets.length; i += 1) {
        if (observationTargets[i].target === target) {
            return i;
        }
    }
    return -1;
};
var ResizeObserverController = (function () {
    function ResizeObserverController() {
    }
    ResizeObserverController.connect = function (resizeObserver, callback) {
        var detail = new ResizeObserverDetail(resizeObserver, callback);
        resizeObservers.push(detail);
        observerMap.set(resizeObserver, detail);
    };
    ResizeObserverController.observe = function (resizeObserver, target, options) {
        if (observerMap.has(resizeObserver)) {
            var detail = observerMap.get(resizeObserver);
            if (getObservationIndex(detail.observationTargets, target) < 0) {
                detail.observationTargets.push(new ResizeObservation(target, options && options.box));
                updateCount(1);
                scheduler.schedule();
            }
        }
    };
    ResizeObserverController.unobserve = function (resizeObserver, target) {
        if (observerMap.has(resizeObserver)) {
            var detail = observerMap.get(resizeObserver);
            var index = getObservationIndex(detail.observationTargets, target);
            if (index >= 0) {
                detail.observationTargets.splice(index, 1);
                updateCount(-1);
            }
        }
    };
    ResizeObserverController.disconnect = function (resizeObserver) {
        if (observerMap.has(resizeObserver)) {
            var detail = observerMap.get(resizeObserver);
            resizeObservers.splice(resizeObservers.indexOf(detail), 1);
            observerMap.delete(resizeObserver);
            updateCount(-detail.observationTargets.length);
        }
    };
    return ResizeObserverController;
}());
var ResizeObserver = (function () {
    function ResizeObserver(callback) {
        if (arguments.length === 0) {
            throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
        }
        if (typeof callback !== 'function') {
            throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
        }
        ResizeObserverController.connect(this, callback);
    }
    ResizeObserver.prototype.observe = function (target, options) {
        if (arguments.length === 0) {
            throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
        }
        if (!isElement(target)) {
            throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
        }
        ResizeObserverController.observe(this, target, options);
    };
    ResizeObserver.prototype.unobserve = function (target) {
        if (arguments.length === 0) {
            throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
        }
        if (!isElement(target)) {
            throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
        }
        ResizeObserverController.unobserve(this, target);
    };
    ResizeObserver.prototype.disconnect = function () {
        ResizeObserverController.disconnect(this);
    };
    ResizeObserver.toString = function () {
        return 'function ResizeObserver () { [polyfill code] }';
    };
    return ResizeObserver;
}());
var zeaScrollPaneCss = ":host{max-height:100%;width:100%;display:block;position:relative;height:100%}:host(.disabled){height:auto}.zea-scroll-pane{pointer-events:auto;max-height:100%;overflow:auto;scrollbar-width:none;-ms-overflow-style:none;}.zea-scroll-pane::-webkit-scrollbar{width:0px;background:transparent;}.v-scroll-track{position:absolute;right:0;top:0;bottom:0;width:10px;background-color:var(--color-background-4);z-index:1000}.v-scroll-bar{position:absolute;right:0px;width:10px;top:0;background-color:var(--color-grey-3);z-index:10000;-webkit-box-shadow:-2px 4px 7px -3px var(--color-background-1);box-shadow:-2px 4px 7px -3px var(--color-background-1)}:host(.disabled) .v-scroll-track,:host(.disabled) .v-scroll-bar{display:none}";
var ZeaScrollPane = /** @class */ (function () {
    function ZeaScrollPane(hostRef) {
        registerInstance(this, hostRef);
        this.vMouseDown = false;
    }
    /**
     *
     */
    ZeaScrollPane.prototype.onResize = function () {
        this.refreshScrollbar();
    };
    /**
     *
     */
    ZeaScrollPane.prototype.onOrientationchange = function () {
        this.refreshScrollbar();
    };
    /**
     *
     */
    ZeaScrollPane.prototype.onMouseUp = function () {
        this.vMouseDown = false;
        this.scrollPane.style.userSelect = 'initial';
    };
    /**
     * @param {any} e The event
     */
    ZeaScrollPane.prototype.onMouseMove = function (e) {
        if (this.vMouseDown) {
            var mouseDelta = e.clientY - this.prevClientY;
            var newScroll = (this.vBarTop - this.vTrackTop + mouseDelta) / this.scrollRatio;
            this.scrollPane.scrollTop = this.scrollPane.scrollTop + newScroll;
            this.prevClientY = e.clientY;
        }
    };
    /**
     *
     */
    ZeaScrollPane.prototype.componentDidLoad = function () {
        var _this_1 = this;
        this.refreshScrollbar();
        this.scrollPane.addEventListener('scroll', function () {
            _this_1.vScrollBar.style.top = _this_1.scrollPane.scrollTop * _this_1.scrollRatio + "px";
        });
        this.vScrollBar.addEventListener('mousedown', function (e) {
            _this_1.vMouseDown = true;
            _this_1.vMouseOffet = e.clientY;
            _this_1.vCurrentScroll = _this_1.scrollPane.scrollTop;
            var vBarBbox = _this_1.vScrollBar.getBoundingClientRect();
            _this_1.vBarTop = vBarBbox.top;
            _this_1.vBarHeight = vBarBbox.height;
            _this_1.prevClientY = e.clientY;
            var vTrackBbox = _this_1.vScrollBar.getBoundingClientRect();
            _this_1.vTrackTop = vTrackBbox.top;
            _this_1.scrollPane.style.userSelect = 'none';
        });
        var ro = new ResizeObserver(function () {
            _this_1.refreshScrollbar();
        });
        ro.observe(this.scrollContent);
        var observer = new MutationObserver(function (mutations) {
            console.log(mutations);
            _this_1.refreshScrollbar();
        });
        observer.observe(this.scrollContent, {
            attributes: true,
        });
    };
    /**
     *
     */
    ZeaScrollPane.prototype.refreshScrollbar = function () {
        this.scrollRatio =
            Math.ceil((this.rootElement.offsetHeight / this.scrollContent.offsetHeight) * 1000) / 1000;
        if (this.scrollRatio < 0.999) {
            this.rootElement.classList.remove('disabled');
            var handleHeight = this.rootElement.offsetHeight * this.scrollRatio;
            this.scrollDelta = this.rootElement.offsetHeight - handleHeight;
            this.vScrollBar.style.height = handleHeight + "px";
        }
        else {
            this.rootElement.classList.add('disabled');
        }
    };
    /**
     *
     */
    ZeaScrollPane.prototype.render = function () {
        var _this_1 = this;
        return (h(Host, null, h("div", { ref: function (el) { return (_this_1.vScrollTrack = el); }, draggable: false, class: "v-scroll-track" }), h("div", { draggable: false, class: "v-scroll-bar", ref: function (el) { return (_this_1.vScrollBar = el); } }), h("div", { class: "zea-scroll-pane", ref: function (el) { return (_this_1.scrollPane = el); } }, h("div", { class: "scroll-content", ref: function (el) { return (_this_1.scrollContent = el); } }, h("slot", null)))));
    };
    Object.defineProperty(ZeaScrollPane.prototype, "rootElement", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return ZeaScrollPane;
}());
ZeaScrollPane.style = zeaScrollPaneCss;
export { ZeaButton as zea_button, ZeaInput as zea_input, ZeaInputText as zea_input_text, ZeaScrollPane as zea_scroll_pane };
