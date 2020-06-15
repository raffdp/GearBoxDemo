import { r as registerInstance, h, H as Host } from './index-12ee0265.js';
import { g as getIonMode } from './ionic-global-9ae0f2dd.js';
import { c as createColorClasses } from './theme-74c22054.js';
var noteIosCss = ":host{color:var(--color);font-family:var(--ion-font-family, inherit);-webkit-box-sizing:border-box;box-sizing:border-box}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-350, #a6a6a6)}";
var noteMdCss = ":host{color:var(--color);font-family:var(--ion-font-family, inherit);-webkit-box-sizing:border-box;box-sizing:border-box}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-600, #666666);font-size:14px}";
var Note = /** @class */ (function () {
    function Note(hostRef) {
        registerInstance(this, hostRef);
    }
    Note.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), (_a = {}, _a[mode] = true, _a)) }, h("slot", null)));
    };
    return Note;
}());
Note.style = {
    /*STENCIL:MODE:ios*/ ios: noteIosCss,
    /*STENCIL:MODE:md*/ md: noteMdCss
};
export { Note as ion_note };
