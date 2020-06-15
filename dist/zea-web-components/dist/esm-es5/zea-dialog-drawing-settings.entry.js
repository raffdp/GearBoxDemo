import { r as registerInstance, h } from './index-12ee0265.js';
var zeaDialogDrawingSettingsCss = ".zea-dialog-drawing-settings{color:var(--color-freground-1)}zea-form-disciplines-settings{height:100%}#tabs-container{padding:20px}";
var ZeaDialogDrawingSettings = /** @class */ (function () {
    function ZeaDialogDrawingSettings(hostRef) {
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
    ZeaDialogDrawingSettings.prototype.todoCompletedHandler = function () {
        this.shown = false;
    };
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    ZeaDialogDrawingSettings.prototype.render = function () {
        return (h("div", { class: "zea-dialog-pdf-drawing-settings" }, h("zea-dialog", { allowClose: this.allowClose, showBackdrop: true, shown: this.shown, addPadding: false }, h("div", { slot: "body", id: "tabs-container" }, h("zea-tabs", { orientation: "horizontal", density: "small" }, h("div", { slot: "tab-bar" }, "Drawing Disciplines"), h("zea-form-disciplines-settings", null), h("div", { slot: "tab-bar" }, "Measurements"), h("zea-form-measurements-settings", null))))));
    };
    return ZeaDialogDrawingSettings;
}());
ZeaDialogDrawingSettings.style = zeaDialogDrawingSettingsCss;
export { ZeaDialogDrawingSettings as zea_dialog_drawing_settings };
