import { Component, h, Prop } from '@stencil/core';
import uxFactory from '../../assets/UxFactory.js';
import { ValueSetMode, BooleanParameter } from '@zeainc/zea-engine';
import { ParameterValueChange } from '@zeainc/zea-ux';
/**
 * Main class for the component
 */
export class ZeaParamWidgetBoolean {
    /**
     * Class constructor
     */
    constructor() {
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
                if (event.mode == ValueSetMode.REMOTEUSER_SETVALUE) {
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
            const change = new ParameterValueChange(this.parameter, this.cheboxInput.checked);
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
        return (h("div", { class: "zea-param-widget-boolean" },
            h("input", { onChange: this.inputChanged, ref: (el) => (this.cheboxInput = el), type: "checkbox", name: this.parameter.getName(), tabindex: "0", checked: this.checked })));
    }
    static get is() { return "zea-param-widget-boolean"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-param-widget-boolean.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-param-widget-boolean.css"]
    }; }
    static get properties() { return {
        "parameter": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Parameter to be edited"
            },
            "attribute": "parameter",
            "reflect": false
        },
        "checked": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Whether the checkbox should be checked"
            },
            "attribute": "checked",
            "reflect": false,
            "defaultValue": "false"
        },
        "appData": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The application data"
            },
            "attribute": "app-data",
            "reflect": false
        }
    }; }
}
uxFactory.registerWidget('zea-param-widget-boolean', (p) => p.constructor.name == BooleanParameter.name);
