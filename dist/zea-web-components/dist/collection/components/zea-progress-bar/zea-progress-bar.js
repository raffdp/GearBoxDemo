import { Component, h, Prop } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaProgressBar {
    constructor() {
        /**
         * The bar type (determinate | indeterminate)
         */
        this.type = 'determinate';
        /**
         * The progress (width) percentage for the bar
         */
        this.percent = 50;
        /**
         * The size (height) of the progress bar
         */
        this.size = 3;
        /**
         * The color for the bar
         */
        this.color = 'var(--color-primary-1)';
        /**
         * The color for the background track
         */
        this.backgroundColor = 'var(--color-primary-3)';
        /**
         * The animation type for the indeterminate bar ( continuous | pulsating)
         */
        this.indeterminateAnimation = 'continuous';
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        return (h("div", { class: `zea-progress-bar ${this.type} ${this.indeterminateAnimation}`, style: {
                backgroundColor: this.backgroundColor,
                height: this.size + 'px',
            } },
            h("div", { class: "progress", style: {
                    width: this.percent + '%',
                    height: this.size + 'px',
                    backgroundColor: this.color,
                } })));
    }
    static get is() { return "zea-progress-bar"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-progress-bar.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-progress-bar.css"]
    }; }
    static get properties() { return {
        "type": {
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
                "text": "The bar type (determinate | indeterminate)"
            },
            "attribute": "type",
            "reflect": false,
            "defaultValue": "'determinate'"
        },
        "percent": {
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
                "text": "The progress (width) percentage for the bar"
            },
            "attribute": "percent",
            "reflect": false,
            "defaultValue": "50"
        },
        "size": {
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
                "text": "The size (height) of the progress bar"
            },
            "attribute": "size",
            "reflect": false,
            "defaultValue": "3"
        },
        "color": {
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
                "text": "The color for the bar"
            },
            "attribute": "color",
            "reflect": false,
            "defaultValue": "'var(--color-primary-1)'"
        },
        "backgroundColor": {
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
                "text": "The color for the background track"
            },
            "attribute": "background-color",
            "reflect": false,
            "defaultValue": "'var(--color-primary-3)'"
        },
        "indeterminateAnimation": {
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
                "text": "The animation type for the indeterminate bar ( continuous | pulsating)"
            },
            "attribute": "indeterminate-animation",
            "reflect": false,
            "defaultValue": "'continuous'"
        }
    }; }
}
