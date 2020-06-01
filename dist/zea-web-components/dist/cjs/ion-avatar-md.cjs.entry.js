'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');
const ionicGlobal = require('./ionic-global-63aa0afb.js');

const avatarIosCss = ":host{border-radius:var(--border-radius);display:block}::slotted(ion-img),::slotted(img){border-radius:var(--border-radius);width:100%;height:100%;-o-object-fit:cover;object-fit:cover;overflow:hidden}:host{--border-radius:50%;width:48px;height:48px}";

const avatarMdCss = ":host{border-radius:var(--border-radius);display:block}::slotted(ion-img),::slotted(img){border-radius:var(--border-radius);width:100%;height:100%;-o-object-fit:cover;object-fit:cover;overflow:hidden}:host{--border-radius:50%;width:64px;height:64px}";

const Avatar = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    render() {
        return (index.h(index.Host, { class: ionicGlobal.getIonMode(this) }, index.h("slot", null)));
    }
};
Avatar.style = {
    /*STENCIL:MODE:ios*/ ios: avatarIosCss,
    /*STENCIL:MODE:md*/ md: avatarMdCss
};

exports.ion_avatar = Avatar;
