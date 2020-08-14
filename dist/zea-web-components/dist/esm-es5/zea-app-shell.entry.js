var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { r as registerInstance, c as createEvent, f as forceUpdate, h, d as getElement } from './index-12ee0265.js';
var zeaAppShellCss = ":host,.zea-app-shell{color:var(--color-freground-1);width:100%;height:100%}#brand{display:inline-block;vertical-align:middle;z-index:10000020;position:relative;background-size:contain;background-position:0px center;background-repeat:no-repeat;width:150px;height:34px}#left-panel-container,#right-panel-container,#center-panel-container{height:100%}header{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;background-color:var(--color-grey-1)}#tools-container{-ms-flex-positive:1;flex-grow:1;text-align:right}header zea-user-chip{margin-right:10px}#main-search{width:300px;display:inline-block;text-align:right;margin:0 20px}@media only screen and (max-width: 667px){#main-search{width:auto}zea-user-chip-set{display:none}zea-user-chip-set.nav-drawer-open{display:block;-ms-flex-positive:1;flex-grow:1}#tools-container.nav-drawer-open{display:none}#brand{width:50px}}";
var ZeaAppShell = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
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
        this.userAuthenticated = createEvent(this, "userAuthenticated", 7);
    }
    /**
     */
    class_1.prototype.userRegisteredHandler = function (event) {
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
    };
    /**
     */
    class_1.prototype.navDrawerOpenHandler = function () {
        this.userChipSet.classList.add('nav-drawer-open');
        this.toolsContainer.classList.add('nav-drawer-open');
    };
    /**
     */
    class_1.prototype.navDrawerClosedHandler = function () {
        this.userChipSet.classList.remove('nav-drawer-open');
        this.toolsContainer.classList.remove('nav-drawer-open');
    };
    /**
     */
    class_1.prototype.doUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('Force updating shell');
                forceUpdate(this.hostElement);
                forceUpdate(this.userChipSet);
                return [2 /*return*/];
            });
        });
    };
    /**
     */
    class_1.prototype.componentWillLoad = function () {
        var storedUserData = localStorage.getItem('zea-user-data');
        if (storedUserData) {
            this.userData = JSON.parse(storedUserData);
        }
    };
    /**
     */
    class_1.prototype.componentDidLoad = function () {
        if ('id' in this.userData) {
            this.userAuthenticated.emit(this.userData);
        }
        else {
            this.registerDialog.shown = true;
        }
    };
    /**
     */
    class_1.prototype.onShareIconClick = function () {
        this.shareDialog.shown = true;
    };
    /**
     * Main render function
     *
     * @return {JSX} The generated html
     */
    class_1.prototype.render = function () {
        var _this = this;
        return [
            h("zea-layout", { orientation: "vertical", "cell-a-size": "40", "cell-c-size": "0", "resize-cell-a": "false", "resize-cell-c": "false", "show-borders": "false" }, h("header", { slot: "a" }, h("zea-navigation-drawer", { id: "navigation-drawer" }, h("zea-menu-item", { onClick: this.onShareIconClick.bind(this), type: "standalone" }, h("zea-icon", { name: "link-outline" }), "Share"), h("slot", { name: "nav-drawer" })), h("div", { id: "brand", style: { backgroundImage: "url(" + this.logoUrl + ")" } }), h("zea-user-chip-set", { ref: function (el) {
                    _this.userChipSet = el;
                }, id: "users-container", session: this.session }), h("div", { id: "tools-container", ref: function (el) {
                    _this.toolsContainer = el;
                } }, h("div", { id: "main-search" }, h("zea-input-search", null))), h("zea-user-chip", { ref: function (el) {
                    _this.currentUserChip = el;
                }, userData: Object.assign({}, this.userData), id: "current-user", "profile-card-align": "right", "is-current-user": "true" })), h("zea-layout", { slot: "b", "cell-a-size": this.leftPanelWidth, "cell-c-size": this.rightPanelWidth }, h("div", { slot: "a", id: "left-panel-container" }, this.leftProgressMessage && (h("zea-panel-progress-bar", { ref: function (el) { return (_this.leftProgressBar = el); } }, this.leftProgressMessage)), h("slot", { name: "left-panel" })), h("div", { slot: "b", id: "center-panel-container" }, this.centerProgressMessage && (h("zea-panel-progress-bar", { ref: function (el) { return (_this.centerProgressBar = el); } }, this.centerProgressMessage)), h("slot", { name: "center-panel" })), h("div", { slot: "c", id: "right-panel-container" }, this.rightProgressMessage && (h("zea-panel-progress-bar", { ref: function (el) { return (_this.rightProgressBar = el); } }, this.rightProgressMessage)), h("slot", { name: "right-panel" })))),
            h("zea-dialog-profile", { allowClose: false, ref: function (el) { return (_this.registerDialog = el); } }),
            h("zea-dialog-share", { ref: function (el) { return (_this.shareDialog = el); } }),
        ];
    };
    Object.defineProperty(class_1.prototype, "hostElement", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
ZeaAppShell.style = zeaAppShellCss;
export { ZeaAppShell as zea_app_shell };
