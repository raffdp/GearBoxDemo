import { Component, h, Prop } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaPanelProgressBar {
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-panel-progress-bar" },
            h("zea-dialog", { shown: true, allowClose: false, showTitle: false, fullScreenMobile: false, width: '300px' },
                h("div", { slot: "body" },
                    h("slot", null),
                    h("zea-progress-bar", { ref: (el) => (this.progressBar = el), type: "indeterminate" })))));
    }
    static get is() { return "zea-panel-progress-bar"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-panel-progress-bar.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-panel-progress-bar.css"]
    }; }
    static get properties() { return {
        "progressBar": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "progress-bar",
            "reflect": false
        }
    }; }
}
