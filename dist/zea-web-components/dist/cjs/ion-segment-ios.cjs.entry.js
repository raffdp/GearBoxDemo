'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');
const ionicGlobal = require('./ionic-global-63aa0afb.js');
const theme = require('./theme-81caa5b0.js');
const helpers = require('./helpers-41dfb43a.js');

const segmentIosCss = ":host{--ripple-color:currentColor;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:stretch;align-items:stretch;-ms-flex-pack:center;justify-content:center;width:100%;background:var(--background);font-family:var(--ion-font-family, inherit);text-align:center;contain:paint}:host(.segment-scrollable){-ms-flex-pack:start;justify-content:start;width:auto;overflow-x:auto}:host(.segment-scrollable::-webkit-scrollbar){display:none}:host{--background:rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.065);border-radius:8px;overflow:hidden;z-index:0}:host(.ion-color){background:rgba(var(--ion-color-base-rgb), 0.065)}:host(.in-toolbar){margin-left:auto;margin-right:auto;margin-top:0;margin-bottom:0;width:auto}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host(.in-toolbar){margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}:host(.in-toolbar:not(.ion-color)){background:var(--ion-toolbar-segment-background, var(--background))}:host(.in-toolbar-color:not(.ion-color)){background:rgba(var(--ion-color-contrast-rgb), 0.11)}";

const segmentMdCss = ":host{--ripple-color:currentColor;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:stretch;align-items:stretch;-ms-flex-pack:center;justify-content:center;width:100%;background:var(--background);font-family:var(--ion-font-family, inherit);text-align:center;contain:paint}:host(.segment-scrollable){-ms-flex-pack:start;justify-content:start;width:auto;overflow-x:auto}:host(.segment-scrollable::-webkit-scrollbar){display:none}:host{--background:transparent}:host(.segment-scrollable) ::slotted(ion-segment-button){min-width:auto}";

const Segment = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
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
        this.onClick = (ev) => {
            const current = ev.target;
            const previous = this.checked;
            this.value = current.value;
            if (previous && this.scrollable) {
                this.checkButton(previous, current);
            }
            this.checked = current;
        };
        this.ionChange = index.createEvent(this, "ionChange", 7);
        this.ionSelect = index.createEvent(this, "ionSelect", 7);
        this.ionStyle = index.createEvent(this, "ionStyle", 7);
    }
    valueChanged(value, oldValue) {
        this.ionSelect.emit({ value });
        if (oldValue !== '' || this.didInit) {
            if (!this.activated) {
                this.ionChange.emit({ value });
            }
            else {
                this.valueAfterGesture = value;
            }
        }
    }
    disabledChanged() {
        this.gestureChanged();
        const buttons = this.getButtons();
        for (const button of buttons) {
            button.disabled = this.disabled;
        }
    }
    gestureChanged() {
        if (this.gesture && !this.scrollable) {
            this.gesture.enable(!this.disabled);
        }
    }
    connectedCallback() {
        this.emitStyle();
    }
    componentWillLoad() {
        this.emitStyle();
    }
    async componentDidLoad() {
        this.setCheckedClasses();
        this.gesture = (await new Promise(function (resolve) { resolve(require('./index-973eb760.js')); })).createGesture({
            el: this.el,
            gestureName: 'segment',
            gesturePriority: 100,
            threshold: 0,
            passive: false,
            onStart: ev => this.onStart(ev),
            onMove: ev => this.onMove(ev),
            onEnd: ev => this.onEnd(ev),
        });
        this.gesture.enable(!this.scrollable);
        this.gestureChanged();
        if (this.disabled) {
            this.disabledChanged();
        }
        this.didInit = true;
    }
    onStart(detail) {
        this.activate(detail);
    }
    onMove(detail) {
        this.setNextIndex(detail);
    }
    onEnd(detail) {
        this.setActivated(false);
        const checkedValidButton = this.setNextIndex(detail, true);
        detail.event.stopImmediatePropagation();
        if (checkedValidButton) {
            this.addRipple(detail);
        }
        const value = this.valueAfterGesture;
        if (value !== undefined) {
            this.ionChange.emit({ value });
            this.valueAfterGesture = undefined;
        }
    }
    getButtons() {
        return Array.from(this.el.querySelectorAll('ion-segment-button'));
    }
    /**
     * The gesture blocks the segment button ripple. This
     * function adds the ripple based on the checked segment
     * and where the cursor ended.
     */
    addRipple(detail) {
        const useRippleEffect = ionicGlobal.config.getBoolean('animated', true) && ionicGlobal.config.getBoolean('rippleEffect', true);
        if (!useRippleEffect) {
            return;
        }
        const buttons = this.getButtons();
        const checked = buttons.find(button => button.value === this.value);
        const root = checked.shadowRoot || checked;
        const ripple = root.querySelector('ion-ripple-effect');
        if (!ripple) {
            return;
        }
        const { x, y } = helpers.pointerCoord(detail.event);
        ripple.addRipple(x, y).then(remove => remove());
    }
    /*
     * Activate both the segment and the buttons
     * due to a bug with ::slotted in Safari
     */
    setActivated(activated) {
        const buttons = this.getButtons();
        buttons.forEach(button => {
            if (activated) {
                button.classList.add('segment-button-activated');
            }
            else {
                button.classList.remove('segment-button-activated');
            }
        });
        this.activated = activated;
    }
    activate(detail) {
        const clicked = detail.event.target;
        const buttons = this.getButtons();
        const checked = buttons.find(button => button.value === this.value);
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
    }
    getIndicator(button) {
        const root = button.shadowRoot || button;
        return root.querySelector('.segment-button-indicator');
    }
    checkButton(previous, current) {
        const previousIndicator = this.getIndicator(previous);
        const currentIndicator = this.getIndicator(current);
        if (previousIndicator === null || currentIndicator === null) {
            return;
        }
        const previousClientRect = previousIndicator.getBoundingClientRect();
        const currentClientRect = currentIndicator.getBoundingClientRect();
        const widthDelta = previousClientRect.width / currentClientRect.width;
        const xPosition = previousClientRect.left - currentClientRect.left;
        // Scale the indicator width to match the previous indicator width
        // and translate it on top of the previous indicator
        const transform = `translate3d(${xPosition}px, 0, 0) scaleX(${widthDelta})`;
        index.writeTask(() => {
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
    }
    setCheckedClasses() {
        const buttons = this.getButtons();
        const index = buttons.findIndex(button => button.value === this.value);
        const next = index + 1;
        // Keep track of the currently checked button
        this.checked = buttons.find(button => button.value === this.value);
        for (const button of buttons) {
            button.classList.remove('segment-button-after-checked');
        }
        if (next < buttons.length) {
            buttons[next].classList.add('segment-button-after-checked');
        }
    }
    setNextIndex(detail, isEnd = false) {
        const isRTL = document.dir === 'rtl';
        const activated = this.activated;
        const buttons = this.getButtons();
        const index = buttons.findIndex(button => button.value === this.value);
        const previous = buttons[index];
        let current;
        let nextIndex;
        if (index === -1) {
            return;
        }
        // Get the element that the touch event started on in case
        // it was the checked button, then we will move the indicator
        const rect = previous.getBoundingClientRect();
        const left = rect.left;
        const width = rect.width;
        // Get the element that the gesture is on top of based on the currentX of the
        // gesture event and the Y coordinate of the starting element, since the gesture
        // can move up and down off of the segment
        const currentX = detail.currentX;
        const previousY = rect.top + (rect.height / 2);
        const nextEl = document.elementFromPoint(currentX, previousY);
        const decreaseIndex = isRTL ? currentX > (left + width) : currentX < left;
        const increaseIndex = isRTL ? currentX < left : currentX > (left + width);
        // If the indicator is currently activated then we have started the gesture
        // on top of the checked button so we need to slide the indicator
        // by checking the button next to it as we move
        if (activated && !isEnd) {
            // Decrease index, move left in LTR & right in RTL
            if (decreaseIndex) {
                const newIndex = index - 1;
                if (newIndex >= 0) {
                    nextIndex = newIndex;
                }
                // Increase index, moves right in LTR & left in RTL
            }
            else if (increaseIndex) {
                if (activated && !isEnd) {
                    const newIndex = index + 1;
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
    }
    emitStyle() {
        this.ionStyle.emit({
            'segment': true
        });
    }
    render() {
        const mode = ionicGlobal.getIonMode(this);
        return (index.h(index.Host, { onClick: this.onClick, class: Object.assign(Object.assign({}, theme.createColorClasses(this.color)), { [mode]: true, 'in-toolbar': theme.hostContext('ion-toolbar', this.el), 'in-toolbar-color': theme.hostContext('ion-toolbar[color]', this.el), 'segment-activated': this.activated, 'segment-disabled': this.disabled, 'segment-scrollable': this.scrollable }) }, index.h("slot", null)));
    }
    get el() { return index.getElement(this); }
    static get watchers() { return {
        "value": ["valueChanged"],
        "disabled": ["disabledChanged"]
    }; }
};
Segment.style = {
    /*STENCIL:MODE:ios*/ ios: segmentIosCss,
    /*STENCIL:MODE:md*/ md: segmentMdCss
};

exports.ion_segment = Segment;
