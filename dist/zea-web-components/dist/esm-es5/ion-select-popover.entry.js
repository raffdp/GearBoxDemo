import { r as registerInstance, h, H as Host } from './index-12ee0265.js';
import { g as getIonMode } from './ionic-global-9ae0f2dd.js';
import './hardware-back-button-24485eb0.js';
import { s as safeCall } from './overlays-1f4ea29b.js';
var selectPopoverCss = ".sc-ion-select-popover-h ion-list.sc-ion-select-popover{margin-left:0;margin-right:0;margin-top:-1px;margin-bottom:-1px}.sc-ion-select-popover-h ion-list-header.sc-ion-select-popover,.sc-ion-select-popover-h ion-label.sc-ion-select-popover{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}";
var SelectPopover = /** @class */ (function () {
    function SelectPopover(hostRef) {
        registerInstance(this, hostRef);
        /** Array of options for the popover */
        this.options = [];
    }
    SelectPopover.prototype.onSelect = function (ev) {
        var option = this.options.find(function (o) { return o.value === ev.target.value; });
        if (option) {
            safeCall(option.handler);
        }
    };
    SelectPopover.prototype.render = function () {
        var checkedOption = this.options.find(function (o) { return o.checked; });
        var checkedValue = checkedOption ? checkedOption.value : undefined;
        return (h(Host, { class: getIonMode(this) }, h("ion-list", null, this.header !== undefined && h("ion-list-header", null, this.header), (this.subHeader !== undefined || this.message !== undefined) &&
            h("ion-item", null, h("ion-label", { class: "ion-text-wrap" }, this.subHeader !== undefined && h("h3", null, this.subHeader), this.message !== undefined && h("p", null, this.message))), h("ion-radio-group", { value: checkedValue }, this.options.map(function (option) { return h("ion-item", null, h("ion-label", null, option.text), h("ion-radio", { value: option.value, disabled: option.disabled })); })))));
    };
    return SelectPopover;
}());
SelectPopover.style = selectPopoverCss;
export { SelectPopover as ion_select_popover };
