'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');
require('./global-ad93eec5.js');
require('./index-7e350ca9.js');
require('./buffer-es6-40c1bb4d.js');
require('./index.esm-88e72f8d.js');
const UxFactory = require('./UxFactory-5eea3ad5.js');
require('./zea-param-widget-bbox-d1b3fecd.js');
require('./zea-param-widget-boolean-8b5fb1e7.js');
require('./iro.es-94b38cd2.js');
require('./zea-param-widget-color-0e44d526.js');
require('./zea-param-widget-number-58cc8157.js');
require('./zea-param-widget-string-ad907686.js');
require('./zea-param-widget-vec2-e285c618.js');
require('./zea-param-widget-vec3-add96fc5.js');
require('./zea-param-widget-vec4-8e75f6e7.js');
require('./zea-param-widget-xfo-e2b5a8a1.js');

const zeaParameterContainerCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-parameter-container{color:var(--color-foreground-1);background-color:var(--color-background-2);padding:0.5em}.zea-param-widget-wrap{margin-bottom:1.2em}.zea-param-widget-boolean-wrap{display:-ms-flexbox;display:flex;-ms-flex-direction:row-reverse;flex-direction:row-reverse;-ms-flex-pack:end;justify-content:flex-end;-ms-flex-align:center;align-items:center}label{font-size:0.8em;padding-bottom:0.4em;padding:0.5em 0 0.5em;display:block}";

const ZeaParameterContainer = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render() {
        return (index.h("div", { class: "zea-parameter-container" }, this.parameterOwner.getParameters().map((parameter, index$1) => {
            const parameterName = parameter.getName();
            const reg = UxFactory.uxFactory.findWidgetReg(parameter);
            if (!reg) {
                return (index.h("div", null, "Unable to display parameter '", parameterName, "', value:", parameter.getValue(), ", index: ", index$1));
            }
            return (index.h("div", { class: `zea-param-widget-wrap ${reg.widget}-wrap` }, index.h("label", { htmlFor: parameterName }, parameterName), index.h("div", { class: "zea-parameter-input-wrap" }, index.h(reg.widget, { id: parameterName, key: index$1, appData: this.appData, parameter: parameter }))));
        })));
    }
};
ZeaParameterContainer.style = zeaParameterContainerCss;

exports.zea_parameter_container = ZeaParameterContainer;
