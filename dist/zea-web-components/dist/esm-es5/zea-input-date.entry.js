import { r as registerInstance, h } from './index-12ee0265.js';
var zeaInputDateCss = ".zea-input-date{color:var(--color-freground-1)}";
var ZeaInputDate = /** @class */ (function () {
    function ZeaInputDate(hostRef) {
        registerInstance(this, hostRef);
        /**
         * A test prop.
         */
        this.test = 'Hello World';
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    ZeaInputDate.prototype.render = function () {
        return h("div", { class: "zea-input-date" }, this.test);
    };
    return ZeaInputDate;
}());
ZeaInputDate.style = zeaInputDateCss;
export { ZeaInputDate as zea_input_date };
