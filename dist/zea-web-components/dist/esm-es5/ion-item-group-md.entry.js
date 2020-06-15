import { r as registerInstance, h, H as Host } from './index-12ee0265.js';
import { g as getIonMode } from './ionic-global-9ae0f2dd.js';
var itemGroupIosCss = "ion-item-group{display:block}";
var itemGroupMdCss = "ion-item-group{display:block}";
var ItemGroup = /** @class */ (function () {
    function ItemGroup(hostRef) {
        registerInstance(this, hostRef);
    }
    ItemGroup.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        return (h(Host, { role: "group", class: (_a = {},
                _a[mode] = true,
                // Used internally for styling
                _a["item-group-" + mode] = true,
                _a['item'] = true,
                _a) }));
    };
    return ItemGroup;
}());
ItemGroup.style = {
    /*STENCIL:MODE:ios*/ ios: itemGroupIosCss,
    /*STENCIL:MODE:md*/ md: itemGroupMdCss
};
export { ItemGroup as ion_item_group };
