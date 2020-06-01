'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaProjectsBrowserCss = "@import url('https://unpkg.com/tachyons@4/css/tachyons.min.css');.ZeaProjectsBrowser{background-color:var(--color-background-1);color:var(--color-foreground-1);font-family:var(--theme-font-family)}.ZeaProjectsBrowser__title-bar{display:-ms-flexbox;display:flex;height:64px;-ms-flex-align:center;align-items:center;padding:0 1rem;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-flex-pack:justify;justify-content:space-between}.ZeaProjectsBrowser__projects{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}.ZeaProjectsBrowser__projects>*{margin:1rem 0 0 1rem}";

const ZeaProjectsBrowser = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        /**
         * Zea projects.
         */
        this.projects = [];
        this.dblClickProject = index.createEvent(this, "dblClickProject", 7);
    }
    // eslint-disable-next-line require-jsdoc
    render() {
        return (index.h("div", { class: "ZeaProjectsBrowser" }, index.h("div", { class: "ZeaProjectsBrowser__title-bar" }, index.h("span", null, "Projects"), index.h("ion-button", { shape: "round", onClick: () => {
                this.showCreateProjectDialog = true;
            } }, index.h("ion-icon", { slot: "start", name: "add" }), "new")), this.projects.length ? (index.h("div", { class: "ZeaProjectsBrowser__projects" }, this.projects.map((project) => (index.h("zea-thumbnail", { icon: index.h("ion-icon", { name: "folder" }), zeaModelInstance: project, onDblClickThumbnail: (e) => this.dblClickProject.emit(e.detail) }))))) : (index.h("div", null, "No projects.")), this.showCreateProjectDialog && (index.h("zea-dialog", { shown: true }, index.h("div", { slot: "title" }, "New Project"), index.h("div", { slot: "body" }, index.h("zea-form", { submitText: "CREATE", submitCallback: async (values) => {
                const name = values['project-name'];
                const result = await this.projectsClient.create({
                    name,
                    thumbnail: 'https://placeimg.com/216/122/tech',
                });
                console.log(result);
            } }, index.h("zea-input", { label: "Project name", name: "project-name", required: true })))))));
    }
};
ZeaProjectsBrowser.style = zeaProjectsBrowserCss;

exports.zea_projects_browser = ZeaProjectsBrowser;
