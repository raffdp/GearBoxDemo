import { r as registerInstance, h } from './index-12ee0265.js';
var zeaInputPhotoCss = ".zea-input-photo{color:var(--color-freground-1)}";
var ZeaInputPhoto = /** @class */ (function () {
    function ZeaInputPhoto(hostRef) {
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
    ZeaInputPhoto.prototype.render = function () {
        return h("div", { class: "zea-input-photo" }, this.test);
    };
    return ZeaInputPhoto;
}());
ZeaInputPhoto.style = zeaInputPhotoCss;
export { ZeaInputPhoto as zea_input_photo };
