import { r as registerInstance, h } from './index-12ee0265.js';
import './global-6e332181.js';
import './index-27446e12.js';
import './buffer-es6-d7e2ddd2.js';
import './index.esm-f69112c9.js';
import { u as uxFactory } from './UxFactory-caff4fc5.js';
import './zea-param-widget-bbox-04fad3bd.js';
import './zea-param-widget-boolean-b8495bae.js';
import './iro.es-02ba6fa3.js';
import './zea-param-widget-color-968d92e0.js';
import './zea-param-widget-number-2c599c17.js';
import './zea-param-widget-string-5cff8a89.js';
import './zea-param-widget-vec2-893ace78.js';
import './zea-param-widget-vec3-7e4d5e89.js';
import './zea-param-widget-vec4-c6a4dabf.js';
import './zea-param-widget-xfo-837a5474.js';

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
