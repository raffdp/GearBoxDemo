var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { r as registerInstance, c as createEvent, w as writeTask, h, H as Host, d as getElement } from './index-12ee0265.js';
import { c as config, g as getIonMode } from './ionic-global-9ae0f2dd.js';
import { c as createColorClasses, h as hostContext } from './theme-74c22054.js';
import { p as pointerCoord } from './helpers-4a6bd295.js';
var segmentIosCss = ":host{--ripple-color:currentColor;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:stretch;align-items:stretch;-ms-flex-pack:center;justify-content:center;width:100%;background:var(--background);font-family:var(--ion-font-family, inherit);text-align:center;contain:paint}:host(.segment-scrollable){-ms-flex-pack:start;justify-content:start;width:auto;overflow-x:auto}:host(.segment-scrollable::-webkit-scrollbar){display:none}:host{--background:rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.065);border-radius:8px;overflow:hidden;z-index:0}:host(.ion-color){background:rgba(var(--ion-color-base-rgb), 0.065)}:host(.in-toolbar){margin-left:auto;margin-right:auto;margin-top:0;margin-bottom:0;width:auto}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host(.in-toolbar){margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}:host(.in-toolbar:not(.ion-color)){background:var(--ion-toolbar-segment-background, var(--background))}:host(.in-toolbar-color:not(.ion-color)){background:rgba(var(--ion-color-contrast-rgb), 0.11)}";
var segmentMdCss = ":host{--ripple-color:currentColor;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:stretch;align-items:stretch;-ms-flex-pack:center;justify-content:center;width:100%;background:var(--background);font-family:var(--ion-font-family, inherit);text-align:center;contain:paint}:host(.segment-scrollable){-ms-flex-pack:start;justify-content:start;width:auto;overflow-x:auto}:host(.segment-scrollable::-webkit-scrollbar){display:none}:host{--background:transparent}:host(.segment-scrollable) ::slotted(ion-segment-button){min-width:auto}";
var Segment = /** @class */ (function () {
    function class_1(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.didInit = false;
        this.activated = false;
        /**
         * If `true`, the user cannot interact with the segment.
         */
        this.disabled = false;
        /**
         * If `true`, the segment buttons will overflow and the user can swipe to see them.
         * In addition, this will disable the gesture to drag the indicator between the buttons
         * in order to swipe to see hidden buttons.
         */
        this.scrollable = false;
        this.onClick = function (ev) {
            var current = ev.target;
            var previous = _this.checked;
            _this.value = current.value;
            if (previous && _this.scrollable) {
                _this.checkButton(previous, current);
            }
            _this.checked = current;
        };
        this.ionChange = createEvent(this, "ionChange", 7);
        this.ionSelect = createEvent(this, "ionSelect", 7);
        this.ionStyle = createEvent(this, "ionStyle", 7);
    }
    class_1.prototype.valueChanged = function (value, oldValue) {
        this.ionSelect.emit({ value: value });
        if (oldValue !== '' || this.didInit) {
            if (!this.activated) {
                this.ionChange.emit({ value: value });
            }
            else {
                this.valueAfterGesture = value;
            }
        }
    };
    class_1.prototype.disabledChanged = function () {
        this.gestureChanged();
        var buttons = this.getButtons();
        for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
            var button = buttons_1[_i];
            button.disabled = this.disabled;
        }
    };
    class_1.prototype.gestureChanged = function () {
        if (this.gesture && !this.scrollable) {
            this.gesture.enable(!this.disabled);
        }
    };
    class_1.prototype.connectedCallback = function () {
        this.emitStyle();
    };
    class_1.prototype.componentWillLoad = function () {
        this.emitStyle();
    };
    class_1.prototype.componentDidLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.setCheckedClasses();
                        _a = this;
                        return [4 /*yield*/, import('./index-66808674.js')];
                    case 1:
                        _a.gesture = (_b.sent()).createGesture({
                            el: this.el,
                            gestureName: 'segment',
                            gesturePriority: 100,
                            threshold: 0,
                            passive: false,
                            onStart: function (ev) { return _this.onStart(ev); },
                            onMove: function (ev) { return _this.onMove(ev); },
                            onEnd: function (ev) { return _this.onEnd(ev); },
                        });
                        this.gesture.enable(!this.scrollable);
                        this.gestureChanged();
                        if (this.disabled) {
                            this.disabledChanged();
                        }
                        this.didInit = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.onStart = function (detail) {
        this.activate(detail);
    };
    class_1.prototype.onMove = function (detail) {
        this.setNextIndex(detail);
    };
    class_1.prototype.onEnd = function (detail) {
        this.setActivated(false);
        var checkedValidButton = this.setNextIndex(detail, true);
        detail.event.stopImmediatePropagation();
        if (checkedValidButton) {
            this.addRipple(detail);
        }
        var value = this.valueAfterGesture;
        if (value !== undefined) {
            this.ionChange.emit({ value: value });
            this.valueAfterGesture = undefined;
        }
    };
    class_1.prototype.getButtons = function () {
        return Array.from(this.el.querySelectorAll('ion-segment-button'));
    };
    /**
     * The gesture blocks the segment button ripple. This
     * function adds the ripple based on the checked segment
     * and where the cursor ended.
     */
    class_1.prototype.addRipple = function (detail) {
        var _this = this;
        var useRippleEffect = config.getBoolean('animated', true) && config.getBoolean('rippleEffect', true);
        if (!useRippleEffect) {
            return;
        }
        var buttons = this.getButtons();
        var checked = buttons.find(function (button) { return button.value === _this.value; });
        var root = checked.shadowRoot || checked;
        var ripple = root.querySelector('ion-ripple-effect');
        if (!ripple) {
            return;
        }
        var _a = pointerCoord(detail.event), x = _a.x, y = _a.y;
        ripple.addRipple(x, y).then(function (remove) { return remove(); });
    };
    /*
     * Activate both the segment and the buttons
     * due to a bug with ::slotted in Safari
     */
    class_1.prototype.setActivated = function (activated) {
        var buttons = this.getButtons();
        buttons.forEach(function (button) {
            if (activated) {
                button.classList.add('segment-button-activated');
            }
            else {
                button.classList.remove('segment-button-activated');
            }
        });
        this.activated = activated;
    };
    class_1.prototype.activate = function (detail) {
        var _this = this;
        var clicked = detail.event.target;
        var buttons = this.getButtons();
        var checked = buttons.find(function (button) { return button.value === _this.value; });
        // Make sure we are only checking for activation on a segment button
        // since disabled buttons will get the click on the segment
        if (clicked.tagName !== 'ION-SEGMENT-BUTTON') {
            return;
        }
        // If there are no checked buttons, set the current button to checked
        if (!checked) {
            this.value = clicked.value;
        }
        // If the gesture began on the clicked button with the indicator
        // then we should activate the indicator
        if (this.value === clicked.value) {
            this.setActivated(true);
        }
    };
    class_1.prototype.getIndicator = function (button) {
        var root = button.shadowRoot || button;
        return root.querySelector('.segment-button-indicator');
    };
    class_1.prototype.checkButton = function (previous, current) {
        var previousIndicator = this.getIndicator(previous);
        var currentIndicator = this.getIndicator(current);
        if (previousIndicator === null || currentIndicator === null) {
            return;
        }
        var previousClientRect = previousIndicator.getBoundingClientRect();
        var currentClientRect = currentIndicator.getBoundingClientRect();
        var widthDelta = previousClientRect.width / currentClientRect.width;
        var xPosition = previousClientRect.left - currentClientRect.left;
        // Scale the indicator width to match the previous indicator width
        // and translate it on top of the previous indicator
        var transform = "translate3d(" + xPosition + "px, 0, 0) scaleX(" + widthDelta + ")";
        writeTask(function () {
            // Remove the transition before positioning on top of the previous indicator
            currentIndicator.classList.remove('segment-button-indicator-animated');
            currentIndicator.style.setProperty('transform', transform);
            // Force a repaint to ensure the transform happens
            currentIndicator.getBoundingClientRect();
            // Add the transition to move the indicator into place
            currentIndicator.classList.add('segment-button-indicator-animated');
            // Remove the transform to slide the indicator back to the button clicked
            currentIndicator.style.setProperty('transform', '');
        });
        this.value = current.value;
        this.setCheckedClasses();
    };
    class_1.prototype.setCheckedClasses = function () {
        var _this = this;
        var buttons = this.getButtons();
        var index = buttons.findIndex(function (button) { return button.value === _this.value; });
        var next = index + 1;
        // Keep track of the currently checked button
        this.checked = buttons.find(function (button) { return button.value === _this.value; });
        for (var _i = 0, buttons_2 = buttons; _i < buttons_2.length; _i++) {
            var button = buttons_2[_i];
            button.classList.remove('segment-button-after-checked');
        }
        if (next < buttons.length) {
            buttons[next].classList.add('segment-button-after-checked');
        }
    };
    class_1.prototype.setNextIndex = function (detail, isEnd) {
        var _this = this;
        if (isEnd === void 0) { isEnd = false; }
        var isRTL = document.dir === 'rtl';
        var activated = this.activated;
        var buttons = this.getButtons();
        var index = buttons.findIndex(function (button) { return button.value === _this.value; });
        var previous = buttons[index];
        var current;
        var nextIndex;
        if (index === -1) {
            return;
        }
        // Get the element that the touch event started on in case
        // it was the checked button, then we will move the indicator
        var rect = previous.getBoundingClientRect();
        var left = rect.left;
        var width = rect.width;
        // Get the element that the gesture is on top of based on the currentX of the
        // gesture event and the Y coordinate of the starting element, since the gesture
        // can move up and down off of the segment
        var currentX = detail.currentX;
        var previousY = rect.top + (rect.height / 2);
        var nextEl = document.elementFromPoint(currentX, previousY);
        var decreaseIndex = isRTL ? currentX > (left + width) : currentX < left;
        var increaseIndex = isRTL ? currentX < left : currentX > (left + width);
        // If the indicator is currently activated then we have started the gesture
        // on top of the checked button so we need to slide the indicator
        // by checking the button next to it as we move
        if (activated && !isEnd) {
            // Decrease index, move left in LTR & right in RTL
            if (decreaseIndex) {
                var newIndex = index - 1;
                if (newIndex >= 0) {
                    nextIndex = newIndex;
                }
                // Increase index, moves right in LTR & left in RTL
            }
            else if (increaseIndex) {
                if (activated && !isEnd) {
                    var newIndex = index + 1;
                    if (newIndex < buttons.length) {
                        nextIndex = newIndex;
                    }
                }
            }
            if (nextIndex !== undefined && !buttons[nextIndex].disabled) {
                current = buttons[nextIndex];
            }
        }
        // If the indicator is not activated then we will just set the indicator
        // to the element where the gesture ended
        if (!activated && isEnd) {
            current = nextEl;
        }
        /* tslint:disable-next-line */
        if (current != null) {
            /**
             * If current element is ion-segment then that means
             * user tried to select a disabled ion-segment-button,
             * and we should not update the ripple.
             */
            if (current.tagName === 'ION-SEGMENT') {
                return false;
            }
            if (previous !== current) {
                this.checkButton(previous, current);
            }
        }
        return true;
    };
    class_1.prototype.emitStyle = function () {
        this.ionStyle.emit({
            'segment': true
        });
    };
    class_1.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        return (h(Host, { onClick: this.onClick, class: Object.assign(Object.assign({}, createColorClasses(this.color)), (_a = {}, _a[mode] = true, _a['in-toolbar'] = hostContext('ion-toolbar', this.el), _a['in-toolbar-color'] = hostContext('ion-toolbar[color]', this.el), _a['segment-activated'] = this.activated, _a['segment-disabled'] = this.disabled, _a['segment-scrollable'] = this.scrollable, _a)) }, h("slot", null)));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "watchers", {
        get: function () {
            return {
                "value": ["valueChanged"],
                "disabled": ["disabledChanged"]
            };
        },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
Segment.style = {
    /*STENCIL:MODE:ios*/ ios: segmentIosCss,
    /*STENCIL:MODE:md*/ md: segmentMdCss
};
export { Segment as ion_segment };
