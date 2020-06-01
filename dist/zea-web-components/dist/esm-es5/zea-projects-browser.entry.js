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
import { r as registerInstance, c as createEvent, h } from './index-12ee0265.js';
var zeaProjectsBrowserCss = "@import url('https://unpkg.com/tachyons@4/css/tachyons.min.css');.ZeaProjectsBrowser{background-color:var(--color-background-1);color:var(--color-foreground-1);font-family:var(--theme-font-family)}.ZeaProjectsBrowser__title-bar{display:-ms-flexbox;display:flex;height:64px;-ms-flex-align:center;align-items:center;padding:0 1rem;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-flex-pack:justify;justify-content:space-between}.ZeaProjectsBrowser__projects{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}.ZeaProjectsBrowser__projects>*{margin:1rem 0 0 1rem}";
var ZeaProjectsBrowser = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Zea projects.
         */
        this.projects = [];
        this.dblClickProject = createEvent(this, "dblClickProject", 7);
    }
    // eslint-disable-next-line require-jsdoc
    class_1.prototype.render = function () {
        var _this = this;
        return (h("div", { class: "ZeaProjectsBrowser" }, h("div", { class: "ZeaProjectsBrowser__title-bar" }, h("span", null, "Projects"), h("ion-button", { shape: "round", onClick: function () {
                _this.showCreateProjectDialog = true;
            } }, h("ion-icon", { slot: "start", name: "add" }), "new")), this.projects.length ? (h("div", { class: "ZeaProjectsBrowser__projects" }, this.projects.map(function (project) { return (h("zea-thumbnail", { icon: h("ion-icon", { name: "folder" }), zeaModelInstance: project, onDblClickThumbnail: function (e) { return _this.dblClickProject.emit(e.detail); } })); }))) : (h("div", null, "No projects.")), this.showCreateProjectDialog && (h("zea-dialog", { shown: true }, h("div", { slot: "title" }, "New Project"), h("div", { slot: "body" }, h("zea-form", { submitText: "CREATE", submitCallback: function (values) { return __awaiter(_this, void 0, void 0, function () {
                var name, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            name = values['project-name'];
                            return [4 /*yield*/, this.projectsClient.create({
                                    name: name,
                                    thumbnail: 'https://placeimg.com/216/122/tech',
                                })];
                        case 1:
                            result = _a.sent();
                            console.log(result);
                            return [2 /*return*/];
                    }
                });
            }); } }, h("zea-input", { label: "Project name", name: "project-name", required: true })))))));
    };
    return class_1;
}());
ZeaProjectsBrowser.style = zeaProjectsBrowserCss;
export { ZeaProjectsBrowser as zea_projects_browser };
