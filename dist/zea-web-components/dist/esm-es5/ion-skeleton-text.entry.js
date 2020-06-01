import { r as registerInstance, h, H as Host, d as getElement } from './index-12ee0265.js';
import { c as config, g as getIonMode } from './ionic-global-9ae0f2dd.js';
import { h as hostContext } from './theme-74c22054.js';
var skeletonTextCss = ":host{--background:rgba(var(--background-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.065);border-radius:var(--border-radius, inherit);display:block;width:100%;height:inherit;margin-top:4px;margin-bottom:4px;background:var(--background);line-height:10px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}span{display:inline-block}:host(.in-media){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;height:100%}:host(.skeleton-text-animated){position:relative;background:-webkit-gradient(linear, left top, right top, color-stop(8%, rgba(var(--background-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.065)), color-stop(18%, rgba(var(--background-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.135)), color-stop(33%, rgba(var(--background-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.065)));background:linear-gradient(to right, rgba(var(--background-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.065) 8%, rgba(var(--background-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.135) 18%, rgba(var(--background-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.065) 33%);background-size:800px 104px;-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-name:shimmer;animation-name:shimmer;-webkit-animation-timing-function:linear;animation-timing-function:linear}@-webkit-keyframes shimmer{0%{background-position:-468px 0}100%{background-position:468px 0}}@keyframes shimmer{0%{background-position:-468px 0}100%{background-position:468px 0}}";
var SkeletonText = /** @class */ (function () {
    function SkeletonText(hostRef) {
        registerInstance(this, hostRef);
        /**
         * If `true`, the skeleton text will animate.
         */
        this.animated = false;
    }
    SkeletonText.prototype.render = function () {
        var _a;
        var animated = this.animated && config.getBoolean('animated', true);
        var inMedia = hostContext('ion-avatar', this.el) || hostContext('ion-thumbnail', this.el);
        var mode = getIonMode(this);
        return (h(Host, { class: (_a = {},
                _a[mode] = true,
                _a['skeleton-text-animated'] = animated,
                _a['in-media'] = inMedia,
                _a) }, h("span", null, "\u00A0")));
    };
    Object.defineProperty(SkeletonText.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return SkeletonText;
}());
SkeletonText.style = skeletonTextCss;
export { SkeletonText as ion_skeleton_text };
