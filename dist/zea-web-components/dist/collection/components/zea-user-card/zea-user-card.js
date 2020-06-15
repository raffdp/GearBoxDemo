import { Component, h, Prop } from '@stencil/core';
/**
 */
export class ZeaUserCard {
    constructor() {
        /**
         * Whether the card is for the current user session
         */
        this.isCurrentUser = false;
        /**
         * Whether to show the collpase control for additional data
         */
        this.collapsible = true;
        /**
         * Density and size of elements
         */
        this.density = 'normal';
    }
    /**
     * Initialize the shown state of additional data
     * according to whether collapsing is allowed or not
     */
    componentWillLoad() {
        this.additionalDataShown = !this.collapsible;
    }
    /**
     * Show the profile editor form
     */
    onProfileLinkClick() {
        this.profileDialog.shown = true;
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        const firstName = this.userData.firstName || this.userData.given_name;
        const lastName = this.userData.lastName || this.userData.family_name;
        const company = this.userData.company;
        const phone = this.userData.phone;
        const email = this.userData.email;
        return (h("div", { class: `zea-user-card ${this.density}` },
            h("div", { class: "user-chip-container" },
                h("zea-user-chip", { showProfileCard: false, showTooltip: false, userData: this.userData, density: this.density == 'normal' ? 'large' : this.density })),
            h("div", { class: "user-info" },
                h("div", { class: "user-name" },
                    firstName,
                    " ",
                    lastName),
                h("div", { class: "user-company" }, company),
                this.isCurrentUser && (h("div", { onClick: this.onProfileLinkClick.bind(this), class: "profile-link" }, "My Profile"))),
            !this.isCurrentUser && (h("div", { class: "user-focuser-container" },
                h("div", { class: "user-focuser" },
                    h("zea-icon", { type: "zea", name: "find-user", size: 28 })))),
            !this.isCurrentUser && this.collapsible && (phone || email) && (h("div", { class: "additional-data-collapser", onClick: () => (this.additionalDataShown = !this.additionalDataShown) },
                h("span", { class: "collapser-label" }, this.additionalDataShown ? 'Less' : 'More'),
                h("span", { class: "collapser-icon" },
                    h("zea-icon", { name: this.additionalDataShown
                            ? 'chevron-up-outline'
                            : 'chevron-down-outline', size: 14 })))),
            !this.isCurrentUser && (phone || email) && (h("div", { class: {
                    'additional-data': true,
                    shown: this.additionalDataShown,
                } },
                phone && (h("div", { class: "user-phone" },
                    h("zea-icon", { name: "phone-portrait-outline" }),
                    h("span", null, phone))),
                email && (h("div", { class: "user-email" },
                    h("zea-icon", { name: "mail-outline" }),
                    h("span", null, email))))),
            this.isCurrentUser && (h("zea-dialog-profile", { ref: (el) => (this.profileDialog = el), userData: this.userData }))));
    }
    static get is() { return "zea-user-card"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-user-card.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-user-card.css"]
    }; }
    static get properties() { return {
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
                "text": ""
            },
            "attribute": "user-data",
            "reflect": false
        },
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
                "text": "Whether the card is for the current user session"
            },
            "attribute": "is-current-user",
            "reflect": false,
            "defaultValue": "false"
        },
        "collapsible": {
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
                "text": "Whether to show the collpase control for additional data"
            },
            "attribute": "collapsible",
            "reflect": false,
            "defaultValue": "true"
        },
        "additionalDataShown": {
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
                "text": "Whether additional data is currently shown"
            },
            "attribute": "additional-data-shown",
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
                "text": "Density and size of elements"
            },
            "attribute": "density",
            "reflect": false,
            "defaultValue": "'normal'"
        }
    }; }
}
