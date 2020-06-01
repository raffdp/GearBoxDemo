import { r as registerInstance, h, H as Host } from './index-12ee0265.js';
import { g as getIonMode } from './ionic-global-9ae0f2dd.js';
var reorderIosCss = ":host([slot]){display:none;line-height:0;z-index:100}.reorder-icon{display:block;font-size:22px}.reorder-icon{font-size:34px;opacity:0.4}";
var reorderMdCss = ":host([slot]){display:none;line-height:0;z-index:100}.reorder-icon{display:block;font-size:22px}.reorder-icon{font-size:31px;opacity:0.3}";
var Reorder = /** @class */ (function () {
    function Reorder(hostRef) {
        registerInstance(this, hostRef);
    }
    Reorder.prototype.onClick = function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
    };
    Reorder.prototype.render = function () {
        var mode = getIonMode(this);
        var reorderIcon = mode === 'ios' ? 'reorder-three-outline' : 'reorder-two-sharp';
        return (h(Host, { class: mode }, h("slot", null, h("ion-icon", { name: reorderIcon, lazy: false, class: "reorder-icon" }))));
    };
    return Reorder;
}());
Reorder.style = {
    /*STENCIL:MODE:ios*/ ios: reorderIosCss,
    /*STENCIL:MODE:md*/ md: reorderMdCss
};
export { Reorder as ion_reorder };
