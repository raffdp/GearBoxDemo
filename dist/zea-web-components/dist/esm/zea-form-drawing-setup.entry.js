import { r as registerInstance, h } from './index-12ee0265.js';
import './global-6e332181.js';
import './index-27446e12.js';
import './events-accbf876.js';
import { Z as ZeaWcDataConnector } from './ZeaWcDataConnector-10ce8ce5.js';

const zeaFormDrawingSetupCss = ".zea-form-drawing-setup{color:var(--color-foreground-1);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;height:100%;width:100%;overflow:hidden}.discipline-row{display:-ms-flexbox;display:flex;width:100%;-ms-flex-align:center;align-items:center}.discipline-row:hover{background-color:var(--color-grey-2)}.discipline-name{-ms-flex-positive:1;flex-grow:1}.discipline-abbreviation{text-transform:uppercase;padding:8px;width:15px;height:15px;line-height:15px;text-align:center;border-radius:20px;margin:5px 10px 5px 5px;white-space:nowrap;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}.input-container{margin-bottom:1em}zea-input-select-item:hover{background-color:var(--color-grey-2)}.scale-row{padding:5px}.inputs{-ms-flex-positive:1;flex-grow:1;padding:1em}.buttons{display:-ms-flexbox;display:flex;padding:1em}.buttons zea-button{margin:5px}.buttons div:nth-child(1){-ms-flex-positive:1;flex-grow:1}";

const ZeaFormDrawingSetup = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         */
        this.disciplines = [];
        /**
         */
        this.scales = [];
        this.db = new ZeaWcDataConnector();
    }
    /**
     *
     */
    onDisciplinesSelect(value) {
        console.log('value', value);
    }
    /**
     *
     */
    onScalesSelect(value) {
        console.log('value', value);
    }
    /**
     *
     */
    componentWillLoad() {
        this.db
            .getDocs({ type: 'disciplines', limit: 100 })
            .then((disciplines) => {
            this.disciplines = disciplines.docs;
        });
        this.scales = [
            { _id: 'scale1', name: `1/32' = 1'0"` },
            { _id: 'scale2', name: `1/16' = 1'0"` },
            { _id: 'scale3', name: `1/8' = 1'0"` },
            { _id: 'scale4', name: `1/4' = 1'0"` },
            { _id: 'scale5', name: `3/8' = 1'0"` },
            { _id: 'scale6', name: `1/32 = 1'0"` },
            { _id: 'scale7', name: `1/32 = 1'0"` },
            { _id: 'scale8', name: `1/32 = 1'0"` },
            { _id: 'scale9', name: `1/32 = 1'0"` },
            { _id: 'scale10', name: `1/32 = 1'0"` },
        ];
    }
    /**
     */
    render() {
        return (h("div", { class: "zea-form-drawing-setup" }, h("div", { class: "inputs" }, h("div", { class: "input-container" }, h("zea-input-text", { ref: (el) => (this.drawingNumberInput = el), label: "Drawing Number", id: "drawing-number-input" })), h("div", { class: "input-container" }, h("zea-input-text", { ref: (el) => (this.titleInput = el), label: "Title", id: "title-input" })), h("div", { class: "input-container" }, h("zea-input-select", { selectCallback: this.onDisciplinesSelect.bind(this), label: "Discipline", id: "discipline-input" }, this.disciplines.map((discipline) => {
            return (h("zea-input-select-item", { value: discipline }, h("div", { class: "discipline-row", id: discipline._id, key: discipline._id }, h("div", { class: "discipline-abbreviation", style: { backgroundColor: discipline.color } }, discipline.abbreviation), h("div", { class: "discipline-name" }, discipline.name))));
        }))), h("div", { class: "input-container" }, h("zea-input-select", { selectCallback: this.onScalesSelect.bind(this), label: "Scale", id: "scale-input" }, this.scales.map((scale) => {
            return (h("zea-input-select-item", { value: scale }, h("div", { class: "select-item-wrap scale-row", id: scale._id, key: scale._id }, h("div", { class: "scale-name" }, scale.name))));
        })))), h("div", { class: "buttons" }, h("div", null, h("zea-button", { density: "small" }, "FINISHED ALL")), h("div", null, h("zea-button", { density: "small" }, "PREVIOUS"), h("zea-button", { density: "small" }, "NEXT")))));
    }
};
ZeaFormDrawingSetup.style = zeaFormDrawingSetupCss;

export { ZeaFormDrawingSetup as zea_form_drawing_setup };
