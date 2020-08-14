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
import './global-6e332181.js';
import './index-27446e12.js';
import './events-accbf876.js';
import { Z as ZeaWcDataConnector } from './ZeaWcDataConnector-10ce8ce5.js';
var zeaFormDisciplinesSettingsCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-form-disciplines-settings{color:var(--color-freground-1);width:-webkit-min-content;width:-moz-min-content;width:min-content;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;height:100%}.form-top{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;width:-webkit-min-content;width:-moz-min-content;width:min-content;border:1px solid var(--color-grey-3);padding:10px 10px 10px 20px;border-bottom:none;-ms-flex-positive:0;flex-grow:0}.form-bottom{border:1px solid var(--color-grey-3);-ms-flex-positive:1;flex-grow:1;font-size:13px;position:relative;height:calc(100% - 80px);padding:10px;-webkit-box-sizing:border-box;box-sizing:border-box}zea-input-text{margin:5px}.discipline-abbreviation{text-transform:uppercase;padding:8px;width:15px;height:15px;line-height:15px;text-align:center;border-radius:20px;margin:10px 20px 10px 10px;white-space:nowrap;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}#abbreviation-input{width:100px}#disciplines-input{width:200px}.discipline-row{display:-ms-flexbox;display:flex;width:100%;-ms-flex-align:center;align-items:center}.discipline-edit-row:hover,.discipline-row:hover{background-color:var(--color-grey-2)}.discipline-name{-ms-flex-positive:1;flex-grow:1}.discipline-tools{visibility:hidden;padding:0 3em 0 1em}.discipline-edit-tools zea-icon,.discipline-tools zea-icon{padding:4px}.discipline-edit-tools zea-icon:hover,.discipline-tools zea-icon:hover{background-color:var(--color-background-4);border-radius:15px}.discipline-edit-tools{padding:4px;-ms-flex-positive:1;flex-grow:1;text-align:right;padding:0 3em 0 1em}.discipline-row:hover .discipline-tools{visibility:visible}.discipline-edit-row{display:-ms-flexbox;display:flex;padding-left:10px;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-flex-align:center;align-items:center;display:none}";
var ZeaFormDisciplinesSettings = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        /**
         */
        this.contentId = 'none';
        /**
         */
        this.disciplines = [];
        /**
         */
        this.db = new ZeaWcDataConnector();
        this.rowElements = {};
        this.editRowElements = {};
        this.nameElements = {};
        this.abbrElements = {};
        this.colorElements = {};
        this.dialogResize = createEvent(this, "dialogResize", 7);
    }
    /**
     */
    class_1.prototype.getDefaultDisciplines = function () {
        var _this = this;
        var disciplines = [];
        var disStr = "A\tArchitectural\t#F34235\n    C\tCivil\t#E81D62\n    E\tElectrical\t#292929\n    F\tFire Protection\t#9B26AF\n    FS\tFood Service\t#6639B6\n    G\tGeneral\t#3E50B4\n    GA\tGarage Architectural\t#2095F2\n    GE\tGarage Electrical\t#02A8F3\n    GM\tGarage Mechanical\t#00BBD3\n    GP\tGarage Plumbing\t#009587\n    GS\tGarage Structual\t#4BAE4F\n    H\tHVAC\t#8AC249\n    I\tInterior\t#CCDB38\n    IR\tIrrigation\t#FEEA3A\n    L\tLandscape\t#FEC006\n    M\tMechanical\t#FE9700\n    P\tPlumbing\t#FE5621\n    Q\tEquipment\t#785447\n    R\tResource\t#9D9D9D\n    S\tStructural\t#5F7C8A\n    T\tTelecommunications\t#F34235\n    X\tOther\t#E81D62\n    Z\tContractor / Shop Drawings\t#292929";
        disStr.split('\n').forEach(function (line, index) {
            line = line.replace(/(^\s*|\s*$)/, ''); // trim
            var cols = line.split('\t');
            disciplines.push({
                type: 'disciplines',
                _id: 'disciplines|default' + index,
                name: cols[1],
                abbreviation: cols[0],
                color: cols[2],
                contentId: _this.contentId,
            });
        });
        return disciplines;
    };
    /**
     */
    class_1.prototype.applyDefaultDisciplines = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.disciplines = _this.getDefaultDisciplines();
                        var insertCount = 0;
                        _this.disciplines.forEach(function (discipline) {
                            _this.db.upsertDoc(discipline).then(function () {
                                insertCount++;
                                if (insertCount == _this.disciplines.length)
                                    resolve();
                            });
                        });
                    })];
            });
        });
    };
    /**
     */
    class_1.prototype.resetDefatuls = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.db.destroyDb('disciplines').then(function () {
                _this.applyDefaultDisciplines().then(function () {
                    _this.refreshDisciplines();
                    resolve();
                });
            });
        });
    };
    /**
     */
    class_1.prototype.saveDiscipline = function () {
        var _this = this;
        var data = {
            type: 'disciplines',
            abbreviation: this.abbrInput.value,
            name: this.nameInput.value,
            color: this.colorInput.value,
            contentId: this.contentId,
        };
        this.abbrInput.value = '';
        this.nameInput.value = '';
        this.db.upsertDoc(data).then(function () {
            _this.refreshDisciplines();
        });
    };
    /**
     */
    class_1.prototype.updateDiscipline = function (id) {
        var _this = this;
        var data = {
            type: 'disciplines',
            abbreviation: this.abbrElements[id].value,
            name: this.nameElements[id].value,
            color: this.colorElements[id].value,
            contentId: this.contentId,
            _id: id,
        };
        this.db.upsertDoc(data).then(function () {
            _this.refreshDisciplines();
        });
    };
    /**
     */
    class_1.prototype.refreshDisciplines = function () {
        var _this = this;
        this.db
            .getDocs({ type: 'disciplines', limit: 1000 })
            .then(function (response) {
            if (!response.docs || !response.docs.length) {
                _this.disciplines = _this.getDefaultDisciplines();
                _this.applyDefaultDisciplines();
                return;
            }
            _this.disciplines = response.docs;
        });
    };
    /**
     */
    class_1.prototype.componentWillLoad = function () {
        this.refreshDisciplines();
    };
    /**
     */
    class_1.prototype.deleteDisclipline = function (id) {
        var _this = this;
        this.db.deleteDoc(id).then(function () {
            _this.refreshDisciplines();
        });
    };
    /**
     */
    class_1.prototype.componentDidRender = function () {
        this.dialogResize.emit(this);
    };
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    class_1.prototype.render = function () {
        var _this = this;
        return (h("div", { class: "zea-form-disciplines-settings" }, h("div", { class: "form-top" }, h("div", null, h("zea-input-text", { ref: function (el) { return (_this.abbrInput = el); }, label: "Abbreviation", id: "abbreviation-input" })), h("div", null, h("zea-input-text", { ref: function (el) { return (_this.nameInput = el); }, label: "Discipline", id: "disciplines-input" })), h("div", null, h("zea-input", { ref: function (el) { return (_this.colorInput = el); }, type: "color", label: "Color", showLabel: false, colorPopupAlign: "top-left" })), h("div", null, h("zea-button", { variant: "solid", onClick: this.saveDiscipline.bind(this) }, "ADD NEW")), h("div", null, h("zea-menu-separator", { orientation: "vertical" })), h("div", null, h("zea-menu", { type: "contextual", contextualAlign: "top-right", showAnchor: true, anchorIcon: "ellipsis-vertical" }, h("zea-menu-item", { onClick: this.resetDefatuls.bind(this) }, h("zea-icon", { name: "refresh-circle-outline" }), " Restore Defaults")))), h("div", { class: "form-bottom" }, h("zea-scroll-pane", null, this.disciplines.map(function (discipline) {
            return [
                h("div", { ref: function (el) { return (_this.rowElements[discipline._id] = el); }, class: "discipline-row", id: discipline._id, key: discipline._id }, h("div", { class: "discipline-abbreviation", style: { backgroundColor: discipline.color } }, discipline.abbreviation), h("div", { class: "discipline-name" }, discipline.name), h("div", { class: "discipline-tools" }, h("zea-icon", { name: "create-outline", size: 18, onClick: function () {
                        _this.editRowElements[discipline._id].style.display =
                            'flex';
                        _this.rowElements[discipline._id].style.display = 'none';
                    } }), h("zea-icon", { size: 18, name: "trash-outline", onClick: function () {
                        _this.deleteDisclipline(discipline._id);
                    } }))),
                h("div", { ref: function (el) { return (_this.editRowElements[discipline._id] = el); }, class: "discipline-edit-row", id: discipline._id + "-editor", key: discipline._id + "-editor" }, h("div", null, h("zea-input-text", { ref: function (el) { return (_this.abbrElements[discipline._id] = el); }, label: "Abbreviation", id: "abbreviation-input", value: discipline.abbreviation })), h("div", null, h("zea-input-text", { ref: function (el) { return (_this.nameElements[discipline._id] = el); }, label: "Discipline", value: discipline.name, id: "disciplines-input" })), h("div", null, h("zea-input", { ref: function (el) { return (_this.colorElements[discipline._id] = el); }, type: "color", label: "Color", showLabel: false, value: discipline.color, colorPopupAlign: "top-left" })), h("div", { class: "discipline-edit-tools" }, h("zea-icon", { name: "checkmark-outline", size: 20, onClick: function () {
                        _this.editRowElements[discipline._id].style.display =
                            'none';
                        _this.rowElements[discipline._id].style.display = 'flex';
                        _this.updateDiscipline(discipline._id);
                    } }), h("zea-icon", { size: 20, name: "close-outline", onClick: function () {
                        _this.editRowElements[discipline._id].style.display =
                            'none';
                        _this.rowElements[discipline._id].style.display = 'flex';
                    } }))),
            ];
        })))));
    };
    return class_1;
}());
ZeaFormDisciplinesSettings.style = zeaFormDisciplinesSettingsCss;
var zeaFormMeasurementsSettingsCss = ".zea-form-measurements-settings{color:var(--color-freground-1)}";
var ZeaFormMeasurementsSettings = /** @class */ (function () {
    function ZeaFormMeasurementsSettings(hostRef) {
        registerInstance(this, hostRef);
        /**
         * A test prop.
         */
        this.test = 'Hello World';
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    ZeaFormMeasurementsSettings.prototype.render = function () {
        return h("div", { class: "zea-form-measurements-settings" }, this.test);
    };
    return ZeaFormMeasurementsSettings;
}());
ZeaFormMeasurementsSettings.style = zeaFormMeasurementsSettingsCss;
export { ZeaFormDisciplinesSettings as zea_form_disciplines_settings, ZeaFormMeasurementsSettings as zea_form_measurements_settings };
