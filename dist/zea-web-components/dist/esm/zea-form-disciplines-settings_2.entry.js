import { r as registerInstance, c as createEvent, h } from './index-12ee0265.js';
import './global-6e332181.js';
import './index-27446e12.js';
import './events-accbf876.js';
import { Z as ZeaWcDataConnector } from './ZeaWcDataConnector-10ce8ce5.js';

const zeaFormDisciplinesSettingsCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-form-disciplines-settings{color:var(--color-freground-1);width:-webkit-min-content;width:-moz-min-content;width:min-content;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;height:100%}.form-top{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;width:-webkit-min-content;width:-moz-min-content;width:min-content;border:1px solid var(--color-grey-3);padding:10px 10px 10px 20px;border-bottom:none;-ms-flex-positive:0;flex-grow:0}.form-bottom{border:1px solid var(--color-grey-3);-ms-flex-positive:1;flex-grow:1;font-size:13px;position:relative;height:calc(100% - 80px);padding:10px;-webkit-box-sizing:border-box;box-sizing:border-box}zea-input-text{margin:5px}.discipline-abbreviation{text-transform:uppercase;padding:8px;width:15px;height:15px;line-height:15px;text-align:center;border-radius:20px;margin:10px 20px 10px 10px;white-space:nowrap;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}#abbreviation-input{width:100px}#disciplines-input{width:200px}.discipline-row{display:-ms-flexbox;display:flex;width:100%;-ms-flex-align:center;align-items:center}.discipline-edit-row:hover,.discipline-row:hover{background-color:var(--color-grey-2)}.discipline-name{-ms-flex-positive:1;flex-grow:1}.discipline-tools{visibility:hidden;padding:0 3em 0 1em}.discipline-edit-tools zea-icon,.discipline-tools zea-icon{padding:4px}.discipline-edit-tools zea-icon:hover,.discipline-tools zea-icon:hover{background-color:var(--color-background-4);border-radius:15px}.discipline-edit-tools{padding:4px;-ms-flex-positive:1;flex-grow:1;text-align:right;padding:0 3em 0 1em}.discipline-row:hover .discipline-tools{visibility:visible}.discipline-edit-row{display:-ms-flexbox;display:flex;padding-left:10px;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-flex-align:center;align-items:center;display:none}";

const ZeaFormDisciplinesSettings = class {
    constructor(hostRef) {
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
    getDefaultDisciplines() {
        const disciplines = [];
        const disStr = `A	Architectural	#F34235
    C	Civil	#E81D62
    E	Electrical	#292929
    F	Fire Protection	#9B26AF
    FS	Food Service	#6639B6
    G	General	#3E50B4
    GA	Garage Architectural	#2095F2
    GE	Garage Electrical	#02A8F3
    GM	Garage Mechanical	#00BBD3
    GP	Garage Plumbing	#009587
    GS	Garage Structual	#4BAE4F
    H	HVAC	#8AC249
    I	Interior	#CCDB38
    IR	Irrigation	#FEEA3A
    L	Landscape	#FEC006
    M	Mechanical	#FE9700
    P	Plumbing	#FE5621
    Q	Equipment	#785447
    R	Resource	#9D9D9D
    S	Structural	#5F7C8A
    T	Telecommunications	#F34235
    X	Other	#E81D62
    Z	Contractor / Shop Drawings	#292929`;
        disStr.split('\n').forEach((line, index) => {
            line = line.replace(/(^\s*|\s*$)/, ''); // trim
            const cols = line.split('\t');
            disciplines.push({
                type: 'disciplines',
                _id: 'disciplines|default' + index,
                name: cols[1],
                abbreviation: cols[0],
                color: cols[2],
                contentId: this.contentId,
            });
        });
        return disciplines;
    }
    /**
     */
    async applyDefaultDisciplines() {
        return new Promise((resolve) => {
            this.disciplines = this.getDefaultDisciplines();
            let insertCount = 0;
            this.disciplines.forEach((discipline) => {
                this.db.upsertDoc(discipline).then(() => {
                    insertCount++;
                    if (insertCount == this.disciplines.length)
                        resolve();
                });
            });
        });
    }
    /**
     */
    resetDefatuls() {
        return new Promise((resolve) => {
            this.db.destroyDb('disciplines').then(() => {
                this.applyDefaultDisciplines().then(() => {
                    this.refreshDisciplines();
                    resolve();
                });
            });
        });
    }
    /**
     */
    saveDiscipline() {
        const data = {
            type: 'disciplines',
            abbreviation: this.abbrInput.value,
            name: this.nameInput.value,
            color: this.colorInput.value,
            contentId: this.contentId,
        };
        this.abbrInput.value = '';
        this.nameInput.value = '';
        this.db.upsertDoc(data).then(() => {
            this.refreshDisciplines();
        });
    }
    /**
     */
    updateDiscipline(id) {
        const data = {
            type: 'disciplines',
            abbreviation: this.abbrElements[id].value,
            name: this.nameElements[id].value,
            color: this.colorElements[id].value,
            contentId: this.contentId,
            _id: id,
        };
        this.db.upsertDoc(data).then(() => {
            this.refreshDisciplines();
        });
    }
    /**
     */
    refreshDisciplines() {
        this.db
            .getDocs({ type: 'disciplines', limit: 1000 })
            .then((response) => {
            if (!response.docs || !response.docs.length) {
                this.disciplines = this.getDefaultDisciplines();
                this.applyDefaultDisciplines();
                return;
            }
            this.disciplines = response.docs;
        });
    }
    /**
     */
    componentWillLoad() {
        this.refreshDisciplines();
    }
    /**
     */
    deleteDisclipline(id) {
        this.db.deleteDoc(id).then(() => {
            this.refreshDisciplines();
        });
    }
    /**
     */
    componentDidRender() {
        this.dialogResize.emit(this);
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-form-disciplines-settings" }, h("div", { class: "form-top" }, h("div", null, h("zea-input-text", { ref: (el) => (this.abbrInput = el), label: "Abbreviation", id: "abbreviation-input" })), h("div", null, h("zea-input-text", { ref: (el) => (this.nameInput = el), label: "Discipline", id: "disciplines-input" })), h("div", null, h("zea-input", { ref: (el) => (this.colorInput = el), type: "color", label: "Color", showLabel: false, colorPopupAlign: "top-left" })), h("div", null, h("zea-button", { variant: "solid", onClick: this.saveDiscipline.bind(this) }, "ADD NEW")), h("div", null, h("zea-menu-separator", { orientation: "vertical" })), h("div", null, h("zea-menu", { type: "contextual", contextualAlign: "top-right", showAnchor: true, anchorIcon: "ellipsis-vertical" }, h("zea-menu-item", { onClick: this.resetDefatuls.bind(this) }, h("zea-icon", { name: "refresh-circle-outline" }), " Restore Defaults")))), h("div", { class: "form-bottom" }, h("zea-scroll-pane", null, this.disciplines.map((discipline) => {
            return [
                h("div", { ref: (el) => (this.rowElements[discipline._id] = el), class: "discipline-row", id: discipline._id, key: discipline._id }, h("div", { class: "discipline-abbreviation", style: { backgroundColor: discipline.color } }, discipline.abbreviation), h("div", { class: "discipline-name" }, discipline.name), h("div", { class: "discipline-tools" }, h("zea-icon", { name: "create-outline", size: 18, onClick: () => {
                        this.editRowElements[discipline._id].style.display =
                            'flex';
                        this.rowElements[discipline._id].style.display = 'none';
                    } }), h("zea-icon", { size: 18, name: "trash-outline", onClick: () => {
                        this.deleteDisclipline(discipline._id);
                    } }))),
                h("div", { ref: (el) => (this.editRowElements[discipline._id] = el), class: "discipline-edit-row", id: `${discipline._id}-editor`, key: `${discipline._id}-editor` }, h("div", null, h("zea-input-text", { ref: (el) => (this.abbrElements[discipline._id] = el), label: "Abbreviation", id: "abbreviation-input", value: discipline.abbreviation })), h("div", null, h("zea-input-text", { ref: (el) => (this.nameElements[discipline._id] = el), label: "Discipline", value: discipline.name, id: "disciplines-input" })), h("div", null, h("zea-input", { ref: (el) => (this.colorElements[discipline._id] = el), type: "color", label: "Color", showLabel: false, value: discipline.color, colorPopupAlign: "top-left" })), h("div", { class: "discipline-edit-tools" }, h("zea-icon", { name: "checkmark-outline", size: 20, onClick: () => {
                        this.editRowElements[discipline._id].style.display =
                            'none';
                        this.rowElements[discipline._id].style.display = 'flex';
                        this.updateDiscipline(discipline._id);
                    } }), h("zea-icon", { size: 20, name: "close-outline", onClick: () => {
                        this.editRowElements[discipline._id].style.display =
                            'none';
                        this.rowElements[discipline._id].style.display = 'flex';
                    } }))),
            ];
        })))));
    }
};
ZeaFormDisciplinesSettings.style = zeaFormDisciplinesSettingsCss;

const zeaFormMeasurementsSettingsCss = ".zea-form-measurements-settings{color:var(--color-freground-1)}";

const ZeaFormMeasurementsSettings = class {
    constructor(hostRef) {
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
    render() {
        return h("div", { class: "zea-form-measurements-settings" }, this.test);
    }
};
ZeaFormMeasurementsSettings.style = zeaFormMeasurementsSettingsCss;

export { ZeaFormDisciplinesSettings as zea_form_disciplines_settings, ZeaFormMeasurementsSettings as zea_form_measurements_settings };
