import { r as registerInstance, h, H as Host } from './index-12ee0265.js';
import { g as getIonMode } from './ionic-global-9ae0f2dd.js';
import { c as createColorClasses } from './theme-74c22054.js';
var textCss = ":host(.ion-color){color:var(--ion-color-base)}";
var Text = /** @class */ (function () {
    function Text(hostRef) {
        registerInstance(this, hostRef);
    }
    Text.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), (_a = {}, _a[mode] = true, _a)) }, h("slot", null)));
    };
    return Text;
}());
Text.style = textCss;
export { Text as ion_text };
