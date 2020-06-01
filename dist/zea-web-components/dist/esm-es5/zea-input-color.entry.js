import { r as registerInstance, h } from './index-12ee0265.js';
var zeaInputColorCss = ".zea-input-color{color:var(--color-freground-1)}";
var ZeaInputColor = /** @class */ (function () {
    function ZeaInputColor(hostRef) {
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
    ZeaInputColor.prototype.render = function () {
        return h("div", { class: "zea-input-color" }, this.test);
    };
    return ZeaInputColor;
}());
ZeaInputColor.style = zeaInputColorCss;
export { ZeaInputColor as zea_input_color };
