import { r as registerInstance, h } from './index-12ee0265.js';
import './global-eddac5e6.js';
import './index-ee0e95b8.js';
import './events-a71dfb91.js';
import './buffer-es6-4f6a9935.js';
import './zea-ux.esm-7961f302.js';
import { u as uxFactory } from './UxFactory-ec90b28e.js';
import './zea-param-widget-bbox-aba372e4.js';
import './zea-param-widget-boolean-2ce076ed.js';
import './iro.es-02ba6fa3.js';
import './zea-param-widget-color-586f27d2.js';
import './zea-param-widget-number-570cd9c3.js';
import './zea-param-widget-string-c0e7277f.js';
import './zea-param-widget-vec2-26700d4c.js';
import './zea-param-widget-vec3-bda0866b.js';
import './zea-param-widget-vec4-a109d12b.js';
import './zea-param-widget-xfo-6491fa7f.js';

const zeaParameterContainerCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-parameter-container{color:var(--color-foreground-1);background-color:var(--color-background-2);padding:0.5em}.zea-param-widget-wrap{margin-bottom:1.2em}.zea-param-widget-boolean-wrap{display:-ms-flexbox;display:flex;-ms-flex-direction:row-reverse;flex-direction:row-reverse;-ms-flex-pack:end;justify-content:flex-end;-ms-flex-align:center;align-items:center}label{font-size:0.8em;padding-bottom:0.4em;padding:0.5em 0 0.5em;display:block}";

const ZeaParameterContainer = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-parameter-container" }, this.parameterOwner.getParameters().map((parameter, index) => {
            const parameterName = parameter.getName();
            const reg = uxFactory.findWidgetReg(parameter);
            if (!reg) {
                return (h("div", null, "Unable to display parameter '", parameterName, "', value:", parameter.getValue(), ", index: ", index));
            }
            return (h("div", { class: `zea-param-widget-wrap ${reg.widget}-wrap` }, h("label", { htmlFor: parameterName }, parameterName), h("div", { class: "zea-parameter-input-wrap" }, h(reg.widget, { id: parameterName, key: index, appData: this.appData, parameter: parameter }))));
        })));
    }
};
ZeaParameterContainer.style = zeaParameterContainerCss;

export { ZeaParameterContainer as zea_parameter_container };
