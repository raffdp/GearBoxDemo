import { r as registerInstance, c as createEvent, h } from './index-12ee0265.js';

const zeaProjectsBrowserCss = "@import url('https://unpkg.com/tachyons@4/css/tachyons.min.css');.ZeaProjectsBrowser{background-color:var(--color-background-1);color:var(--color-foreground-1);font-family:var(--theme-font-family)}.ZeaProjectsBrowser__title-bar{display:-ms-flexbox;display:flex;height:64px;-ms-flex-align:center;align-items:center;padding:0 1rem;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-flex-pack:justify;justify-content:space-between}.ZeaProjectsBrowser__projects{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}.ZeaProjectsBrowser__projects>*{margin:1rem 0 0 1rem}";

const ZeaProjectsBrowser = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Zea projects.
         */
        this.projects = [];
        this.dblClickProject = createEvent(this, "dblClickProject", 7);
    }
    // eslint-disable-next-line require-jsdoc
    render() {
        return (h("div", { class: "ZeaProjectsBrowser" }, h("div", { class: "ZeaProjectsBrowser__title-bar" }, h("span", null, "Projects"), h("ion-button", { shape: "round", onClick: () => {
                this.showCreateProjectDialog = true;
            } }, h("ion-icon", { slot: "start", name: "add" }), "new")), this.projects.length ? (h("div", { class: "ZeaProjectsBrowser__projects" }, this.projects.map((project) => (h("zea-thumbnail", { icon: h("ion-icon", { name: "folder" }), zeaModelInstance: project, onDblClickThumbnail: (e) => this.dblClickProject.emit(e.detail) }))))) : (h("div", null, "No projects.")), this.showCreateProjectDialog && (h("zea-dialog", { shown: true }, h("div", { slot: "title" }, "New Project"), h("div", { slot: "body" }, h("zea-form", { submitText: "CREATE", submitCallback: async (values) => {
                const name = values['project-name'];
                const result = await this.projectsClient.create({
                    name,
                    thumbnail: 'https://placeimg.com/216/122/tech',
                });
                console.log(result);
            } }, h("zea-input", { label: "Project name", name: "project-name", required: true })))))));
    }
};
ZeaProjectsBrowser.style = zeaProjectsBrowserCss;

export { ZeaProjectsBrowser as zea_projects_browser };
