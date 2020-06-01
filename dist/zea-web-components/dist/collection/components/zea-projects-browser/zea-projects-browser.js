import '@ionic/core';
// eslint-disable-next-line no-unused-vars
import { Component, Event, h, Prop, State } from '@stencil/core';
/**
 * ZeaProjectsBrowser.
 */
export class ZeaProjectsBrowser {
    constructor() {
        /**
         * Zea projects.
         */
        this.projects = [];
    }
    // eslint-disable-next-line require-jsdoc
    render() {
        return (h("div", { class: "ZeaProjectsBrowser" },
            h("div", { class: "ZeaProjectsBrowser__title-bar" },
                h("span", null, "Projects"),
                h("ion-button", { shape: "round", onClick: () => {
                        this.showCreateProjectDialog = true;
                    } },
                    h("ion-icon", { slot: "start", name: "add" }),
                    "new")),
            this.projects.length ? (h("div", { class: "ZeaProjectsBrowser__projects" }, this.projects.map((project) => (h("zea-thumbnail", { icon: h("ion-icon", { name: "folder" }), zeaModelInstance: project, onDblClickThumbnail: (e) => this.dblClickProject.emit(e.detail) }))))) : (h("div", null, "No projects.")),
            this.showCreateProjectDialog && (h("zea-dialog", { shown: true },
                h("div", { slot: "title" }, "New Project"),
                h("div", { slot: "body" },
                    h("zea-form", { submitText: "CREATE", submitCallback: async (values) => {
                            const name = values['project-name'];
                            const result = await this.projectsClient.create({
                                name,
                                thumbnail: 'https://placeimg.com/216/122/tech',
                            });
                            console.log(result);
                        } },
                        h("zea-input", { label: "Project name", name: "project-name", required: true })))))));
    }
    static get is() { return "zea-projects-browser"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-projects-browser.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-projects-browser.css"]
    }; }
    static get properties() { return {
        "projectsClient": {
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
                "text": "Zea projects client."
            },
            "attribute": "projects-client",
            "reflect": false
        },
        "projects": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "Project[]",
                "resolved": "any[]",
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
                "text": "Zea projects."
            },
            "defaultValue": "[]"
        }
    }; }
    static get states() { return {
        "showCreateProjectDialog": {}
    }; }
    static get events() { return [{
            "method": "dblClickProject",
            "name": "dblClickProject",
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
