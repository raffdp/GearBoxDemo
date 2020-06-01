// eslint-disable-next-line no-unused-vars
import { Component, Event, h, Prop, State } from '@stencil/core';
import { Session } from '@zeainc/zea-collab';
/**
 * ZeaThumbnail.
 */
export class ZeaThumbnail {
    /**
     * Constructor.
     */
    constructor() {
        this.handleClick = this.handleClick.bind(this);
        this.handleDblClick = this.handleDblClick.bind(this);
    }
    // eslint-disable-next-line require-jsdoc
    componentWillLoad() {
        this.subToFileProgress();
    }
    // eslint-disable-next-line require-jsdoc
    componentWillUpdate() {
        this.subToFileProgress();
    }
    /**
     * Subscribe to incoming file progress actions.
     */
    subToFileProgress() {
        if (!this.zeaSession) {
            return;
        }
        this.zeaSession.sub(Session.actions.FILE_WITH_PROGRESS, (payload) => {
            const incomingFile = payload.file;
            if (incomingFile.id !== this.zeaModelInstance.id) {
                return;
            }
            this.fileProgress = incomingFile.progress;
        });
    }
    /**
     * Handle click.
     */
    handleClick() {
        this.clickThumbnail.emit(this.zeaModelInstance);
        this.isSelected = !this.isSelected;
    }
    /**
     * Handle double click.
     */
    handleDblClick() {
        this.dblClickThumbnail.emit(this.zeaModelInstance);
    }
    // eslint-disable-next-line require-jsdoc
    render() {
        return (h("div", { class: {
                ZeaThumbnail: true,
                'ZeaThumbnail--selected': this.isSelected,
            }, title: this.zeaModelInstance.name, onClick: this.handleClick, onDblClick: this.handleDblClick },
            this.zeaModelInstance.thumbnail && (h("div", { class: "ZeaThumbnail__thumbnail", style: {
                    backgroundImage: `url("${this.zeaModelInstance.thumbnail}")`,
                } })),
            h("div", { class: "ZeaThumbnail__footer" },
                h("span", { class: "ZeaThumbnail__icon" }, this.icon),
                h("span", { class: "ZeaThumbnail__name" }, this.zeaModelInstance.name)),
            this.fileProgress && (h("div", { class: "ZeaThumbnail__progress", style: {
                    backgroundColor: this.fileProgress.indicatorColor,
                    width: `${this.fileProgress.percentageCompleted}%`,
                } }))));
    }
    static get is() { return "zea-thumbnail"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-thumbnail.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-thumbnail.css"]
    }; }
    static get properties() { return {
        "zeaModelInstance": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "FsObject | Project",
                "resolved": "any",
                "references": {
                    "FsObject": {
                        "location": "import",
                        "path": "@zeainc/drive-lib"
                    },
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
                "text": "The Zea model instance to represent."
            },
            "attribute": "zea-model-instance",
            "reflect": false
        },
        "icon": {
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
            "attribute": "icon",
            "reflect": false
        },
        "zeaSession": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "Session",
                "resolved": "any",
                "references": {
                    "Session": {
                        "location": "import",
                        "path": "@zeainc/zea-collab"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "zea-session",
            "reflect": false
        }
    }; }
    static get states() { return {
        "isSelected": {},
        "fileProgress": {}
    }; }
    static get events() { return [{
            "method": "clickThumbnail",
            "name": "clickThumbnail",
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
        }, {
            "method": "dblClickThumbnail",
            "name": "dblClickThumbnail",
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
