import { r as registerInstance, h, H as Host, d as getElement } from './index-12ee0265.js';
import { g as getIonMode, c as config, a as isPlatform } from './ionic-global-9ae0f2dd.js';
import { s as sanitizeDOMString } from './index-76987070.js';
import { S as SPINNERS } from './spinner-configs-5dd6891e.js';
var RefresherContent = /** @class */ (function () {
    function RefresherContent(hostRef) {
        registerInstance(this, hostRef);
    }
    RefresherContent.prototype.componentWillLoad = function () {
        if (this.pullingIcon === undefined) {
            var mode = getIonMode(this);
            var overflowRefresher = this.el.style.webkitOverflowScrolling !== undefined ? 'lines' : 'arrow-down';
            this.pullingIcon = config.get('refreshingIcon', mode === 'ios' && isPlatform('mobile') ? config.get('spinner', overflowRefresher) : 'circular');
        }
        if (this.refreshingSpinner === undefined) {
            var mode = getIonMode(this);
            this.refreshingSpinner = config.get('refreshingSpinner', config.get('spinner', mode === 'ios' ? 'lines' : 'circular'));
        }
    };
    RefresherContent.prototype.render = function () {
        var pullingIcon = this.pullingIcon;
        var hasSpinner = pullingIcon != null && SPINNERS[pullingIcon] !== undefined;
        var mode = getIonMode(this);
        return (h(Host, { class: mode }, h("div", { class: "refresher-pulling" }, this.pullingIcon && hasSpinner &&
            h("div", { class: "refresher-pulling-icon" }, h("div", { class: "spinner-arrow-container" }, h("ion-spinner", { name: this.pullingIcon, paused: true }), mode === 'md' && this.pullingIcon === 'circular' &&
                h("div", { class: "arrow-container" }, h("ion-icon", { name: "caret-back-sharp" })))), this.pullingIcon && !hasSpinner &&
            h("div", { class: "refresher-pulling-icon" }, h("ion-icon", { icon: this.pullingIcon, lazy: false })), this.pullingText &&
            h("div", { class: "refresher-pulling-text", innerHTML: sanitizeDOMString(this.pullingText) })), h("div", { class: "refresher-refreshing" }, this.refreshingSpinner &&
            h("div", { class: "refresher-refreshing-icon" }, h("ion-spinner", { name: this.refreshingSpinner })), this.refreshingText &&
            h("div", { class: "refresher-refreshing-text", innerHTML: sanitizeDOMString(this.refreshingText) }))));
    };
    Object.defineProperty(RefresherContent.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return RefresherContent;
}());
export { RefresherContent as ion_refresher_content };
