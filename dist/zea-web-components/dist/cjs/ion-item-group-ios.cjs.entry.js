'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');
const ionicGlobal = require('./ionic-global-63aa0afb.js');

const itemGroupIosCss = "ion-item-group{display:block}";

const itemGroupMdCss = "ion-item-group{display:block}";

const ItemGroup = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        const mode = ionicGlobal.getIonMode(this);
        return (index.h(index.Host, { role: "group", class: {
                [mode]: true,
                // Used internally for styling
                [`item-group-${mode}`]: true,
                'item': true
            } }));
    }
};
ItemGroup.style = {
    /*STENCIL:MODE:ios*/ ios: itemGroupIosCss,
    /*STENCIL:MODE:md*/ md: itemGroupMdCss
};

exports.ion_item_group = ItemGroup;
