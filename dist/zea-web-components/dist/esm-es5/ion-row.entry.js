import { r as registerInstance, h, H as Host } from './index-12ee0265.js';
import { g as getIonMode } from './ionic-global-9ae0f2dd.js';
var rowCss = ":host{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}";
var Row = /** @class */ (function () {
    function Row(hostRef) {
        registerInstance(this, hostRef);
    }
    Row.prototype.render = function () {
        return (h(Host, { class: getIonMode(this) }, h("slot", null)));
    };
    return Row;
}());
Row.style = rowCss;
export { Row as ion_row };
