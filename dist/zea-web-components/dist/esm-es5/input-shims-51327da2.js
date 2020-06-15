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
import { p as pointerCoord } from './helpers-4a6bd295.js';
var cloneMap = new WeakMap();
var relocateInput = function (componentEl, inputEl, shouldRelocate, inputRelativeY) {
    if (inputRelativeY === void 0) { inputRelativeY = 0; }
    if (cloneMap.has(componentEl) === shouldRelocate) {
        return;
    }
    if (shouldRelocate) {
        addClone(componentEl, inputEl, inputRelativeY);
    }
    else {
        removeClone(componentEl, inputEl);
    }
};
var isFocused = function (input) {
    return input === input.getRootNode().activeElement;
};
var addClone = function (componentEl, inputEl, inputRelativeY) {
    // this allows for the actual input to receive the focus from
    // the user's touch event, but before it receives focus, it
    // moves the actual input to a location that will not screw
    // up the app's layout, and does not allow the native browser
    // to attempt to scroll the input into place (messing up headers/footers)
    // the cloned input fills the area of where native input should be
    // while the native input fakes out the browser by relocating itself
    // before it receives the actual focus event
    // We hide the focused input (with the visible caret) invisible by making it scale(0),
    var parentEl = inputEl.parentNode;
    // DOM WRITES
    var clonedEl = inputEl.cloneNode(false);
    clonedEl.classList.add('cloned-input');
    clonedEl.tabIndex = -1;
    parentEl.appendChild(clonedEl);
    cloneMap.set(componentEl, clonedEl);
    var doc = componentEl.ownerDocument;
    var tx = doc.dir === 'rtl' ? 9999 : -9999;
    componentEl.style.pointerEvents = 'none';
    inputEl.style.transform = "translate3d(" + tx + "px," + inputRelativeY + "px,0) scale(0)";
};
var removeClone = function (componentEl, inputEl) {
    var clone = cloneMap.get(componentEl);
    if (clone) {
        cloneMap.delete(componentEl);
        clone.remove();
    }
    componentEl.style.pointerEvents = '';
    inputEl.style.transform = '';
};
var enableHideCaretOnScroll = function (componentEl, inputEl, scrollEl) {
    if (!scrollEl || !inputEl) {
        return function () { return; };
    }
    var scrollHideCaret = function (shouldHideCaret) {
        if (isFocused(inputEl)) {
            relocateInput(componentEl, inputEl, shouldHideCaret);
        }
    };
    var onBlur = function () { return relocateInput(componentEl, inputEl, false); };
    var hideCaret = function () { return scrollHideCaret(true); };
    var showCaret = function () { return scrollHideCaret(false); };
    scrollEl.addEventListener('ionScrollStart', hideCaret);
    scrollEl.addEventListener('ionScrollEnd', showCaret);
    inputEl.addEventListener('blur', onBlur);
    return function () {
        scrollEl.removeEventListener('ionScrollStart', hideCaret);
        scrollEl.removeEventListener('ionScrollEnd', showCaret);
        inputEl.addEventListener('ionBlur', onBlur);
    };
};
var SKIP_SELECTOR = 'input, textarea, [no-blur]';
var enableInputBlurring = function () {
    var focused = true;
    var didScroll = false;
    var doc = document;
    var onScroll = function () {
        didScroll = true;
    };
    var onFocusin = function () {
        focused = true;
    };
    var onTouchend = function (ev) {
        // if app did scroll return early
        if (didScroll) {
            didScroll = false;
            return;
        }
        var active = doc.activeElement;
        if (!active) {
            return;
        }
        // only blur if the active element is a text-input or a textarea
        if (active.matches(SKIP_SELECTOR)) {
            return;
        }
        // if the selected target is the active element, do not blur
        var tapped = ev.target;
        if (tapped === active) {
            return;
        }
        if (tapped.matches(SKIP_SELECTOR) || tapped.closest(SKIP_SELECTOR)) {
            return;
        }
        focused = false;
        // TODO: find a better way, why 50ms?
        setTimeout(function () {
            if (!focused) {
                active.blur();
            }
        }, 50);
    };
    doc.addEventListener('ionScrollStart', onScroll);
    doc.addEventListener('focusin', onFocusin, true);
    doc.addEventListener('touchend', onTouchend, false);
    return function () {
        doc.removeEventListener('ionScrollStart', onScroll, true);
        doc.removeEventListener('focusin', onFocusin, true);
        doc.removeEventListener('touchend', onTouchend, false);
    };
};
var SCROLL_ASSIST_SPEED = 0.3;
var getScrollData = function (componentEl, contentEl, keyboardHeight) {
    var itemEl = componentEl.closest('ion-item,[ion-item]') || componentEl;
    return calcScrollData(itemEl.getBoundingClientRect(), contentEl.getBoundingClientRect(), keyboardHeight, componentEl.ownerDocument.defaultView.innerHeight);
};
var calcScrollData = function (inputRect, contentRect, keyboardHeight, platformHeight) {
    // compute input's Y values relative to the body
    var inputTop = inputRect.top;
    var inputBottom = inputRect.bottom;
    // compute visible area
    var visibleAreaTop = contentRect.top;
    var visibleAreaBottom = Math.min(contentRect.bottom, platformHeight - keyboardHeight);
    // compute safe area
    var safeAreaTop = visibleAreaTop + 15;
    var safeAreaBottom = visibleAreaBottom * 0.5;
    // figure out if each edge of the input is within the safe area
    var distanceToBottom = safeAreaBottom - inputBottom;
    var distanceToTop = safeAreaTop - inputTop;
    // desiredScrollAmount is the negated distance to the safe area according to our calculations.
    var desiredScrollAmount = Math.round((distanceToBottom < 0)
        ? -distanceToBottom
        : (distanceToTop > 0)
            ? -distanceToTop
            : 0);
    // our calculations make some assumptions that aren't always true, like the keyboard being closed when an input
    // gets focus, so make sure we don't scroll the input above the visible area
    var scrollAmount = Math.min(desiredScrollAmount, inputTop - visibleAreaTop);
    var distance = Math.abs(scrollAmount);
    var duration = distance / SCROLL_ASSIST_SPEED;
    var scrollDuration = Math.min(400, Math.max(150, duration));
    return {
        scrollAmount: scrollAmount,
        scrollDuration: scrollDuration,
        scrollPadding: keyboardHeight,
        inputSafeY: -(inputTop - safeAreaTop) + 4
    };
};
var enableScrollAssist = function (componentEl, inputEl, contentEl, keyboardHeight) {
    var coord;
    var touchStart = function (ev) {
        coord = pointerCoord(ev);
    };
    var touchEnd = function (ev) {
        // input cover touchend/mouseup
        if (!coord) {
            return;
        }
        // get where the touchend/mouseup ended
        var endCoord = pointerCoord(ev);
        // focus this input if the pointer hasn't moved XX pixels
        // and the input doesn't already have focus
        if (!hasPointerMoved(6, coord, endCoord) && !isFocused(inputEl)) {
            ev.preventDefault();
            ev.stopPropagation();
            // begin the input focus process
            jsSetFocus(componentEl, inputEl, contentEl, keyboardHeight);
        }
    };
    componentEl.addEventListener('touchstart', touchStart, true);
    componentEl.addEventListener('touchend', touchEnd, true);
    return function () {
        componentEl.removeEventListener('touchstart', touchStart, true);
        componentEl.removeEventListener('touchend', touchEnd, true);
    };
};
var jsSetFocus = function (componentEl, inputEl, contentEl, keyboardHeight) {
    var scrollData = getScrollData(componentEl, contentEl, keyboardHeight);
    if (Math.abs(scrollData.scrollAmount) < 4) {
        // the text input is in a safe position that doesn't
        // require it to be scrolled into view, just set focus now
        inputEl.focus();
        return;
    }
    // temporarily move the focus to the focus holder so the browser
    // doesn't freak out while it's trying to get the input in place
    // at this point the native text input still does not have focus
    relocateInput(componentEl, inputEl, true, scrollData.inputSafeY);
    inputEl.focus();
    /* tslint:disable-next-line */
    if (typeof window !== 'undefined') {
        var scrollContentTimeout_1;
        var scrollContent_1 = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // clean up listeners and timeouts
                        if (scrollContentTimeout_1 !== undefined) {
                            clearTimeout(scrollContentTimeout_1);
                        }
                        window.removeEventListener('resize', scrollContent_1);
                        // scroll the input into place
                        return [4 /*yield*/, contentEl.scrollByPoint(0, scrollData.scrollAmount, scrollData.scrollDuration)];
                    case 1:
                        // scroll the input into place
                        _a.sent();
                        // the scroll view is in the correct position now
                        // give the native text input focus
                        relocateInput(componentEl, inputEl, false, scrollData.inputSafeY);
                        // ensure this is the focused input
                        inputEl.focus();
                        return [2 /*return*/];
                }
            });
        }); };
        window.addEventListener('resize', scrollContent_1);
        // fallback in case resize never fires
        scrollContentTimeout_1 = setTimeout(scrollContent_1, 1000);
    }
};
var hasPointerMoved = function (threshold, startCoord, endCoord) {
    if (startCoord && endCoord) {
        var deltaX = (startCoord.x - endCoord.x);
        var deltaY = (startCoord.y - endCoord.y);
        var distance = deltaX * deltaX + deltaY * deltaY;
        return distance > (threshold * threshold);
    }
    return false;
};
var PADDING_TIMER_KEY = '$ionPaddingTimer';
var enableScrollPadding = function (keyboardHeight) {
    var doc = document;
    var onFocusin = function (ev) {
        setScrollPadding(ev.target, keyboardHeight);
    };
    var onFocusout = function (ev) {
        setScrollPadding(ev.target, 0);
    };
    doc.addEventListener('focusin', onFocusin);
    doc.addEventListener('focusout', onFocusout);
    return function () {
        doc.removeEventListener('focusin', onFocusin);
        doc.removeEventListener('focusout', onFocusout);
    };
};
var setScrollPadding = function (input, keyboardHeight) {
    if (input.tagName !== 'INPUT') {
        return;
    }
    if (input.parentElement && input.parentElement.tagName === 'ION-INPUT') {
        return;
    }
    if (input.parentElement &&
        input.parentElement.parentElement &&
        input.parentElement.parentElement.tagName === 'ION-SEARCHBAR') {
        return;
    }
    var el = input.closest('ion-content');
    if (el === null) {
        return;
    }
    var timer = el[PADDING_TIMER_KEY];
    if (timer) {
        clearTimeout(timer);
    }
    if (keyboardHeight > 0) {
        el.style.setProperty('--keyboard-offset', keyboardHeight + "px");
    }
    else {
        el[PADDING_TIMER_KEY] = setTimeout(function () {
            el.style.setProperty('--keyboard-offset', '0px');
        }, 120);
    }
};
var INPUT_BLURRING = true;
var SCROLL_PADDING = true;
var startInputShims = function (config) {
    var doc = document;
    var keyboardHeight = config.getNumber('keyboardHeight', 290);
    var scrollAssist = config.getBoolean('scrollAssist', true);
    var hideCaret = config.getBoolean('hideCaretOnScroll', true);
    var inputBlurring = config.getBoolean('inputBlurring', true);
    var scrollPadding = config.getBoolean('scrollPadding', true);
    var inputs = Array.from(doc.querySelectorAll('ion-input, ion-textarea'));
    var hideCaretMap = new WeakMap();
    var scrollAssistMap = new WeakMap();
    var registerInput = function (componentEl) { return __awaiter(void 0, void 0, void 0, function () {
        var inputRoot, inputEl, scrollEl, rmFn, rmFn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!componentEl.componentOnReady) return [3 /*break*/, 2];
                    return [4 /*yield*/, componentEl.componentOnReady()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    inputRoot = componentEl.shadowRoot || componentEl;
                    inputEl = inputRoot.querySelector('input') || inputRoot.querySelector('textarea');
                    scrollEl = componentEl.closest('ion-content');
                    if (!inputEl) {
                        return [2 /*return*/];
                    }
                    if (!!scrollEl && hideCaret && !hideCaretMap.has(componentEl)) {
                        rmFn = enableHideCaretOnScroll(componentEl, inputEl, scrollEl);
                        hideCaretMap.set(componentEl, rmFn);
                    }
                    if (!!scrollEl && scrollAssist && !scrollAssistMap.has(componentEl)) {
                        rmFn = enableScrollAssist(componentEl, inputEl, scrollEl, keyboardHeight);
                        scrollAssistMap.set(componentEl, rmFn);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var unregisterInput = function (componentEl) {
        if (hideCaret) {
            var fn = hideCaretMap.get(componentEl);
            if (fn) {
                fn();
            }
            hideCaretMap.delete(componentEl);
        }
        if (scrollAssist) {
            var fn = scrollAssistMap.get(componentEl);
            if (fn) {
                fn();
            }
            scrollAssistMap.delete(componentEl);
        }
    };
    if (inputBlurring && INPUT_BLURRING) {
        enableInputBlurring();
    }
    if (scrollPadding && SCROLL_PADDING) {
        enableScrollPadding(keyboardHeight);
    }
    // Input might be already loaded in the DOM before ion-device-hacks did.
    // At this point we need to look for all of the inputs not registered yet
    // and register them.
    for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
        var input = inputs_1[_i];
        registerInput(input);
    }
    doc.addEventListener('ionInputDidLoad', (function (ev) {
        registerInput(ev.detail);
    }));
    doc.addEventListener('ionInputDidUnload', (function (ev) {
        unregisterInput(ev.detail);
    }));
};
export { startInputShims };
