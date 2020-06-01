import { r as registerInstance, h, H as Host } from './index-12ee0265.js';
import { g as getIonMode } from './ionic-global-9ae0f2dd.js';
var avatarIosCss = ":host{border-radius:var(--border-radius);display:block}::slotted(ion-img),::slotted(img){border-radius:var(--border-radius);width:100%;height:100%;-o-object-fit:cover;object-fit:cover;overflow:hidden}:host{--border-radius:50%;width:48px;height:48px}";
var avatarMdCss = ":host{border-radius:var(--border-radius);display:block}::slotted(ion-img),::slotted(img){border-radius:var(--border-radius);width:100%;height:100%;-o-object-fit:cover;object-fit:cover;overflow:hidden}:host{--border-radius:50%;width:64px;height:64px}";
var Avatar = /** @class */ (function () {
    function Avatar(hostRef) {
        registerInstance(this, hostRef);
    }
    Avatar.prototype.render = function () {
        return (h(Host, { class: getIonMode(this) }, h("slot", null)));
    };
    return Avatar;
}());
Avatar.style = {
    /*STENCIL:MODE:ios*/ ios: avatarIosCss,
    /*STENCIL:MODE:md*/ md: avatarMdCss
};
export { Avatar as ion_avatar };
