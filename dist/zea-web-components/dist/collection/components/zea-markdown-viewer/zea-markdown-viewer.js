import { Component, h, Prop } from '@stencil/core';
import { Remarkable } from 'remarkable';
/**
 * Main class for the component
 */
export class ZeaMarkdownViewer {
    /**
     * Convert the MD markup to html
     * @return {string} the generated html
     */
    convertMdToHtml() {
        const mdConverter = new Remarkable();
        return mdConverter.render(this.mdText);
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        const convertedText = this.convertMdToHtml();
        return h("div", { innerHTML: convertedText });
    }
    static get is() { return "zea-markdown-viewer"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-markdown-viewer.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-markdown-viewer.css"]
    }; }
    static get properties() { return {
        "mdText": {
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
                "text": "MD text to be converted"
            },
            "attribute": "md-text",
            "reflect": false
        }
    }; }
}
