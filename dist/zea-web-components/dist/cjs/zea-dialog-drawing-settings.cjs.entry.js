'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaDialogDrawingSettingsCss = ".zea-dialog-drawing-settings{color:var(--color-freground-1)}zea-form-disciplines-settings{height:100%}#tabs-container{padding:20px}";

const ZeaDialogDrawingSettings = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
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
        return (index.h("div", { class: "zea-dialog-pdf-drawing-settings" }, index.h("zea-dialog", { allowClose: this.allowClose, showBackdrop: true, shown: this.shown, addPadding: false }, index.h("div", { slot: "body", id: "tabs-container" }, index.h("zea-tabs", { orientation: "horizontal", density: "small" }, index.h("div", { slot: "tab-bar" }, "Drawing Disciplines"), index.h("zea-form-disciplines-settings", null), index.h("div", { slot: "tab-bar" }, "Measurements"), index.h("zea-form-measurements-settings", null))))));
    }
};
ZeaDialogDrawingSettings.style = zeaDialogDrawingSettingsCss;

exports.zea_dialog_drawing_settings = ZeaDialogDrawingSettings;
