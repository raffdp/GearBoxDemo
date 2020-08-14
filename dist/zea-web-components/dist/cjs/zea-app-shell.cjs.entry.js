'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaAppShellCss = ":host,.zea-app-shell{color:var(--color-freground-1);width:100%;height:100%}#brand{display:inline-block;vertical-align:middle;z-index:10000020;position:relative;background-size:contain;background-position:0px center;background-repeat:no-repeat;width:150px;height:34px}#left-panel-container,#right-panel-container,#center-panel-container{height:100%}header{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;background-color:var(--color-grey-1)}#tools-container{-ms-flex-positive:1;flex-grow:1;text-align:right}header zea-user-chip{margin-right:10px}#main-search{width:300px;display:inline-block;text-align:right;margin:0 20px}@media only screen and (max-width: 667px){#main-search{width:auto}zea-user-chip-set{display:none}zea-user-chip-set.nav-drawer-open{display:block;-ms-flex-positive:1;flex-grow:1}#tools-container.nav-drawer-open{display:none}#brand{width:50px}}";

const ZeaAppShell = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
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
        this.userAuthenticated = index.createEvent(this, "userAuthenticated", 7);
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
        index.forceUpdate(this.currentUserChip);
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
        index.forceUpdate(this.hostElement);
        index.forceUpdate(this.userChipSet);
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
            index.h("zea-layout", { orientation: "vertical", "cell-a-size": "40", "cell-c-size": "0", "resize-cell-a": "false", "resize-cell-c": "false", "show-borders": "false" }, index.h("header", { slot: "a" }, index.h("zea-navigation-drawer", { id: "navigation-drawer" }, index.h("zea-menu-item", { onClick: this.onShareIconClick.bind(this), type: "standalone" }, index.h("zea-icon", { name: "link-outline" }), "Share"), index.h("slot", { name: "nav-drawer" })), index.h("div", { id: "brand", style: { backgroundImage: `url(${this.logoUrl})` } }), index.h("zea-user-chip-set", { ref: (el) => {
                    this.userChipSet = el;
                }, id: "users-container", session: this.session }), index.h("div", { id: "tools-container", ref: (el) => {
                    this.toolsContainer = el;
                } }, index.h("div", { id: "main-search" }, index.h("zea-input-search", null))), index.h("zea-user-chip", { ref: (el) => {
                    this.currentUserChip = el;
                }, userData: Object.assign({}, this.userData), id: "current-user", "profile-card-align": "right", "is-current-user": "true" })), index.h("zea-layout", { slot: "b", "cell-a-size": this.leftPanelWidth, "cell-c-size": this.rightPanelWidth }, index.h("div", { slot: "a", id: "left-panel-container" }, this.leftProgressMessage && (index.h("zea-panel-progress-bar", { ref: (el) => (this.leftProgressBar = el) }, this.leftProgressMessage)), index.h("slot", { name: "left-panel" })), index.h("div", { slot: "b", id: "center-panel-container" }, this.centerProgressMessage && (index.h("zea-panel-progress-bar", { ref: (el) => (this.centerProgressBar = el) }, this.centerProgressMessage)), index.h("slot", { name: "center-panel" })), index.h("div", { slot: "c", id: "right-panel-container" }, this.rightProgressMessage && (index.h("zea-panel-progress-bar", { ref: (el) => (this.rightProgressBar = el) }, this.rightProgressMessage)), index.h("slot", { name: "right-panel" })))),
            index.h("zea-dialog-profile", { allowClose: false, ref: (el) => (this.registerDialog = el) }),
            index.h("zea-dialog-share", { ref: (el) => (this.shareDialog = el) }),
        ];
    }
    get hostElement() { return index.getElement(this); }
};
ZeaAppShell.style = zeaAppShellCss;

exports.zea_app_shell = ZeaAppShell;
