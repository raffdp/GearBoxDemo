import { Component, h, Prop, Listen, State } from '@stencil/core';
import uxFactory from '../../assets/UxFactory.js';
import { ValueSetMode, CodeParameter } from '@zeainc/zea-engine';
import { ParameterValueChange } from '@zeainc/zea-ux';
import 'brace';
/**
 * Main class for the component
 */
export class ZeaParamWidgetCode {
    /**
     * Class constructor
     */
    constructor() {
        this.onInput = this.onInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    /**
     * Listen crtl + s for save
     * @param {any} event the keydown event
     */
    keydownHandler(event) {
        if (event.ctrlKey && event.key == 's') {
            this.onInput();
            event.preventDefault();
        }
        else if (event.key == 'Enter' || event.keyCode == 46) {
            // on Enter or Backspace
            this.resetEditorHeight();
        }
        event.stopPropagation();
    }
    /**
     * Run when component loads
     */
    componentDidLoad() {
        this.setUpInputs();
        this.onValueChanged(ValueSetMode.USER_SETVALUE);
    }
    /**
     * Set up ACE code input
     */
    async setUpInputs() {
        this.editor = ace.edit(this.editorContainer);
        // this.editor = acemodule.default.edit(this.editorContainer)
        // this.editor.config.setModuleUrl('ace/mode/javascript_worker', jsWorkerUrl)
        await import('brace/theme/chrome.js');
        this.editor.setTheme('ace/theme/chrome');
        await import('brace/mode/javascript.js');
        this.editor.session.setMode('ace/mode/javascript');
        this.parameter.on('valueChanged', (event) => {
            this.onValueChanged(event.mode);
        });
    }
    /**
     * Input handler
     */
    onInput() {
        const value = this.editor.getValue();
        if (!this.change) {
            this.change = new ParameterValueChange(this.parameter, value);
            this.appData.undoRedoManager.addChange(this.change);
        }
        else {
            this.change.update({ value });
        }
        this.resetEditorHeight();
    }
    /**
     * Change handler
     */
    onChange() {
        this.onInput();
        this.change = undefined;
    }
    /**
     * Reset editor to content's height
     */
    resetEditorHeight() {
        /* this.editorHeight =
          this.editor.getSession().getScreenLength() *
            this.editor.renderer.lineHeight +
          this.editor.renderer.scroller.getWidth() +
          30 */
    }
    /**
     * Called after component render
     */
    componentDidRender() {
        if (this.editor)
            this.editor.resize();
    }
    /**
     * Value change handler
     * @param {object} event The event object with details about the change.
     */
    onValueChanged(mode) {
        if (!this.change) {
            this.editor.session.setValue(this.parameter.getValue());
            if (mode == ValueSetMode.REMOTEUSER_SETVALUE) {
                this.container.classList.add('user-edited');
                if (this.remoteUserEditedHighlightId)
                    clearTimeout(this.remoteUserEditedHighlightId);
                this.remoteUserEditedHighlightId = setTimeout(() => {
                    this.container.classList.remove('user-edited');
                    this.remoteUserEditedHighlightId = null;
                }, 1500);
            }
        }
        this.resetEditorHeight();
    }
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render() {
        console.log('rendering', this.editorHeight);
        return (h("div", { class: "zea-param-widget-code", ref: (el) => (this.container = el) },
            h("div", { style: { height: `${this.editorHeight}px` }, class: "editor-container", ref: (el) => (this.editorContainer = el) })));
    }
    static get is() { return "zea-param-widget-code"; }
    static get originalStyleUrls() { return {
        "$": ["zea-param-widget-code.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-param-widget-code.css"]
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
    static get states() { return {
        "editorHeight": {}
    }; }
    static get listeners() { return [{
            "name": "keydown",
            "method": "keydownHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }]; }
}
uxFactory.registerWidget('zea-param-widget-code', (p) => p.constructor.name == CodeParameter.name);
