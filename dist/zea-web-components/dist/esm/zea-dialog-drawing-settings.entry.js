import { r as registerInstance, h } from './index-12ee0265.js';

const zeaDialogDrawingSettingsCss = ".zea-dialog-drawing-settings{color:var(--color-freground-1)}zea-form-disciplines-settings{height:100%}#tabs-container{padding:20px}";

const ZeaDialogDrawingSettings = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         */
        this.allowClose = true;
        /**
         */
        this.shown = false;
        /**
         */
        this.showLabels = true;
    }
    /**
     */
    todoCompletedHandler() {
        this.shown = false;
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-dialog-pdf-drawing-settings" }, h("zea-dialog", { allowClose: this.allowClose, showBackdrop: true, shown: this.shown, addPadding: false }, h("div", { slot: "body", id: "tabs-container" }, h("zea-tabs", { orientation: "horizontal", density: "small" }, h("div", { slot: "tab-bar" }, "Drawing Disciplines"), h("zea-form-disciplines-settings", null), h("div", { slot: "tab-bar" }, "Measurements"), h("zea-form-measurements-settings", null))))));
    }
};
ZeaDialogDrawingSettings.style = zeaDialogDrawingSettingsCss;

export { ZeaDialogDrawingSettings as zea_dialog_drawing_settings };
