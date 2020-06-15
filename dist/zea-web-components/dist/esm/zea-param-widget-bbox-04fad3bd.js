import { r as registerInstance, h } from './index-12ee0265.js';
import { E, v, N } from './index.esm-f69112c9.js';
import { u as uxFactory } from './UxFactory-caff4fc5.js';

const zeaParamWidgetBboxCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-bbox{color:var(--color-foreground-1);background-color:var(--color-background-2);max-width:400px}input{width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;padding:0.3em;font-size:0.9em;border:1px solid var(--color-grey-3);background-color:var(--color-background-3);text-align:right;color:var(--color-foreground-1)}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}.input-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;margin-bottom:0.5em}.input-wrap label{font-size:0.7em;padding:0.3em 1em 0.3em 0.3em;opacity:0.5;width:1.5em;text-align:center}fieldset{border:1px solid var(--color-grey-3)}legend{color:var(--color-foreground-2);font-size:0.8em}";

const ZeaParamWidgetBbox = class {
    /**
     * Class constructor
     */
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.onInput = this.onInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    /**
     * Run when component loads
     */
    componentDidLoad() {
        if (this.parameter) {
            this.setUpInputs();
            this.onValueChanged(0);
        }
    }
    /**
     * Set the inputs up
     */
    setUpInputs() {
        this.parameter.on('valueChanged', (event) => {
            this.onValueChanged(event.mode);
        });
    }
    /**
     * Value change handler
     * @param {object} event The event object with details about the change.
     */
    onValueChanged(mode) {
        if (!this.change) {
            const bbox = this.parameter.getValue();
            if (bbox.isValid()) {
                this.minxField.value = bbox.p0.x;
                this.minyField.value = bbox.p0.y;
                this.minzField.value = bbox.p0.z;
                this.maxxField.value = bbox.p1.x;
                this.maxyField.value = bbox.p1.y;
                this.maxzField.value = bbox.p1.z;
            }
            if (mode == E.REMOTEUSER_SETVALUE) {
                this.container.classList.add('user-edited');
                if (this.remoteUserEditedHighlightId)
                    clearTimeout(this.remoteUserEditedHighlightId);
                this.remoteUserEditedHighlightId = setTimeout(() => {
                    this.container.classList.remove('user-edited');
                    this.remoteUserEditedHighlightId = null;
                }, 1500);
            }
        }
    }
    /**
     * Input handler
     */
    onInput() {
        // eslint-disable-next-line new-cap
        const value = new v();
        value.p0.set(this.minxField.valueAsNumber, this.minyField.valueAsNumber, this.minzField.valueAsNumber);
        value.p1.set(this.maxxField.valueAsNumber, this.maxyField.valueAsNumber, this.maxzField.valueAsNumber);
        if (!this.change) {
            this.change = new N(this.parameter, value);
            this.appData.undoRedoManager.addChange(this.change);
        }
        else {
            this.change.update({ value });
        }
    }
    /**
     * Change handler
     */
    onChange() {
        this.onInput();
        this.change = undefined;
    }
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-param-widget-bbox", ref: (el) => (this.container = el) }, h("fieldset", null, h("legend", null, "Min"), h("div", { class: "input-wrap" }, h("label", null, "X"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.minxField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), h("div", { class: "input-wrap" }, h("label", null, "Y"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.minyField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), h("div", { class: "input-wrap" }, h("label", null, "Z"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.minzField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" }))), h("fieldset", null, h("legend", null, "Max"), h("div", { class: "input-wrap" }, h("label", null, "X"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.maxxField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), h("div", { class: "input-wrap" }, h("label", null, "Y"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.maxyField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })), h("div", { class: "input-wrap" }, h("label", null, "Z"), h("input", { onInput: this.onInput, onChange: this.onChange, ref: (el) => (this.maxzField = el), id: this.parameter.getName(), type: "number", pattern: "-?[0-9]*(.[0-9]+)?", tabindex: "0" })))));
    }
};
uxFactory.registerWidget('zea-param-widget-bbox', (p) => p.getValue().constructor.name == v.name);
ZeaParamWidgetBbox.style = zeaParamWidgetBboxCss;

export { ZeaParamWidgetBbox as Z };
