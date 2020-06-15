import { r as registerInstance, h, H as Host, d as getElement } from './index-12ee0265.js';
import { g as getIonMode } from './ionic-global-9ae0f2dd.js';
var selectOptionCss = ":host{display:none}";
var SelectOption = /** @class */ (function () {
    function SelectOption(hostRef) {
        registerInstance(this, hostRef);
        this.inputId = "ion-selopt-" + selectOptionIds++;
        /**
         * If `true`, the user cannot interact with the select option.
         */
        this.disabled = false;
    }
    SelectOption.prototype.render = function () {
        return (h(Host, { role: "option", id: this.inputId, class: getIonMode(this) }));
    };
    Object.defineProperty(SelectOption.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return SelectOption;
}());
var selectOptionIds = 0;
SelectOption.style = selectOptionCss;
export { SelectOption as ion_select_option };
