import{r as e,h as a}from"./p-da09bae5.js";import"./p-f249487f.js";import"./p-b57dc4fe.js";import"./p-df6cbb31.js";import"./p-58c3b402.js";import{u as r}from"./p-f9acc9cd.js";import"./p-2feced54.js";import"./p-d120b705.js";import"./p-06836bbf.js";import"./p-659d5eca.js";import"./p-28a31587.js";import"./p-a1503002.js";import"./p-71e7175c.js";import"./p-7a415757.js";import"./p-3938b18c.js";import"./p-47ae9345.js";const t=class{constructor(a){e(this,a)}render(){return a("div",{class:"zea-parameter-container"},this.parameterOwner.getParameters().map((e,t)=>{const o=e.getName(),p=r.findWidgetReg(e);return p?a("div",{class:`zea-param-widget-wrap ${p.widget}-wrap`},a("label",{htmlFor:o},o),a("div",{class:"zea-parameter-input-wrap"},a(p.widget,{id:o,key:t,appData:this.appData,parameter:e}))):a("div",null,"Unable to display parameter '",o,"', value:",e.getValue(),", index: ",t)}))}};t.style=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-parameter-container{color:var(--color-foreground-1);background-color:var(--color-background-2);padding:0.5em}.zea-param-widget-wrap{margin-bottom:1.2em}.zea-param-widget-boolean-wrap{display:-ms-flexbox;display:flex;-ms-flex-direction:row-reverse;flex-direction:row-reverse;-ms-flex-pack:end;justify-content:flex-end;-ms-flex-align:center;align-items:center}label{font-size:0.8em;padding-bottom:0.4em;padding:0.5em 0 0.5em;display:block}";export{t as zea_parameter_container}