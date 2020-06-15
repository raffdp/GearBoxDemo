import { Component, h, Prop, Event, Listen } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaUserChip {
    constructor() {
        /**
         * Whether the chip is for the current user session
         */
        this.isCurrentUser = false;
        /**
         * Whether the chip is currently active
         */
        this.isActive = false;
        /**
         * Whether avatar images should be shown or not
         */
        this.showImages = true;
        /**
         * The density of the chip (large|normal|small|tiny)
         */
        this.density = 'normal';
        /**
         * Whether the tooltip should be shown
         */
        this.showTooltip = true;
        /**
         * Whether to ever show the profile card
         */
        this.showProfileCard = true;
        /**
         * Whether the profile card is currently shown
         */
        this.profileCardShown = false;
        /**
         * Alignment of the profile card (right|left)
         */
        this.profileCardAlign = 'left';
        /**
         * Used as background color for the chip
         */
        this.randomColor = '#000000'.replace(/0/g, () => {
            // limit the random number range so that colors
            // are not too dark nor too bright
            // eslint-disable-next-line no-bitwise
            return (~~(5 + Math.random() * 7)).toString(16);
        });
    }
    /**
     * Listen to click events on the whole document
     * @param {any} e The event
     */
    handleClick(e) {
        if (e.composedPath().includes(this.chipElement)) {
            if (!e.composedPath().includes(this.profileCardElement)) {
                this.profileCardShown = !this.profileCardShown;
            }
        }
        else {
            this.profileCardShown = false;
        }
    }
    /**
     * Handle click on user chip: emit custom zeaUserClicked event
     * @param {any} userData the userData
     */
    onChipClick() {
        this.zeaUserClicked.emit(this.userData);
    }
    /**
     * On avatar over, fix tooltip position when its out of the screen
     */
    onAvatarOver() {
        this.fixTooltipPosition();
    }
    /**
     * On component render, fix tooltip position when its out of the screen
     */
    componentDidRender() {
        this.fixTooltipPosition();
    }
    /**
     * Fix the tooltip position if it goes out of screen
     */
    fixTooltipPosition() {
        if (!this.tooltipElement)
            return;
        const bbox = this.tooltipElement.getBoundingClientRect();
        if (bbox.x + bbox.width > window.innerWidth) {
            this.tooltipElement.classList.add('bleeded-right');
        }
        else {
            this.tooltipElement.classList.remove('bleeded-right');
        }
        if (bbox.x < 0) {
            this.tooltipElement.classList.add('bleeded-left');
        }
        else {
            this.tooltipElement.classList.remove('bleeded-left');
        }
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        if (!this.userData)
            return h("span", { class: "empty-user-chip" });
        // Ensure that the zea-user-chip is compatible with a variety of userData values.
        const firstName = this.userData.firstName || this.userData.given_name;
        const lastName = this.userData.lastName || this.userData.family_name;
        const avatar = this.userData.avatar || this.userData.picture;
        let initials = '';
        let backgroundColor = this.userData.color;
        {
            let firstLetter = '';
            let secondLetter = '';
            if (firstName) {
                firstLetter = firstName.charAt(0);
            }
            if (lastName) {
                secondLetter = lastName.charAt(0);
            }
            else if (firstLetter) {
                // if no last name but it does have a firstName,
                // use the firstName's second letter
                secondLetter = firstName.charAt(1);
            }
            initials = String(firstLetter + secondLetter).toUpperCase();
        }
        if (!backgroundColor) {
            backgroundColor = this.randomColor;
            this.userData.color = this.randomColor;
        }
        const containerClass = { active: this.isActive, 'zea-chip': true };
        containerClass[this.density] = true;
        return (h("div", { ref: (el) => (this.chipElement = el), class: containerClass, onClick: this.onChipClick.bind(this) },
            h("div", { class: "zea-chip-avatar", onMouseOver: this.onAvatarOver.bind(this), style: {
                    backgroundColor: backgroundColor,
                } },
                h("span", null, initials),
                this.showImages && !!avatar && (h("div", { class: "avatar-image", style: {
                        backgroundImage: `url(${avatar})`,
                    } }))),
            this.showTooltip && !this.profileCardShown && (h("div", { ref: (el) => (this.tooltipElement = el), class: "tooltip" }, `${firstName} ${lastName ? lastName : ''}`)),
            this.showProfileCard && (h("zea-user-card", { collapsible: true, isCurrentUser: this.isCurrentUser, ref: (el) => (this.profileCardElement = el), class: `align-${this.profileCardAlign}`, style: { display: this.profileCardShown ? 'block' : 'none' }, userData: this.userData }))));
    }
    static get is() { return "zea-user-chip"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-user-chip.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-user-chip.css"]
    }; }
    static get properties() { return {
        "isCurrentUser": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Whether the chip is for the current user session"
            },
            "attribute": "is-current-user",
            "reflect": false,
            "defaultValue": "false"
        },
        "isActive": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Whether the chip is currently active"
            },
            "attribute": "is-active",
            "reflect": false,
            "defaultValue": "false"
        },
        "showImages": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Whether avatar images should be shown or not"
            },
            "attribute": "show-images",
            "reflect": false,
            "defaultValue": "true"
        },
        "userData": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "User object containing avatar url, firstName, lastName and others"
            },
            "attribute": "user-data",
            "reflect": false
        },
        "density": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The density of the chip (large|normal|small|tiny)"
            },
            "attribute": "density",
            "reflect": false,
            "defaultValue": "'normal'"
        },
        "showTooltip": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Whether the tooltip should be shown"
            },
            "attribute": "show-tooltip",
            "reflect": false,
            "defaultValue": "true"
        },
        "showProfileCard": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Whether to ever show the profile card"
            },
            "attribute": "show-profile-card",
            "reflect": false,
            "defaultValue": "true"
        },
        "profileCardShown": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Whether the profile card is currently shown"
            },
            "attribute": "profile-card-shown",
            "reflect": false,
            "defaultValue": "false"
        },
        "profileCardAlign": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Alignment of the profile card (right|left)"
            },
            "attribute": "profile-card-align",
            "reflect": false,
            "defaultValue": "'left'"
        }
    }; }
    static get events() { return [{
            "method": "zeaUserClicked",
            "name": "zeaUserClicked",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": "Event to emit when user chip gets clicked"
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }]; }
    static get listeners() { return [{
            "name": "click",
            "method": "handleClick",
            "target": "document",
            "capture": true,
            "passive": false
        }]; }
}
