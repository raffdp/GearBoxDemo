'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');
const ionicGlobal = require('./ionic-global-63aa0afb.js');
require('./hardware-back-button-44aa341d.js');
require('./helpers-41dfb43a.js');
require('./animation-7bcfdc46.js');
const index$2 = require('./index-c6995bed.js');
const menuToggleUtil = require('./menu-toggle-util-387d63f5.js');

const menuToggleCss = ":host(.menu-toggle-hidden){display:none}";

const MenuToggle = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.visible = false;
        /**
         * Automatically hides the content when the corresponding menu is not active.
         *
         * By default, it's `true`. Change it to `false` in order to
         * keep `ion-menu-toggle` always visible regardless the state of the menu.
         */
        this.autoHide = true;
        this.onClick = () => {
            return index$2.menuController.toggle(this.menu);
        };
    }
    connectedCallback() {
        this.visibilityChanged();
    }
    async visibilityChanged() {
        this.visible = await menuToggleUtil.updateVisibility(this.menu);
    }
    render() {
        const mode = ionicGlobal.getIonMode(this);
        const hidden = this.autoHide && !this.visible;
        return (index.h(index.Host, { onClick: this.onClick, "aria-hidden": hidden ? 'true' : null, class: {
                [mode]: true,
                'menu-toggle-hidden': hidden,
            } }, index.h("slot", null)));
    }
};
MenuToggle.style = menuToggleCss;

exports.ion_menu_toggle = MenuToggle;
