import { r as registerInstance, h, H as Host } from './index-12ee0265.js';
import { g as getIonMode } from './ionic-global-9ae0f2dd.js';
import { c as createColorClasses } from './theme-74c22054.js';
var cardSubtitleIosCss = ":host{display:block;position:relative;color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-600, #666666);margin-left:0;margin-right:0;margin-top:0;margin-bottom:4px;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;font-size:12px;font-weight:700;letter-spacing:0.4px;text-transform:uppercase}";
var cardSubtitleMdCss = ":host{display:block;position:relative;color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-550, #737373);margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;font-size:14px;font-weight:500}";
var CardSubtitle = /** @class */ (function () {
    function CardSubtitle(hostRef) {
        registerInstance(this, hostRef);
    }
    CardSubtitle.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        return (h(Host, { role: "heading", "aria-level": "3", class: Object.assign(Object.assign({}, createColorClasses(this.color)), (_a = { 'ion-inherit-color': true }, _a[mode] = true, _a)) }, h("slot", null)));
    };
    return CardSubtitle;
}());
CardSubtitle.style = {
    /*STENCIL:MODE:ios*/ ios: cardSubtitleIosCss,
    /*STENCIL:MODE:md*/ md: cardSubtitleMdCss
};
export { CardSubtitle as ion_card_subtitle };
