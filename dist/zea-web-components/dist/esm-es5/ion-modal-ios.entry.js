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
import { g as getIonMode, c as config } from './ionic-global-9ae0f2dd.js';
import './hardware-back-button-24485eb0.js';
import { B as BACKDROP, p as prepareOverlay, a as present, c as activeAnimations, d as dismiss, e as eventMethod } from './overlays-1f4ea29b.js';
import { g as getClassMap } from './theme-74c22054.js';
import { c as clamp } from './helpers-4a6bd295.js';
import { c as createAnimation } from './animation-b77f81ea.js';
import { g as getTimeGivenProgression } from './cubic-bezier-89113939.js';
import { createGesture } from './index-66808674.js';
import { a as attachComponent, d as detachComponent } from './framework-delegate-7af2c551.js';
import { d as deepReady } from './index-ba19a727.js';
// Defaults for the card swipe animation
var SwipeToCloseDefaults = {
    MIN_PRESENTING_SCALE: 0.93,
};
var createSwipeToCloseGesture = function (el, animation, onDismiss) {
    var height = el.offsetHeight;
    var isOpen = false;
    var canStart = function (detail) {
        var target = detail.event.target;
        if (target === null ||
            !target.closest) {
            return true;
        }
        var content = target.closest('ion-content');
        if (content === null) {
            return true;
        }
        // Target is in the content so we don't start the gesture.
        // We could be more nuanced here and allow it for content that
        // does not need to scroll.
        return false;
    };
    var onStart = function () {
        animation.progressStart(true, (isOpen) ? 1 : 0);
    };
    var onMove = function (detail) {
        var step = detail.deltaY / height;
        if (step < 0) {
            return;
        }
        animation.progressStep(step);
    };
    var onEnd = function (detail) {
        var velocity = detail.velocityY;
        var step = detail.deltaY / height;
        if (step < 0) {
            return;
        }
        var threshold = (detail.deltaY + velocity * 1000) / height;
        var shouldComplete = threshold >= 0.5;
        var newStepValue = (shouldComplete) ? -0.001 : 0.001;
        if (!shouldComplete) {
            animation.easing('cubic-bezier(1, 0, 0.68, 0.28)');
            newStepValue += getTimeGivenProgression([0, 0], [1, 0], [0.68, 0.28], [1, 1], step)[0];
        }
        else {
            animation.easing('cubic-bezier(0.32, 0.72, 0, 1)');
            newStepValue += getTimeGivenProgression([0, 0], [0.32, 0.72], [0, 1], [1, 1], step)[0];
        }
        var duration = (shouldComplete) ? computeDuration(step * height, velocity) : computeDuration((1 - step) * height, velocity);
        isOpen = shouldComplete;
        gesture.enable(false);
        animation
            .onFinish(function () {
            if (!shouldComplete) {
                gesture.enable(true);
            }
        })
            .progressEnd((shouldComplete) ? 1 : 0, newStepValue, duration);
        if (shouldComplete) {
            onDismiss();
        }
    };
    var gesture = createGesture({
        el: el,
        gestureName: 'modalSwipeToClose',
        gesturePriority: 40,
        direction: 'y',
        threshold: 10,
        canStart: canStart,
        onStart: onStart,
        onMove: onMove,
        onEnd: onEnd
    });
    return gesture;
};
var computeDuration = function (remaining, velocity) {
    return clamp(400, remaining / Math.abs(velocity * 1.1), 500);
};
/**
 * iOS Modal Enter Animation for the Card presentation style
 */
var iosEnterAnimation = function (baseEl, presentingEl) {
    var backdropAnimation = createAnimation()
        .addElement(baseEl.querySelector('ion-backdrop'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)')
        .beforeStyles({
        'pointer-events': 'none'
    })
        .afterClearStyles(['pointer-events']);
    var wrapperAnimation = createAnimation()
        .addElement(baseEl.querySelectorAll('.modal-wrapper, .modal-shadow'))
        .beforeStyles({ 'opacity': 1 })
        .fromTo('transform', 'translateY(100vh)', 'translateY(0vh)');
    var baseAnimation = createAnimation()
        .addElement(baseEl)
        .easing('cubic-bezier(0.32,0.72,0,1)')
        .duration(500)
        .addAnimation(wrapperAnimation);
    if (presentingEl) {
        var isMobile = window.innerWidth < 768;
        var hasCardModal = (presentingEl.tagName === 'ION-MODAL' && presentingEl.presentingElement !== undefined);
        var presentingAnimation = createAnimation()
            .beforeStyles({
            'transform': 'translateY(0)',
            'transform-origin': 'top center',
            'overflow': 'hidden'
        });
        var bodyEl_1 = document.body;
        if (isMobile) {
            /**
             * Fallback for browsers that does not support `max()` (ex: Firefox)
             * No need to worry about statusbar padding since engines like Gecko
             * are not used as the engine for standlone Cordova/Capacitor apps
             */
            var transformOffset = (!CSS.supports('width', 'max(0px, 1px)')) ? '30px' : 'max(30px, var(--ion-safe-area-top))';
            var modalTransform = hasCardModal ? '-10px' : transformOffset;
            var toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
            var finalTransform = "translateY(" + modalTransform + ") scale(" + toPresentingScale + ")";
            presentingAnimation
                .afterStyles({
                'transform': finalTransform
            })
                .beforeAddWrite(function () { return bodyEl_1.style.setProperty('background-color', 'black'); })
                .addElement(presentingEl)
                .keyframes([
                { offset: 0, filter: 'contrast(1)', transform: 'translateY(0px) scale(1)', borderRadius: '0px' },
                { offset: 1, filter: 'contrast(0.85)', transform: finalTransform, borderRadius: '10px 10px 0 0' }
            ]);
            baseAnimation.addAnimation(presentingAnimation);
        }
        else {
            baseAnimation.addAnimation(backdropAnimation);
            if (!hasCardModal) {
                wrapperAnimation.fromTo('opacity', '0', '1');
            }
            else {
                var toPresentingScale = (hasCardModal) ? SwipeToCloseDefaults.MIN_PRESENTING_SCALE : 1;
                var finalTransform = "translateY(-10px) scale(" + toPresentingScale + ")";
                presentingAnimation
                    .afterStyles({
                    'transform': finalTransform
                })
                    .addElement(presentingEl.querySelector('.modal-wrapper'))
                    .keyframes([
                    { offset: 0, filter: 'contrast(1)', transform: 'translateY(0) scale(1)' },
                    { offset: 1, filter: 'contrast(0.85)', transform: finalTransform }
                ]);
                var shadowAnimation = createAnimation()
                    .afterStyles({
                    'transform': finalTransform
                })
                    .addElement(presentingEl.querySelector('.modal-shadow'))
                    .keyframes([
                    { offset: 0, opacity: '1', transform: 'translateY(0) scale(1)' },
                    { offset: 1, opacity: '0', transform: finalTransform }
                ]);
                baseAnimation.addAnimation([presentingAnimation, shadowAnimation]);
            }
        }
    }
    else {
        baseAnimation.addAnimation(backdropAnimation);
    }
    return baseAnimation;
};
/**
 * iOS Modal Leave Animation
 */
var iosLeaveAnimation = function (baseEl, presentingEl, duration) {
    if (duration === void 0) { duration = 500; }
    var backdropAnimation = createAnimation()
        .addElement(baseEl.querySelector('ion-backdrop'))
        .fromTo('opacity', 'var(--backdrop-opacity)', 0.0);
    var wrapperAnimation = createAnimation()
        .addElement(baseEl.querySelectorAll('.modal-wrapper, .modal-shadow'))
        .beforeStyles({ 'opacity': 1 })
        .fromTo('transform', 'translateY(0vh)', 'translateY(100vh)');
    var baseAnimation = createAnimation()
        .addElement(baseEl)
        .easing('cubic-bezier(0.32,0.72,0,1)')
        .duration(duration)
        .addAnimation(wrapperAnimation);
    if (presentingEl) {
        var isMobile = window.innerWidth < 768;
        var hasCardModal = (presentingEl.tagName === 'ION-MODAL' && presentingEl.presentingElement !== undefined);
        var presentingAnimation = createAnimation()
            .beforeClearStyles(['transform'])
            .afterClearStyles(['transform'])
            .onFinish(function (currentStep) {
            // only reset background color if this is the last card-style modal
            if (currentStep !== 1) {
                return;
            }
            presentingEl.style.setProperty('overflow', '');
            var numModals = Array.from(bodyEl_2.querySelectorAll('ion-modal')).filter(function (m) { return m.presentingElement !== undefined; }).length;
            if (numModals <= 1) {
                bodyEl_2.style.setProperty('background-color', '');
            }
        });
        var bodyEl_2 = document.body;
        if (isMobile) {
            var transformOffset = (!CSS.supports('width', 'max(0px, 1px)')) ? '30px' : 'max(30px, var(--ion-safe-area-top))';
            var modalTransform = hasCardModal ? '-10px' : transformOffset;
            var toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
            var finalTransform = "translateY(" + modalTransform + ") scale(" + toPresentingScale + ")";
            presentingAnimation
                .addElement(presentingEl)
                .keyframes([
                { offset: 0, filter: 'contrast(0.85)', transform: finalTransform, borderRadius: '10px 10px 0 0' },
                { offset: 1, filter: 'contrast(1)', transform: 'translateY(0px) scale(1)', borderRadius: '0px' }
            ]);
            baseAnimation.addAnimation(presentingAnimation);
        }
        else {
            baseAnimation.addAnimation(backdropAnimation);
            if (!hasCardModal) {
                wrapperAnimation.fromTo('opacity', '1', '0');
            }
            else {
                var toPresentingScale = (hasCardModal) ? SwipeToCloseDefaults.MIN_PRESENTING_SCALE : 1;
                var finalTransform = "translateY(-10px) scale(" + toPresentingScale + ")";
                presentingAnimation
                    .addElement(presentingEl.querySelector('.modal-wrapper'))
                    .afterStyles({
                    'transform': 'translate3d(0, 0, 0)'
                })
                    .keyframes([
                    { offset: 0, filter: 'contrast(0.85)', transform: finalTransform },
                    { offset: 1, filter: 'contrast(1)', transform: 'translateY(0) scale(1)' }
                ]);
                var shadowAnimation = createAnimation()
                    .addElement(presentingEl.querySelector('.modal-shadow'))
                    .afterStyles({
                    'transform': 'translateY(0) scale(1)'
                })
                    .keyframes([
                    { offset: 0, opacity: '0', transform: finalTransform },
                    { offset: 1, opacity: '1', transform: 'translateY(0) scale(1)' }
                ]);
                baseAnimation.addAnimation([presentingAnimation, shadowAnimation]);
            }
        }
    }
    else {
        baseAnimation.addAnimation(backdropAnimation);
    }
    return baseAnimation;
};
/**
 * Md Modal Enter Animation
 */
var mdEnterAnimation = function (baseEl) {
    var baseAnimation = createAnimation();
    var backdropAnimation = createAnimation();
    var wrapperAnimation = createAnimation();
    backdropAnimation
        .addElement(baseEl.querySelector('ion-backdrop'))
        .fromTo('opacity', 0.01, 'var(--backdrop-opacity)')
        .beforeStyles({
        'pointer-events': 'none'
    })
        .afterClearStyles(['pointer-events']);
    wrapperAnimation
        .addElement(baseEl.querySelector('.modal-wrapper'))
        .keyframes([
        { offset: 0, opacity: 0.01, transform: 'translateY(40px)' },
        { offset: 1, opacity: 1, transform: 'translateY(0px)' }
    ]);
    return baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(280)
        .addAnimation([backdropAnimation, wrapperAnimation]);
};
/**
 * Md Modal Leave Animation
 */
var mdLeaveAnimation = function (baseEl) {
    var baseAnimation = createAnimation();
    var backdropAnimation = createAnimation();
    var wrapperAnimation = createAnimation();
    var wrapperEl = baseEl.querySelector('.modal-wrapper');
    backdropAnimation
        .addElement(baseEl.querySelector('ion-backdrop'))
        .fromTo('opacity', 'var(--backdrop-opacity)', 0.0);
    wrapperAnimation
        .addElement(wrapperEl)
        .keyframes([
        { offset: 0, opacity: 0.99, transform: 'translateY(0px)' },
        { offset: 1, opacity: 0, transform: 'translateY(40px)' }
    ]);
    return baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.47,0,0.745,0.715)')
        .duration(200)
        .addAnimation([backdropAnimation, wrapperAnimation]);
};
var modalIosCss = ".sc-ion-modal-ios-h{--width:100%;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--overflow:hidden;--border-radius:0;--border-width:0;--border-style:none;--border-color:transparent;--background:var(--ion-background-color, #fff);--box-shadow:none;--backdrop-opacity:0;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;contain:strict}.overlay-hidden.sc-ion-modal-ios-h{display:none}.modal-wrapper.sc-ion-modal-ios,.modal-shadow.sc-ion-modal-ios{border-radius:var(--border-radius);width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow);overflow:var(--overflow);z-index:10}.modal-shadow.sc-ion-modal-ios{position:absolute;background:transparent}@media only screen and (min-width: 768px) and (min-height: 600px){.sc-ion-modal-ios-h{--width:600px;--height:500px;--ion-safe-area-top:0px;--ion-safe-area-bottom:0px;--ion-safe-area-right:0px;--ion-safe-area-left:0px}}@media only screen and (min-width: 768px) and (min-height: 768px){.sc-ion-modal-ios-h{--width:600px;--height:600px}}.sc-ion-modal-ios-h:first-of-type{--backdrop-opacity:var(--ion-backdrop-opacity, 0.4)}@media only screen and (min-width: 768px) and (min-height: 600px){.sc-ion-modal-ios-h{--border-radius:10px}}.modal-wrapper.sc-ion-modal-ios{-webkit-transform:translate3d(0,  100%,  0);transform:translate3d(0,  100%,  0)}@media screen and (max-width: 767px){@supports (width: max(0px, 1px)){.modal-card.sc-ion-modal-ios-h .modal-wrapper.sc-ion-modal-ios{height:calc(100% - max(30px, var(--ion-safe-area-top)) - 10px)}}@supports not (width: max(0px, 1px)){.modal-card.sc-ion-modal-ios-h .modal-wrapper.sc-ion-modal-ios{height:calc(100% - 40px)}}.modal-card.sc-ion-modal-ios-h .modal-wrapper.sc-ion-modal-ios{border-top-left-radius:10px;border-top-right-radius:10px;border-bottom-right-radius:0;border-bottom-left-radius:0}[dir=rtl].sc-ion-modal-ios-h -no-combinator.modal-card.sc-ion-modal-ios-h .modal-wrapper.sc-ion-modal-ios,[dir=rtl] .sc-ion-modal-ios-h -no-combinator.modal-card.sc-ion-modal-ios-h .modal-wrapper.sc-ion-modal-ios,[dir=rtl].modal-card.sc-ion-modal-ios-h .modal-wrapper.sc-ion-modal-ios,[dir=rtl] .modal-card.sc-ion-modal-ios-h .modal-wrapper.sc-ion-modal-ios{border-top-left-radius:10px;border-top-right-radius:10px;border-bottom-right-radius:0;border-bottom-left-radius:0}.modal-card.sc-ion-modal-ios-h{--backdrop-opacity:0;--width:100%;-ms-flex-align:end;align-items:flex-end}.modal-card.sc-ion-modal-ios-h .modal-shadow.sc-ion-modal-ios{display:none}.modal-card.sc-ion-modal-ios-h ion-backdrop.sc-ion-modal-ios{pointer-events:none}}@media screen and (min-width: 768px){.modal-card.sc-ion-modal-ios-h{--width:calc(100% - 120px);--height:calc(100% - (120px + var(--ion-safe-area-top) + var(--ion-safe-area-bottom)));--max-width:720px;--max-height:1000px}.modal-card.sc-ion-modal-ios-h{--backdrop-opacity:0;-webkit-transition:all 0.5s ease-in-out;transition:all 0.5s ease-in-out}.modal-card.sc-ion-modal-ios-h:first-of-type{--backdrop-opacity:0.18}.modal-card.sc-ion-modal-ios-h .modal-shadow.sc-ion-modal-ios{-webkit-box-shadow:0px 0px 30px 10px rgba(0, 0, 0, 0.1);box-shadow:0px 0px 30px 10px rgba(0, 0, 0, 0.1)}}";
var modalMdCss = ".sc-ion-modal-md-h{--width:100%;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--overflow:hidden;--border-radius:0;--border-width:0;--border-style:none;--border-color:transparent;--background:var(--ion-background-color, #fff);--box-shadow:none;--backdrop-opacity:0;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;contain:strict}.overlay-hidden.sc-ion-modal-md-h{display:none}.modal-wrapper.sc-ion-modal-md,.modal-shadow.sc-ion-modal-md{border-radius:var(--border-radius);width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow);overflow:var(--overflow);z-index:10}.modal-shadow.sc-ion-modal-md{position:absolute;background:transparent}@media only screen and (min-width: 768px) and (min-height: 600px){.sc-ion-modal-md-h{--width:600px;--height:500px;--ion-safe-area-top:0px;--ion-safe-area-bottom:0px;--ion-safe-area-right:0px;--ion-safe-area-left:0px}}@media only screen and (min-width: 768px) and (min-height: 768px){.sc-ion-modal-md-h{--width:600px;--height:600px}}.sc-ion-modal-md-h:first-of-type{--backdrop-opacity:var(--ion-backdrop-opacity, 0.32)}@media only screen and (min-width: 768px) and (min-height: 600px){.sc-ion-modal-md-h{--border-radius:2px}.sc-ion-modal-md-h:first-of-type{--box-shadow:0 28px 48px rgba(0, 0, 0, 0.4)}}.modal-wrapper.sc-ion-modal-md{-webkit-transform:translate3d(0,  40px,  0);transform:translate3d(0,  40px,  0);opacity:0.01}";
var Modal = /** @class */ (function () {
    function class_1(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        // Whether or not modal is being dismissed via gesture
        this.gestureAnimationDismissing = false;
        this.presented = false;
        /**
         * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
         */
        this.keyboardClose = true;
        /**
         * If `true`, the modal will be dismissed when the backdrop is clicked.
         */
        this.backdropDismiss = true;
        /**
         * If `true`, a backdrop will be displayed behind the modal.
         */
        this.showBackdrop = true;
        /**
         * If `true`, the modal will animate.
         */
        this.animated = true;
        /**
         * If `true`, the modal can be swiped to dismiss. Only applies in iOS mode.
         */
        this.swipeToClose = false;
        this.onBackdropTap = function () {
            _this.dismiss(undefined, BACKDROP);
        };
        this.onDismiss = function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            _this.dismiss();
        };
        this.onLifecycle = function (modalEvent) {
            var el = _this.usersElement;
            var name = LIFECYCLE_MAP[modalEvent.type];
            if (el && name) {
                var ev = new CustomEvent(name, {
                    bubbles: false,
                    cancelable: false,
                    detail: modalEvent.detail
                });
                el.dispatchEvent(ev);
            }
        };
        prepareOverlay(this.el);
        this.didPresent = createEvent(this, "ionModalDidPresent", 7);
        this.willPresent = createEvent(this, "ionModalWillPresent", 7);
        this.willDismiss = createEvent(this, "ionModalWillDismiss", 7);
        this.didDismiss = createEvent(this, "ionModalDidDismiss", 7);
    }
    /**
     * Present the modal overlay after it has been created.
     */
    class_1.prototype.present = function () {
        return __awaiter(this, void 0, void 0, function () {
            var container, componentProps, _a, mode, animationBuilder, ani;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.presented) {
                            return [2 /*return*/];
                        }
                        container = this.el.querySelector(".modal-wrapper");
                        if (!container) {
                            throw new Error('container is undefined');
                        }
                        componentProps = Object.assign(Object.assign({}, this.componentProps), { modal: this.el });
                        _a = this;
                        return [4 /*yield*/, attachComponent(this.delegate, container, this.component, ['ion-page'], componentProps)];
                    case 1:
                        _a.usersElement = _b.sent();
                        return [4 /*yield*/, deepReady(this.usersElement)];
                    case 2:
                        _b.sent();
                        writeTask(function () { return _this.el.classList.add('show-modal'); });
                        return [4 /*yield*/, present(this, 'modalEnter', iosEnterAnimation, mdEnterAnimation, this.presentingElement)];
                    case 3:
                        _b.sent();
                        mode = getIonMode(this);
                        if (this.swipeToClose && mode === 'ios') {
                            animationBuilder = this.leaveAnimation || config.get('modalLeave', iosLeaveAnimation);
                            ani = this.animation = animationBuilder(this.el, this.presentingElement);
                            this.gesture = createSwipeToCloseGesture(this.el, ani, function () {
                                /**
                                 * While the gesture animation is finishing
                                 * it is possible for a user to tap the backdrop.
                                 * This would result in the dismiss animation
                                 * being played again. Typically this is avoided
                                 * by setting `presented = false` on the overlay
                                 * component; however, we cannot do that here as
                                 * that would prevent the element from being
                                 * removed from the DOM.
                                 */
                                _this.gestureAnimationDismissing = true;
                                _this.animation.onFinish(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.dismiss(undefined, 'gesture')];
                                            case 1:
                                                _a.sent();
                                                this.gestureAnimationDismissing = false;
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            });
                            this.gesture.enable(true);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Dismiss the modal overlay after it has been presented.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the modal. For example, 'cancel' or 'backdrop'.
     */
    class_1.prototype.dismiss = function (data, role) {
        return __awaiter(this, void 0, void 0, function () {
            var enteringAnimation, dismissed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.gestureAnimationDismissing && role !== 'gesture') {
                            return [2 /*return*/, false];
                        }
                        enteringAnimation = activeAnimations.get(this) || [];
                        return [4 /*yield*/, dismiss(this, data, role, 'modalLeave', iosLeaveAnimation, mdLeaveAnimation, this.presentingElement)];
                    case 1:
                        dismissed = _a.sent();
                        if (!dismissed) return [3 /*break*/, 3];
                        return [4 /*yield*/, detachComponent(this.delegate, this.usersElement)];
                    case 2:
                        _a.sent();
                        if (this.animation) {
                            this.animation.destroy();
                        }
                        enteringAnimation.forEach(function (ani) { return ani.destroy(); });
                        _a.label = 3;
                    case 3:
                        this.animation = undefined;
                        return [2 /*return*/, dismissed];
                }
            });
        });
    };
    /**
     * Returns a promise that resolves when the modal did dismiss.
     */
    class_1.prototype.onDidDismiss = function () {
        return eventMethod(this.el, 'ionModalDidDismiss');
    };
    /**
     * Returns a promise that resolves when the modal will dismiss.
     */
    class_1.prototype.onWillDismiss = function () {
        return eventMethod(this.el, 'ionModalWillDismiss');
    };
    class_1.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        return (h(Host, { "no-router": true, "aria-modal": "true", class: Object.assign((_a = {}, _a[mode] = true, _a["modal-card"] = this.presentingElement !== undefined && mode === 'ios', _a), getClassMap(this.cssClass)), style: {
                zIndex: "" + (20000 + this.overlayIndex),
            }, onIonBackdropTap: this.onBackdropTap, onIonDismiss: this.onDismiss, onIonModalDidPresent: this.onLifecycle, onIonModalWillPresent: this.onLifecycle, onIonModalWillDismiss: this.onLifecycle, onIonModalDidDismiss: this.onLifecycle }, h("ion-backdrop", { visible: this.showBackdrop, tappable: this.backdropDismiss }), mode === 'ios' && h("div", { class: "modal-shadow" }), h("div", { role: "dialog", class: "modal-wrapper" })));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
var LIFECYCLE_MAP = {
    'ionModalDidPresent': 'ionViewDidEnter',
    'ionModalWillPresent': 'ionViewWillEnter',
    'ionModalWillDismiss': 'ionViewWillLeave',
    'ionModalDidDismiss': 'ionViewDidLeave',
};
Modal.style = {
    /*STENCIL:MODE:ios*/ ios: modalIosCss,
    /*STENCIL:MODE:md*/ md: modalMdCss
};
export { Modal as ion_modal };
