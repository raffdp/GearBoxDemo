import { Component, Event, h, Prop } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaBreadcrumbs {
    /**
     * Get the breadcrumb element
     * @param {any} text The text in the breadcrumb element
     * @return {JSX} The generated JSX
     */
    static breadcrumbEl(text) {
        return (h("a", { href: "#", onClick: (evt) => {
                evt.preventDefault();
            } }, text));
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        const ancestors = [this.folder];
        return (h("div", { class: "ZeaBreadcrumbs" },
            ZeaBreadcrumbs.breadcrumbEl(this.project.name),
            ancestors.length > 0 &&
                ancestors.map((folder) => (h("span", null,
                    h("ion-icon", { name: "arrow-dropright" }),
                    ZeaBreadcrumbs.breadcrumbEl(folder.name))))));
    }
    static get is() { return "zea-breadcrumbs"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-breadcrumbs.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-breadcrumbs.css"]
    }; }
    static get properties() { return {
        "project": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "Project",
                "resolved": "any",
                "references": {
                    "Project": {
                        "location": "import",
                        "path": "@zeainc/drive-lib"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Zea project."
            },
            "attribute": "project",
            "reflect": false
        },
        "folder": {
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
                "text": "Current folder."
            },
            "attribute": "folder",
            "reflect": false
        }
    }; }
    static get events() { return [{
            "method": "clickFolder",
            "name": "clickFolder",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": ""
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }]; }
}
