// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars
import { Component, h, Prop } from '@stencil/core';
/**
 */
export class ZeaCopyLink {
    constructor() {
        this.tooltipDelay = 3000;
        this.link = '';
        this.tooltipIsVisible = false;
        this.tooltipText = 'Copy Link';
    }
    /**
     */
    onCopyClick() {
        /* Select the text field */
        this.linkInput.select();
        this.linkInput.setSelectionRange(0, 99999); /*For mobile devices*/
        /* Copy the text inside the text field */
        document.execCommand('copy');
        this.tooltipIsVisible = true;
        this.tooltipText = 'Link Copied';
        setTimeout(() => {
            this.tooltipIsVisible = false;
            this.tooltipText = 'Copy Link';
        }, this.tooltipDelay);
    }
    /**
     */
    onLinkClick() {
        /* Select the text field */
        this.linkInput.select();
        this.linkInput.setSelectionRange(0, 99999);
    }
    /**
     */
    render() {
        if (!this.link) {
            this.link = window.location.href;
        }
        return (h("div", { class: "zea-copy-link" },
            h("div", { class: "label" }, "Copy Link"),
            h("div", { class: "link-container" },
                h("input", { onClick: this.onLinkClick.bind(this), readOnly: true, class: "link", ref: (el) => (this.linkInput = el), value: this.link }),
                h("div", { class: { active: this.tooltipIsVisible, 'copy-icon': true }, onClick: this.onCopyClick.bind(this) },
                    h("zea-icon", { name: "copy-outline" }),
                    h("div", { class: { tooltip: true } }, this.tooltipText)))));
    }
    static get is() { return "zea-copy-link"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-copy-link.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-copy-link.css"]
    }; }
    static get properties() { return {
        "link": {
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
            "attribute": "link",
            "reflect": false,
            "defaultValue": "''"
        },
        "tooltipIsVisible": {
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
            "attribute": "tooltip-is-visible",
            "reflect": false,
            "defaultValue": "false"
        },
        "tooltipText": {
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
            "attribute": "tooltip-text",
            "reflect": false,
            "defaultValue": "'Copy Link'"
        }
    }; }
}
