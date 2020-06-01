import { Component, h, Prop, State, Listen, Element } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaLayout {
    constructor() {
        this.cellCount = 3;
        this.orientation = 'horizontal';
        this.resizeCellA = true;
        this.resizeCellC = true;
        this.cellASize = 100;
        this.cellCSize = 100;
        this.resizeInterval = 50;
        this.showBorders = true;
        this.error = '';
        this.minimumGap = 20;
        this.maximunGap = 50;
    }
    /**
     * Listen for dragstart events
     * @param {any} event The event
     */
    onHandleMouseDown(event) {
        this.activeHandle = event.target;
        document.getElementsByTagName('body')[0].style.cursor =
            this.orientation === 'vertical' ? 'row-resize' : 'col-resize';
        document.getElementsByTagName('body')[0].style.userSelect = 'none';
    }
    /**
     * Listen for dragstart events
     * @param {any} event The event
     */
    onHandleMouseUp() {
        this.activeHandle = null;
        document.getElementsByTagName('body')[0].style.cursor = 'default';
        document.getElementsByTagName('body')[0].style.userSelect = 'initial';
    }
    /**
     * Listen to mousemove event
     * @param {any} event the event
     */
    mouseMoveHandler(event) {
        if (this.activeHandle) {
            const isA = this.activeHandle.classList.contains('zea-handle-a');
            if (this.orientation === 'vertical') {
                if (isA) {
                    this.processDrag(event, 'Y', 'a');
                }
                else {
                    this.processDrag(event, 'Y', 'c');
                }
            }
            else {
                if (isA) {
                    this.processDrag(event, 'X', 'a');
                }
                else {
                    this.processDrag(event, 'X', 'c');
                }
            }
        }
    }
    /**
     * Process drag
     * @param {any} event The event
     * @param {any} axis The axis
     * @param {any} cell The cell
     */
    processDrag(event, axis, cell) {
        const handle = this.activeHandle;
        const parent = handle.parentElement;
        const parentRect = parent.getBoundingClientRect();
        const handleRect = handle.getBoundingClientRect();
        const cellBREct = this.cellB.getBoundingClientRect();
        const side = axis == 'X' ? 'left' : 'top';
        const prop = axis == 'X' ? 'width' : 'height';
        const cellBSize = cellBREct[prop];
        let offset = handleRect[side] - event['client' + axis];
        // change offset sign for the following sum, according to cell
        offset = cell == 'a' ? -offset : offset;
        let newDimension = parentRect[prop] + offset;
        parent.style[prop] = `${newDimension}px`;
        if (newDimension < this.minimumGap) {
            newDimension = this.minimumGap;
        }
        const maxDimension = parentRect[prop] + cellBSize - this.minimumGap;
        if (newDimension > maxDimension) {
            newDimension = maxDimension;
        }
        const cellSizeVar = cell == 'a' ? 'cellASize' : 'cellCSize';
        this[cellSizeVar] = newDimension;
        parent.style[prop] = `${newDimension}px`;
        this.triggerResize(newDimension);
    }
    /**
     * Trigger window resize event
     * @param {any} newDimension The new dimension
     */
    triggerResize(newDimension) {
        window.dispatchEvent(new CustomEvent('resize', {
            bubbles: true,
            detail: newDimension,
        }));
    }
    /**
     */
    layout() {
        let dimension;
        let availableLength;
        if (this.orientation === 'vertical') {
            dimension = 'height';
            availableLength = this.layoutContainer.clientHeight;
        }
        else {
            dimension = 'width';
            availableLength = this.layoutContainer.clientWidth;
        }
        const cellBSize = availableLength - this.cellASize - this.cellCSize;
        this.cellA.style[dimension] = `${this.cellASize}px`;
        this.cellB.style[dimension] = `${cellBSize}px`;
        this.cellC.style[dimension] = `${this.cellCSize}px`;
    }
    /**
     * Prevent the browser drag event from triggering
     * as it hinders the mousemove event
     */
    componentDidLoad() {
        this.mainElement.addEventListener('dragstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        window.addEventListener('resize', () => {
            this.layout();
        });
    }
    /**
     * Prevent the browser drag event from triggering
     * as it hinders the mousemove event
     */
    componentDidRender() {
        this.layout();
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        const cellAStyle = {};
        const cellCStyle = {};
        if (!this.cellASize) {
            this.resizeCellA = false;
        }
        if (!this.cellCSize) {
            this.resizeCellC = false;
        }
        if (this.cellASize !== undefined) {
            if (this.orientation === 'vertical') {
                cellAStyle.height = `${this.cellASize}px`;
            }
            else {
                cellAStyle.width = `${this.cellASize}px`;
            }
        }
        if (this.cellCSize !== undefined) {
            if (this.orientation === 'vertical') {
                cellCStyle.height = `${this.cellCSize}px`;
            }
            else {
                cellCStyle.width = `${this.cellCSize}px`;
            }
        }
        const cellA = (h("div", { class: "zea-layout-cell cell-a", style: cellAStyle, ref: (el) => (this.cellA = el) },
            this.resizeCellA && (h("div", { class: "zea-resize-handle zea-handle-a", onMouseDown: this.onHandleMouseDown.bind(this) })),
            h("slot", { name: "a" })));
        const cellB = (h("div", { class: "zea-layout-cell cell-b", ref: (el) => (this.cellB = el) },
            h("slot", { name: "b" })));
        const cellC = this.cellCount > 2 && (h("div", { class: "zea-layout-cell cell-c", style: cellCStyle, ref: (el) => (this.cellC = el) },
            this.resizeCellC && (h("div", { class: "zea-resize-handle zea-handle-c", onMouseDown: this.onHandleMouseDown.bind(this) })),
            h("slot", { name: "c" })));
        return (h("div", { ref: (el) => (this.layoutContainer = el), class: `zea-layout ${this.orientation} ${this.showBorders ? 'with-borders' : ''}` }, this.error || [cellA, cellB, cellC]));
    }
    static get is() { return "zea-layout"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-layout.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-layout.css"]
    }; }
    static get properties() { return {
        "cellCount": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "cell-count",
            "reflect": false,
            "defaultValue": "3"
        },
        "orientation": {
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
            "attribute": "orientation",
            "reflect": false,
            "defaultValue": "'horizontal'"
        },
        "resizeCellA": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "resize-cell-a",
            "reflect": false,
            "defaultValue": "true"
        },
        "resizeCellC": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "resize-cell-c",
            "reflect": false,
            "defaultValue": "true"
        },
        "cellASize": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "cell-a-size",
            "reflect": false,
            "defaultValue": "100"
        },
        "cellCSize": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "cell-c-size",
            "reflect": false,
            "defaultValue": "100"
        },
        "resizeInterval": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "resize-interval",
            "reflect": false,
            "defaultValue": "50"
        },
        "showBorders": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "show-borders",
            "reflect": false,
            "defaultValue": "true"
        }
    }; }
    static get states() { return {
        "error": {},
        "prevOffset": {},
        "minimumGap": {},
        "maximunGap": {},
        "activeHandle": {}
    }; }
    static get elementRef() { return "mainElement"; }
    static get listeners() { return [{
            "name": "mouseup",
            "method": "onHandleMouseUp",
            "target": "document",
            "capture": false,
            "passive": true
        }, {
            "name": "mousemove",
            "method": "mouseMoveHandler",
            "target": "document",
            "capture": false,
            "passive": true
        }]; }
}
