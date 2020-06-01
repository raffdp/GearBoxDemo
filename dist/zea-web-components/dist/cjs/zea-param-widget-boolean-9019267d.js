'use strict';

const index = require('./index-81865576.js');
const zeaUx_esm = require('./zea-ux.esm-aa49a158.js');
const UxFactory = require('./UxFactory-16a95afe.js');

const zeaParamWidgetBooleanCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-boolean{color:var(--color-foreground-1);background-color:var(--color-background-2)}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}";

const ZeaParamWidgetBoolean = class {
    /**
     * Class constructor
     */
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
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
        this.checked = this.parameter.getValue();
        this.parameter.valueChanged.connect((mode) => {
            this.checked = this.parameter.getValue();
            if (mode == zeaUx_esm.E.REMOTEUSER_SETVALUE) {
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
    /**
     * Run when input changes
     */
    inputChanged() {
        if (this.appData.undoRedoManager) {
            const change = new zeaUx_esm.de(this.parameter, this.cheboxInput.checked);
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
        return (index.h("div", { class: "zea-param-widget-boolean" }, index.h("input", { onChange: this.inputChanged, ref: (el) => (this.cheboxInput = el), type: "checkbox", name: this.parameter.getName(), tabindex: "0", checked: this.checked })));
    }
};
UxFactory.uxFactory.registerWidget('zea-param-widget-boolean', (p) => p.constructor.name == zeaUx_esm.fe.name);
ZeaParamWidgetBoolean.style = zeaParamWidgetBooleanCss;

exports.ZeaParamWidgetBoolean = ZeaParamWidgetBoolean;
