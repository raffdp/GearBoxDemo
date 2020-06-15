import { Component, h, Prop } from '@stencil/core';
import { ZeaWcDataConnector } from '../../utils/ZeaWcDataConnector';
/**
 */
export class ZeaFormDrawingSetup {
    constructor() {
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
        return (h("div", { class: "zea-form-drawing-setup" },
            h("div", { class: "inputs" },
                h("div", { class: "input-container" },
                    h("zea-input-text", { ref: (el) => (this.drawingNumberInput = el), label: "Drawing Number", id: "drawing-number-input" })),
                h("div", { class: "input-container" },
                    h("zea-input-text", { ref: (el) => (this.titleInput = el), label: "Title", id: "title-input" })),
                h("div", { class: "input-container" },
                    h("zea-input-select", { selectCallback: this.onDisciplinesSelect.bind(this), label: "Discipline", id: "discipline-input" }, this.disciplines.map((discipline) => {
                        return (h("zea-input-select-item", { value: discipline },
                            h("div", { class: "discipline-row", id: discipline._id, key: discipline._id },
                                h("div", { class: "discipline-abbreviation", style: { backgroundColor: discipline.color } }, discipline.abbreviation),
                                h("div", { class: "discipline-name" }, discipline.name))));
                    }))),
                h("div", { class: "input-container" },
                    h("zea-input-select", { selectCallback: this.onScalesSelect.bind(this), label: "Scale", id: "scale-input" }, this.scales.map((scale) => {
                        return (h("zea-input-select-item", { value: scale },
                            h("div", { class: "select-item-wrap scale-row", id: scale._id, key: scale._id },
                                h("div", { class: "scale-name" }, scale.name))));
                    })))),
            h("div", { class: "buttons" },
                h("div", null,
                    h("zea-button", { density: "small" }, "FINISHED ALL")),
                h("div", null,
                    h("zea-button", { density: "small" }, "PREVIOUS"),
                    h("zea-button", { density: "small" }, "NEXT")))));
    }
    static get is() { return "zea-form-drawing-setup"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-form-drawing-setup.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-form-drawing-setup.css"]
    }; }
    static get properties() { return {
        "disciplines": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "any[]",
                "resolved": "any[]",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "defaultValue": "[]"
        },
        "scales": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "any[]",
                "resolved": "any[]",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "defaultValue": "[]"
        }
    }; }
}
