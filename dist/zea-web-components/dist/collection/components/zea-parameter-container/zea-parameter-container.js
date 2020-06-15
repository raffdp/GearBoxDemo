import { Component, h, Prop } from '@stencil/core';
import uxFactory from '../../assets/UxFactory.js';
import '../zea-param-widget-boolean/zea-param-widget-boolean';
import '../zea-param-widget-number/zea-param-widget-number';
import '../zea-param-widget-vec2/zea-param-widget-vec2';
import '../zea-param-widget-vec3/zea-param-widget-vec3';
import '../zea-param-widget-vec4/zea-param-widget-vec4';
import '../zea-param-widget-color/zea-param-widget-color';
import '../zea-param-widget-xfo/zea-param-widget-xfo';
import '../zea-param-widget-string/zea-param-widget-string';
import '../zea-param-widget-bbox/zea-param-widget-bbox';
/**
 * Main class for the component
 */
export class ZeaParameterContainer {
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-parameter-container" }, this.parameterOwner.getParameters().map((parameter, index) => {
            const parameterName = parameter.getName();
            const reg = uxFactory.findWidgetReg(parameter);
            if (!reg) {
                return (h("div", null,
                    "Unable to display parameter '",
                    parameterName,
                    "', value:",
                    parameter.getValue(),
                    ", index: ",
                    index));
            }
            return (h("div", { class: `zea-param-widget-wrap ${reg.widget}-wrap` },
                h("label", { htmlFor: parameterName }, parameterName),
                h("div", { class: "zea-parameter-input-wrap" },
                    h(reg.widget, { id: parameterName, key: index, appData: this.appData, parameter: parameter }))));
        })));
    }
    static get is() { return "zea-parameter-container"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-parameter-container.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-parameter-container.css"]
    }; }
    static get properties() { return {
        "parameterOwner": {
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
                "text": "The parameter owner."
            },
            "attribute": "parameter-owner",
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
}
