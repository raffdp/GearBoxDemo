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
import { r as registerInstance, c as createEvent, h, d as getElement } from './index-12ee0265.js';
var zeaDialogCss = "@import url('https://unpkg.com/tachyons@4/css/tachyons.min.css');:host{position:relative;z-index:10000000}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-dialog{color:var(--color-foreground-1);display:none;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;position:fixed;top:0;left:0;bottom:0;right:0;font-size:14px;pointer-events:none}.zea-dialog.shown{display:-ms-flexbox;display:flex}.backdrop{background-color:var(--color-shadow);position:absolute;top:0;left:0;bottom:0;right:0;pointer-events:auto}.scroll-pane-container{max-height:100%;height:100%}.zea-dialog-container{-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;background-color:var(--color-background-1);-webkit-box-shadow:2px 6px 10px 5px var(--color-shadow);box-shadow:2px 6px 10px 5px var(--color-shadow);min-height:-webkit-fit-content;min-height:-moz-fit-content;min-height:fit-content;min-width:-webkit-fit-content;min-width:-moz-fit-content;min-width:fit-content;pointer-events:auto;max-height:100%;max-width:100%}.zea-dialog-title ::slotted(h3){font-size:13px;margin:0 0 1em}.zea-dialog-title{color:var(--color-foreground-1)}.with-padding .zea-dialog-title{padding:20px 20px 0 20px}.zea-dialog-body{-ms-flex-positive:1;flex-grow:1;height:100%;-webkit-box-sizing:border-box;box-sizing:border-box}.with-padding .zea-dialog-body{padding:20px}.zea-dialog-body ::slotted([slot='body']){height:100%;-webkit-box-sizing:border-box;box-sizing:border-box}.zea-dialog-footer{text-align:right}.with-padding .zea-dialog-footer{padding:0 20px 20px}";
var ZeaDialog = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        this.shown = false;
        this.width = 'auto';
        this.allowClose = true;
        this.showBackdrop = true;
        this.addPadding = true;
        this.dialogClose = createEvent(this, "dialogClose", 7);
    }
    /**
     */
    class_1.prototype.prompt = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.shown = true;
                return [2 /*return*/];
            });
        });
    };
    /**
     */
    class_1.prototype.onBackdropClick = function () {
        if (this.allowClose) {
            this.shown = false;
            this.dialogClose.emit(this.hostElement);
        }
    };
    /**
     */
    class_1.prototype.resetSize = function () {
        if (!this.dialogContainer)
            return;
        if (this.width) {
            this.dialogContainer.style.width = this.width;
        }
        else {
            this.dialogContainer.style.width = "fit-content";
        }
        this.dialogContainer.style.height = "fit-content";
        if (this.dialogContainer.offsetHeight) {
            this.dialogContainer.style.height = this.dialogContainer.offsetHeight + "px";
        }
        if (this.dialogContainer.offsetWidth) {
            this.dialogContainer.style.width = this.dialogContainer.offsetWidth + "px";
        }
    };
    /**
     */
    class_1.prototype.componentDidRender = function () {
        this.resetSize();
    };
    /**
     */
    class_1.prototype.componentWillLoad = function () {
        var _this = this;
        window.addEventListener('resize', function () {
            _this.resetSize();
        });
    };
    /**
     */
    class_1.prototype.setupContainer = function (el) {
        var _this = this;
        if (this.dialogContainer)
            return;
        this.dialogContainer = el;
        this.dialogContainer.addEventListener('dialogResize', function () {
            _this.resetSize();
        });
    };
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    class_1.prototype.render = function () {
        var _this = this;
        return (h("div", { class: {
                'zea-dialog': true,
                shown: this.shown,
                'with-padding': this.addPadding,
            } }, this.showBackdrop && (h("div", { class: "backdrop", onClick: this.onBackdropClick.bind(this) })), h("div", { class: "zea-dialog-container", ref: function (el) { return _this.setupContainer(el); } }, h("div", { class: "zea-dialog-title" }, h("slot", { name: "title" })), h("div", { class: "zea-dialog-body" }, h("slot", { name: "body" })), h("div", { class: "zea-dialog-footer" }, h("slot", { name: "footer" })))));
    };
    Object.defineProperty(class_1.prototype, "hostElement", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
ZeaDialog.style = zeaDialogCss;
export { ZeaDialog as zea_dialog };
