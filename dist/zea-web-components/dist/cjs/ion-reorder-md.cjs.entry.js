'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');
const ionicGlobal = require('./ionic-global-63aa0afb.js');

const reorderIosCss = ":host([slot]){display:none;line-height:0;z-index:100}.reorder-icon{display:block;font-size:22px}.reorder-icon{font-size:34px;opacity:0.4}";

const reorderMdCss = ":host([slot]){display:none;line-height:0;z-index:100}.reorder-icon{display:block;font-size:22px}.reorder-icon{font-size:31px;opacity:0.3}";

const Reorder = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    onClick(ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
    }
    render() {
        const mode = ionicGlobal.getIonMode(this);
        const reorderIcon = mode === 'ios' ? 'reorder-three-outline' : 'reorder-two-sharp';
        return (index.h(index.Host, { class: mode }, index.h("slot", null, index.h("ion-icon", { name: reorderIcon, lazy: false, class: "reorder-icon" }))));
    }
};
Reorder.style = {
    /*STENCIL:MODE:ios*/ ios: reorderIosCss,
    /*STENCIL:MODE:md*/ md: reorderMdCss
};

exports.ion_reorder = Reorder;
