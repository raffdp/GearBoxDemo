import { Component, h, Prop, Listen, Event, Element, forceUpdate, Method, } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaAppShell {
    constructor() {
        /**
         */
        this.logoUrl = 'https://storage.googleapis.com/zea-web-components-assets/zea-logo.png';
        /**
         */
        this.userData = {};
        /**
         */
        this.session = {};
        /**
         */
        this.leftPanelWidth = '200';
        this.rightPanelWidth = '200';
        /**
         */
        this.leftProgressMessage = '';
        this.centerProgressMessage = '';
        this.rightProgressMessage = '';
    }
    /**
     */
    userRegisteredHandler(event) {
        this.userData = event.detail;
        if (!this.userData['id']) {
            this.userData.id = Math.random().toString(36).slice(2, 12);
            this.userAuthenticated.emit(this.userData);
        }
        else if ('pub' in this.session) {
            this.session.pub('userChanged', this.userData);
        }
        this.registerDialog.shown = false;
        localStorage.setItem('zea-user-data', JSON.stringify(this.userData));
        // this.currentUserChip.forceUpdate()
        this.currentUserChip.userData = Object.assign({}, this.userData);
        forceUpdate(this.currentUserChip);
    }
    /**
     */
    navDrawerOpenHandler() {
        this.userChipSet.classList.add('nav-drawer-open');
        this.toolsContainer.classList.add('nav-drawer-open');
    }
    /**
     */
    navDrawerClosedHandler() {
        this.userChipSet.classList.remove('nav-drawer-open');
        this.toolsContainer.classList.remove('nav-drawer-open');
    }
    /**
     */
    async doUpdate() {
        console.log('Force updating shell');
        forceUpdate(this.hostElement);
        forceUpdate(this.userChipSet);
    }
    /**
     */
    componentWillLoad() {
        const storedUserData = localStorage.getItem('zea-user-data');
        if (storedUserData) {
            this.userData = JSON.parse(storedUserData);
        }
    }
    /**
     */
    componentDidLoad() {
        if ('id' in this.userData) {
            this.userAuthenticated.emit(this.userData);
        }
        else {
            this.registerDialog.shown = true;
        }
    }
    /**
     */
    onShareIconClick() {
        this.shareDialog.shown = true;
    }
    /**
     * Main render function
     *
     * @return {JSX} The generated html
     */
    render() {
        return [
            h("zea-layout", { orientation: "vertical", "cell-a-size": "40", "cell-c-size": "0", "resize-cell-a": "false", "resize-cell-c": "false", "show-borders": "false" },
                h("header", { slot: "a" },
                    h("zea-navigation-drawer", { id: "navigation-drawer" },
                        h("zea-menu-item", { onClick: this.onShareIconClick.bind(this), type: "standalone" },
                            h("zea-icon", { name: "link-outline" }),
                            "Share"),
                        h("slot", { name: "nav-drawer" })),
                    h("div", { id: "brand", style: { backgroundImage: `url(${this.logoUrl})` } }),
                    h("zea-user-chip-set", { ref: (el) => {
                            this.userChipSet = el;
                        }, id: "users-container", session: this.session }),
                    h("div", { id: "tools-container", ref: (el) => {
                            this.toolsContainer = el;
                        } },
                        h("div", { id: "main-search" },
                            h("zea-input-search", null))),
                    h("zea-user-chip", { ref: (el) => {
                            this.currentUserChip = el;
                        }, userData: Object.assign({}, this.userData), id: "current-user", "profile-card-align": "right", "is-current-user": "true" })),
                h("zea-layout", { slot: "b", "cell-a-size": this.leftPanelWidth, "cell-c-size": this.rightPanelWidth },
                    h("div", { slot: "a", id: "left-panel-container" },
                        this.leftProgressMessage && (h("zea-panel-progress-bar", { ref: (el) => (this.leftProgressBar = el) }, this.leftProgressMessage)),
                        h("slot", { name: "left-panel" })),
                    h("div", { slot: "b", id: "center-panel-container" },
                        this.centerProgressMessage && (h("zea-panel-progress-bar", { ref: (el) => (this.centerProgressBar = el) }, this.centerProgressMessage)),
                        h("slot", { name: "center-panel" })),
                    h("div", { slot: "c", id: "right-panel-container" },
                        this.rightProgressMessage && (h("zea-panel-progress-bar", { ref: (el) => (this.rightProgressBar = el) }, this.rightProgressMessage)),
                        h("slot", { name: "right-panel" })))),
            h("zea-dialog-profile", { allowClose: false, ref: (el) => (this.registerDialog = el) }),
            h("zea-dialog-share", { ref: (el) => (this.shareDialog = el) }),
        ];
    }
    static get is() { return "zea-app-shell"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-app-shell.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-app-shell.css"]
    }; }
    static get properties() { return {
        "logoUrl": {
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
                "text": ""
            },
            "attribute": "logo-url",
            "reflect": false,
            "defaultValue": "'https://storage.googleapis.com/zea-web-components-assets/zea-logo.png'"
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
                "text": ""
            },
            "attribute": "user-data",
            "reflect": false,
            "defaultValue": "{}"
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
                "text": ""
            },
            "attribute": "session",
            "reflect": false,
            "defaultValue": "{}"
        },
        "leftPanelWidth": {
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
                "text": ""
            },
            "attribute": "left-panel-width",
            "reflect": false,
            "defaultValue": "'200'"
        },
        "rightPanelWidth": {
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
                "text": ""
            },
            "attribute": "right-panel-width",
            "reflect": false,
            "defaultValue": "'200'"
        },
        "leftProgressMessage": {
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
                "text": ""
            },
            "attribute": "left-progress-message",
            "reflect": false,
            "defaultValue": "''"
        },
        "centerProgressMessage": {
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
                "text": ""
            },
            "attribute": "center-progress-message",
            "reflect": false,
            "defaultValue": "''"
        },
        "rightProgressMessage": {
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
                "text": ""
            },
            "attribute": "right-progress-message",
            "reflect": false,
            "defaultValue": "''"
        },
        "centerProgressBar": {
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
            "attribute": "center-progress-bar",
            "reflect": false
        },
        "leftProgressBar": {
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
            "attribute": "left-progress-bar",
            "reflect": false
        },
        "rightProgressBar": {
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
            "attribute": "right-progress-bar",
            "reflect": false
        }
    }; }
    static get events() { return [{
            "method": "userAuthenticated",
            "name": "userAuthenticated",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": ""
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }]; }
    static get methods() { return {
        "doUpdate": {
            "complexType": {
                "signature": "() => Promise<void>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        }
    }; }
    static get elementRef() { return "hostElement"; }
    static get listeners() { return [{
            "name": "userRegistered",
            "method": "userRegisteredHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }, {
            "name": "navDrawerOpen",
            "method": "navDrawerOpenHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }, {
            "name": "navDrawerClosed",
            "method": "navDrawerClosedHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }]; }
}
