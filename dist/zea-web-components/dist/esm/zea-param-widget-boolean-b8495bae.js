import { r as registerInstance, h } from './index-12ee0265.js';
import { E, N, X as Xe } from './index.esm-f69112c9.js';
import { u as uxFactory } from './UxFactory-caff4fc5.js';

const zeaParamWidgetBooleanCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-boolean{color:var(--color-foreground-1);background-color:var(--color-background-2)}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}";

const ZeaParamWidgetBoolean = class {
    /**
     * Class constructor
     */
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Whether the checkbox should be checked
         */
        this.checked = false;
        this.inputChanged = this.inputChanged.bind(this);
    }
    /**
     * Run when component loads
     */
    componentDidLoad() {
        if (this.parameter) {
            this.checked = this.parameter.getValue();
            this.parameter.on('valueChanged', (event) => {
                this.checked = this.parameter.getValue();
                if (event.mode == E.REMOTEUSER_SETVALUE) {
                    this.cheboxInput.classList.add('user-edited');
                    if (this.remoteUserEditedHighlightId) {
                        clearTimeout(this.remoteUserEditedHighlightId);
                    }
                    this.remoteUserEditedHighlightId = setTimeout(() => {
                        this.cheboxInput.classList.remove('user-edited');
                        this.remoteUserEditedHighlightId = null;
                    }, 1500);
                }
            });
        }
    }
    /**
     * Run when input changes
     */
    inputChanged() {
        if (this.appData.undoRedoManager) {
            const change = new N(this.parameter, this.cheboxInput.checked);
            this.appData.undoRedoManager.addChange(change);
        }
        else {
            this.parameter.setValue(this.cheboxInput.checked);
        }
    }
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-param-widget-boolean" }, h("input", { onChange: this.inputChanged, ref: (el) => (this.cheboxInput = el), type: "checkbox", name: this.parameter.getName(), tabindex: "0", checked: this.checked })));
    }
};
uxFactory.registerWidget('zea-param-widget-boolean', (p) => p.constructor.name == Xe.name);
ZeaParamWidgetBoolean.style = zeaParamWidgetBooleanCss;

export { ZeaParamWidgetBoolean as Z };
