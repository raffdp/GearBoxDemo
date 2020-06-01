import { Component, h, Prop, State, Watch } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaUserChipSet {
    constructor() {
        /**
         * Whether avatar images should be shown or not
         */
        this.showImages = true;
        /**
         * The initial z-index for chip overlapping
         */
        this.initialZIndex = 1000;
        /**
         * Number of chips to show before overflow happens
         */
        this.overflowLimit = 5;
        /**
         * Number of chips to show before overflow happens
         */
        this.overflowShown = false;
        /**
         * Object containing entries in the overflow
         */
        this.shownOverflowEntry = null;
    }
    /**
     * Watch for changes in the session property
     */
    sessionChanged() {
        this.setupSession();
    }
    /**
     * Called when the component first loads
     */
    componentWillLoad() {
        this.setupSession();
    }
    /**
     * Set up the sesion subscriptions
     */
    setupSession() {
        if ('sub' in this.session) {
            // Initialize the data array with any users already in the meeting.
            const userDatas = [];
            for (let u in this.session.users) {
                if (this.session.users.hasOwnProperty(u)) {
                    userDatas.push(this.session.users[u]);
                }
            }
            this.userDatas = userDatas;
            // Maintaint the order which users join.
            // New users should be on the left.
            this.session.sub('user-joined', (userData) => {
                if (!this.userDatas.find((sessionUserData) => sessionUserData.id == userData.id)) {
                    this.userDatas = [userData, ...this.userDatas];
                }
            });
            this.session.sub('user-left', (userData) => {
                const index = this.userDatas.findIndex((sessionUserData) => sessionUserData.id == userData.id);
                if (index == -1) {
                    console.warn('User id not in session:', userData.id);
                    return;
                }
                const userDatas = [...this.userDatas];
                // Remove the user from our array.
                userDatas.splice(index, 1);
                this.userDatas = userDatas;
            });
        }
        else {
            this.userDatas = [];
        }
    }
    /**
     * Activate the current item
     * @param {any} e The event
     */
    onChipClick() {
        // e.currentTarget.isActive = !e.currentTarget.isActive
    }
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render() {
        const shownChips = this.userDatas.slice(0, this.overflowLimit);
        const overflownChips = this.userDatas.slice(this.overflowLimit);
        // let currentZIndex = this.initialZIndex
        return (h("div", { class: "zea-chip-set" },
            shownChips &&
                shownChips.map((userData) => {
                    return (h("zea-user-chip", { showImages: this.showImages, key: userData.id, userData: userData, 
                        // style={{ zIndex: `${--currentZIndex}` }}
                        onClick: this.onChipClick.bind(this) }));
                }),
            overflownChips.length > 0 && (h("div", { class: "overflow" },
                h("div", { class: "overflow-thumb", onClick: () => (this.overflowShown = !this.overflowShown) }, [
                    `+${this.userDatas.length - this.overflowLimit}`,
                    !this.overflowShown && (h("div", { class: "overflow-tooltip" }, "Show All")),
                ]),
                h("div", { class: { 'overflow-list': true, shown: this.overflowShown } }, overflownChips.map((userData) => {
                    return (h("div", { key: userData.id, class: {
                            'overflow-entry': true,
                            shown: this.shownOverflowEntry == userData.id,
                        } },
                        h("div", { class: "overflow-entry-collapser", onClick: (e) => {
                                this.shownOverflowEntry =
                                    this.shownOverflowEntry == userData.id
                                        ? null
                                        : userData.id;
                                e.currentTarget.scrollIntoView();
                            } },
                            h("zea-icon", { name: this.shownOverflowEntry == userData.id
                                    ? 'chevron-up-outline'
                                    : 'chevron-down-outline', size: 14 })),
                        h("zea-user-card", { userData: userData, collapsible: false, density: this.shownOverflowEntry == userData.id
                                ? 'normal'
                                : 'small' })));
                }))))));
    }
    static get is() { return "zea-user-chip-set"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-user-chip-set.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-user-chip-set.css"]
    }; }
    static get properties() { return {
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
        "initialZIndex": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The initial z-index for chip overlapping"
            },
            "attribute": "initial-z-index",
            "reflect": false,
            "defaultValue": "1000"
        },
        "session": {
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
                "text": "The Zea session"
            },
            "attribute": "session",
            "reflect": false
        },
        "overflowLimit": {
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
                "text": "Number of chips to show before overflow happens"
            },
            "attribute": "overflow-limit",
            "reflect": false,
            "defaultValue": "5"
        }
    }; }
    static get states() { return {
        "overflowShown": {},
        "userDatas": {},
        "shownOverflowEntry": {}
    }; }
    static get watchers() { return [{
            "propName": "session",
            "methodName": "sessionChanged"
        }]; }
}
