import { r as registerInstance, h, H as Host } from './index-12ee0265.js';
import { g as getIonMode } from './ionic-global-9ae0f2dd.js';
var thumbnailCss = ":host{--size:48px;--border-radius:0;border-radius:var(--border-radius);display:block;width:var(--size);height:var(--size)}::slotted(ion-img),::slotted(img){border-radius:var(--border-radius);width:100%;height:100%;-o-object-fit:cover;object-fit:cover;overflow:hidden}";
var Thumbnail = /** @class */ (function () {
    function Thumbnail(hostRef) {
        registerInstance(this, hostRef);
    }
    Thumbnail.prototype.render = function () {
        return (h(Host, { class: getIonMode(this) }, h("slot", null)));
    };
    return Thumbnail;
}());
Thumbnail.style = thumbnailCss;
export { Thumbnail as ion_thumbnail };
