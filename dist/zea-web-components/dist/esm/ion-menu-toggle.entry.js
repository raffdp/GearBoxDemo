import { r as registerInstance, h, H as Host } from './index-12ee0265.js';
import { g as getIonMode } from './ionic-global-9ae0f2dd.js';
import './hardware-back-button-24485eb0.js';
import './helpers-4a6bd295.js';
import './animation-b77f81ea.js';
import { m as menuController } from './index-a5bf25c8.js';
import { u as updateVisibility } from './menu-toggle-util-e16cfe0f.js';

const menuToggleCss = ":host(.menu-toggle-hidden){display:none}";

const MenuToggle = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.visible = false;
        /**
         * Automatically hides the content when the corresponding menu is not active.
         *
         * By default, it's `true`. Change it to `false` in order to
         * keep `ion-menu-toggle` always visible regardless the state of the menu.
         */
        this.autoHide = true;
        this.onClick = () => {
            return menuController.toggle(this.menu);
        };
    }
    connectedCallback() {
        this.visibilityChanged();
    }
    async visibilityChanged() {
        this.visible = await updateVisibility(this.menu);
    }
    render() {
        const mode = getIonMode(this);
        const hidden = this.autoHide && !this.visible;
        return (h(Host, { onClick: this.onClick, "aria-hidden": hidden ? 'true' : null, class: {
                [mode]: true,
                'menu-toggle-hidden': hidden,
            } }, h("slot", null)));
    }
};
MenuToggle.style = menuToggleCss;

export { MenuToggle as ion_menu_toggle };
