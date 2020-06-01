import '@ionic/core';
// eslint-disable-next-line no-unused-vars
import { Component, Event, h, Prop, State } from '@stencil/core';
import { SessionFactory } from '@zeainc/zea-collab';
import yaml from 'js-yaml';
/**
 * ZeaFileSystemBrowser.
 */
export class ZeaFileSystemBrowser {
    constructor() {
        /**
         * Display only FS Objects that match this filter.
         */
        this.filter = '';
    }
    // eslint-disable-next-line require-jsdoc
    componentWillLoad() {
        this.setFolder();
    }
    // eslint-disable-next-line require-jsdoc
    componentWillUpdate() {
        this.setFolder();
    }
    // eslint-disable-next-line require-jsdoc
    componentDidUnload() {
        if (this.unsubFileWithProgress) {
            this.unsubFileWithProgress();
        }
    }
    /**
     * Load README.md file.
     */
    loadReadmeFile() {
        const readmeFile = this.folder.getFileByName('readme.md');
        if (readmeFile) {
            readmeFile.getPlainTextContent().then((plainTextContent) => {
                this.readmeTextContent = plainTextContent;
            });
        }
    }
    /**
     * Files associations.
     */
    loadFileAssociations() {
        var _a;
        if ((_a = this.project.connectedApps) === null || _a === void 0 ? void 0 : _a.length) {
            const promises = this.project.connectedApps.map(async (appId) => {
                const app = await this.project.fetchApp(appId);
                await app.fetchLatestVersion();
                const folder = app.getRootFolder();
                const zeaAppFile = folder.getFileByName('zea-app.yaml');
                if (!zeaAppFile) {
                    throw new Error(`The connected app "${appId}" doesn't have a "zea-app.yaml" file.`);
                }
                const plainTextContent = await zeaAppFile.getPlainTextContent();
                const jsonContent = yaml.safeLoad(plainTextContent);
                return jsonContent;
            });
            Promise.all(promises).then((fileAssociations) => {
                this.fileAssociations = fileAssociations;
            });
        }
    }
    /**
     * Zea Session.
     */
    handleZeaSession() {
        if (this.unsubFileWithProgress) {
            this.unsubFileWithProgress();
        }
        SessionFactory.setSocketURL('https://websocket-staging.zea.live');
        this.zeaSession = SessionFactory.getInstance({ id: 'zea-web-components' }, this.project._id);
    }
    /**
     * Set folder.
     */
    setFolder() {
        if (!this.project) {
            return;
        }
        this.folder = this.folderId
            ? this.project.getFolderById(this.folderId)
            : this.project.getRootFolder();
        this.galleryFolder = this.folder.getFolderByName('gallery');
        this.loadReadmeFile();
        this.loadFileAssociations();
        this.handleZeaSession();
    }
    /**
     * Handle drop.
     * @Param {Event} e Event.
     */
    async handleDrop(e) {
        const { files } = e.dataTransfer;
        await this.folder.addFiles(files);
        await this.project.fetchLatestVersion();
        this.folder = null;
        this.setFolder();
    }
    /**
     * Prevent defaults.
     * @Param {Event} e Event.
     */
    static preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    /**
     * Fetch apps.
     */
    async fetchAvailableApps() {
        this.availableApps = await this.project.fetchAvailableApps();
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        var _a;
        if (!this.folder) {
            return;
        }
        const childrenArray = Object.values(this.folder.children || {})
            .filter((child) => child.name.toLowerCase().includes(this.filter.toLowerCase()))
            .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
        const folders = childrenArray.filter((folder) => folder.isFolder);
        const files = childrenArray.filter((file) => !file.isFolder);
        return (h("div", { class: {
                ZeaFileSystemBrowser: true,
                'ZeaFileSystemBrowser--highlighted': this.isHighlighted,
            }, onDragEnter: (e) => {
                ZeaFileSystemBrowser.preventDefaults(e);
                this.isHighlighted = true;
            }, onDragLeave: (e) => {
                ZeaFileSystemBrowser.preventDefaults(e);
                this.isHighlighted = false;
            }, onDragOver: (e) => {
                ZeaFileSystemBrowser.preventDefaults(e);
                this.isHighlighted = true;
            }, onDrop: async (e) => {
                ZeaFileSystemBrowser.preventDefaults(e);
                this.isHighlighted = false;
                await this.handleDrop(e);
            } },
            h("div", { class: "ZeaFileSystemBrowser__upload-overlay" },
                h("img", { src: "./icon-drop-files-here.png" })),
            h("div", { class: "ZeaFileSystemBrowser__title-bar" },
                h("span", { class: "flex-auto" }, this.project.name),
                h("ion-button", { shape: "round" },
                    h("ion-icon", { slot: "start", name: "add" }),
                    "new"),
                h("ion-button", { fill: "clear", title: "Project info" },
                    h("ion-icon", { name: "information-circle-sharp" })),
                h("ion-button", { fill: "clear", title: "Project settings", onClick: () => {
                        this.showProjectSettingsDialog = true;
                    } },
                    h("ion-icon", { name: "settings-sharp" })),
                h("ion-button", { fill: "clear", title: "View as list" },
                    h("ion-icon", { name: "list-sharp" }))),
            h("div", { class: "ZeaFileSystemBrowser__breadcrumbs" },
                h("zea-breadcrumbs", { project: this.project, folder: this.folder })),
            h("div", { class: "mh3" },
                h("div", { class: "mb4" },
                    h("p", { class: "ZeaFileSystemBrowser__section-title" }, "Folders"),
                    folders.length ? (h("div", { class: "ZeaFileSystemBrowser__fs-objects" }, folders.map((folder) => (h("zea-thumbnail", { icon: h("ion-icon", { name: "folder" }), zeaModelInstance: folder, onDblClickThumbnail: () => {
                            this.folderId = folder.id;
                            this.changeFolder.emit(folder);
                        } }))))) : (h("div", null, "No folders."))),
                h("div", { class: "mb4" },
                    h("p", { class: "ZeaFileSystemBrowser__section-title" }, "Files"),
                    files.length ? (h("div", { class: "ZeaFileSystemBrowser__fs-objects" }, files.map((file) => (h("zea-thumbnail", { icon: h("ion-icon", { name: "document" }), zeaModelInstance: file, zeaSession: this.zeaSession, onDblClickThumbnail: () => {
                            const forThisMediaType = this.fileAssociations.find((association) => association['media-types'].includes(file.type));
                            if (!forThisMediaType) {
                                window.alert(`The file's media type (${file.type}) doesn't have a valid association.`);
                                return;
                            }
                            const viewWith = forThisMediaType['view-with'];
                            const win = window.open(`${viewWith}?project-id=${this.project._id}&file-id=${file.id}`);
                            win.focus();
                        } }))))) : (h("div", null, "No files."))),
                h("div", { class: "ZeaFileSystemBrowser__gallery-wrapper" }, this.galleryFolder && (h("zea-images-gallery", { folder: this.galleryFolder }))),
                h("div", { class: "ZeaFileSystemBrowser__readme-wrapper" },
                    h("zea-markdown-viewer", { mdText: this.readmeTextContent }))),
            this.showProjectSettingsDialog && (h("zea-dialog", { shown: true, width: "50%" },
                h("div", { slot: "title" }, "Project Settings"),
                h("div", { slot: "body" },
                    h("zea-tabs", null,
                        h("div", { slot: "tab-bar" }, "Manage Apps"),
                        h("div", null,
                            h("div", { class: "f4 mb3" }, "Manage Apps"),
                            h("ion-button", { class: "mb3", onClick: async () => {
                                    await this.fetchAvailableApps();
                                    this.showAppStoreDialog = true;
                                } }, "App Store"),
                            ((_a = this.project.connectedApps) === null || _a === void 0 ? void 0 : _a.length) > 0 ? (h("div", null,
                                h("div", { class: "mb3" }, "The apps below have been connected to this project."),
                                h("ion-list", null, this.project.connectedApps.map((appId) => {
                                    return (h("ion-item", null,
                                        h("ion-label", null, appId),
                                        h("ion-button", { class: "dark-red", fill: "clear", slot: "end", title: "Remove", onClick: async () => {
                                                await this.project.disconnectApp(appId);
                                            } },
                                            h("ion-icon", { name: "close-circle-sharp" }))));
                                })))) : (h("div", null, "No apps have been connected to this project."))),
                        h("div", { slot: "tab-bar" }, "Storage"),
                        h("div", null),
                        h("div", { slot: "tab-bar" }, "Advanced"),
                        h("div", null))))),
            this.showAppStoreDialog && (h("zea-dialog", { shown: true, width: "75%" },
                h("div", { slot: "title" }, "App Store"),
                h("div", { slot: "body" },
                    h("ul", { class: "list pl0 flex flex-wrap" }, this.availableApps.map((app) => (h("li", null,
                        h("button", { class: "AppItem br2 grow shadow-hover mb3 mr3 pa0", title: app.name, type: "button", onClick: async () => {
                                this.currentApp = await this.project.fetchApp(app._id);
                                await this.currentApp.fetchLatestVersion();
                                const appRootFolder = this.currentApp.getRootFolder();
                                const appReadmeFile = appRootFolder.getFileByName('readme.md');
                                if (appReadmeFile) {
                                    appReadmeFile
                                        .getPlainTextContent()
                                        .then((plainTextContent) => {
                                        this.currentAppReadmeTextContent = plainTextContent;
                                    });
                                }
                            } },
                            h("div", { class: "AppItem__Thumbnail br2", style: {
                                    backgroundImage: "url('https://storage.googleapis.com/zea-drive-staging-projects-assets/thumbnail-pdf-viewer.png')",
                                } }),
                            h("div", { class: "AppItem__Footer flex f6 items-center pa1" },
                                h("span", { class: "AppItem__Name" }, app.name)))))))))),
            this.currentApp && (h("zea-dialog", { shown: true, width: "80%" },
                h("div", { class: "flex items-center", slot: "title" },
                    h("span", { class: "flex-auto" }, this.currentApp.name),
                    h("ion-button", { onClick: async () => {
                            await this.project.connectApp(this.currentApp._id);
                        } }, "Install")),
                h("div", { slot: "body" },
                    h("zea-markdown-viewer", { mdText: this.currentAppReadmeTextContent }))))));
    }
    static get is() { return "zea-file-system-browser"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-file-system-browser.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-file-system-browser.css"]
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
        "folderId": {
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
                "text": "Folder Id inside project."
            },
            "attribute": "folder-id",
            "reflect": false
        },
        "filter": {
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
                "text": "Display only FS Objects that match this filter."
            },
            "attribute": "filter",
            "reflect": false,
            "defaultValue": "''"
        }
    }; }
    static get states() { return {
        "folder": {},
        "galleryFolder": {},
        "isHighlighted": {},
        "showProjectSettingsDialog": {},
        "showAppStoreDialog": {},
        "currentApp": {},
        "currentAppReadmeTextContent": {},
        "availableApps": {},
        "readmeTextContent": {},
        "fileAssociations": {}
    }; }
    static get events() { return [{
            "method": "changeFolder",
            "name": "changeFolder",
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
