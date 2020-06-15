import { r as registerInstance, c as createEvent, h, d as getElement } from './index-12ee0265.js';
var zeaAppShellCss = ":host,.zea-app-shell{color:var(--color-freground-1);width:100%;height:100%}#brand{display:inline-block;vertical-align:middle;z-index:10000020;position:relative;background-size:contain;background-position:20px center;background-repeat:no-repeat;width:150px;height:24px}#left-panel-container,#right-panel-container,#center-panel-container{height:100%}header{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}#tools-container{-ms-flex-positive:1;flex-grow:1;text-align:right}header zea-user-chip{margin-right:10px}#main-search{width:300px;display:inline-block;text-align:right;margin:0 20px}";
var ZeaAppShell = /** @class */ (function () {
    function ZeaAppShell(hostRef) {
        registerInstance(this, hostRef);
        /**
         */
        this.logoUrl = 'https://storage.googleapis.com/misc-assets/zea-logo.png';
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
        this.userAuthenticated = createEvent(this, "userAuthenticated", 7);
    }
    /**
     */
    ZeaAppShell.prototype.userRegisteredHandler = function (event) {
        this.userData = event.detail;
        this.userData.id = Math.random().toString(36).slice(2, 12);
        localStorage.setItem('zea-user-data', JSON.stringify(this.userData));
        this.registerDialog.shown = false;
        this.userAuthenticated.emit(this.userData);
    };
    /**
     */
    ZeaAppShell.prototype.componentWillLoad = function () {
        var storedUserData = localStorage.getItem('zea-user-data');
        if (storedUserData) {
            this.userData = JSON.parse(storedUserData);
        }
    };
    /**
     */
    ZeaAppShell.prototype.componentDidLoad = function () {
        if ('id' in this.userData) {
            this.userAuthenticated.emit(this.userData);
        }
        else {
            this.registerDialog.shown = true;
        }
    };
    /**
     */
    ZeaAppShell.prototype.onShareIconClick = function () {
        this.shareDialog.shown = true;
    };
    /**
     * Main render function
     *
     * @return {JSX} The generated html
     */
    ZeaAppShell.prototype.render = function () {
        var _this = this;
        return [
            h("zea-layout", { orientation: "vertical", "cell-a-size": "40", "cell-c-size": "0", "resize-cell-a": "false", "resize-cell-c": "false", "show-borders": "false" }, h("header", { slot: "a" }, h("zea-navigation-drawer", { id: "navigation-drawer" }, h("zea-menu-item", { onClick: this.onShareIconClick.bind(this), type: "standalone" }, h("zea-icon", { name: "link-outline" }), "Share"), h("slot", { name: "nav-drawer" })), h("div", { id: "brand", style: { backgroundImage: "url(" + this.logoUrl + ")" } }), h("zea-user-chip-set", { id: "users-container", session: this.session }), h("div", { id: "tools-container" }, h("div", { id: "main-search" }, h("zea-input-search", null))), h("zea-user-chip", { userData: this.userData, id: "current-user", "profile-card-align": "right", "is-current-user": "true" })), h("zea-layout", { slot: "b", "cell-a-size": this.leftPanelWidth, "cell-c-size": this.rightPanelWidth }, h("div", { slot: "a", id: "left-panel-container" }, this.leftProgressMessage && (h("zea-panel-progress-bar", { ref: function (el) { return (_this.leftProgressBar = el); } }, this.leftProgressMessage)), h("slot", { name: "left-panel" })), h("div", { slot: "b", id: "center-panel-container" }, this.centerProgressMessage && (h("zea-panel-progress-bar", { ref: function (el) { return (_this.centerProgressBar = el); } }, this.centerProgressMessage)), h("slot", { name: "center-panel" })), h("div", { slot: "c", id: "right-panel-container" }, this.rightProgressMessage && (h("zea-panel-progress-bar", { ref: function (el) { return (_this.rightProgressBar = el); } }, this.rightProgressMessage)), h("slot", { name: "right-panel" })))),
            h("zea-dialog-profile", { allowClose: false, ref: function (el) { return (_this.registerDialog = el); } }),
            h("zea-dialog-share", { ref: function (el) { return (_this.shareDialog = el); } }),
        ];
    };
    Object.defineProperty(ZeaAppShell.prototype, "hostElement", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return ZeaAppShell;
}());
ZeaAppShell.style = zeaAppShellCss;
export { ZeaAppShell as zea_app_shell };
