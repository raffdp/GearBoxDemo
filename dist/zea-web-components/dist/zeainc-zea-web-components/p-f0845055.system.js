System.register(["./p-6ab71ff6.system.js","./p-df24b8bd.system.js","./p-d59836f6.system.js"],(function(e){"use strict";var t,n,i,r,a,o,s;return{setters:[function(e){t=e.r;n=e.h},function(e){i=e.E;r=e.c;a=e.N;o=e.f},function(e){s=e.u}],execute:function(){var u=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-vec3{color:var(--color-foreground-1);background-color:var(--color-background-2);max-width:400px}.zea-param-widget-vec3 input{width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;margin-bottom:0.5em;color:var(--color-foreground-1);background-color:var(--color-background-3)}.zea-param-widget-vec3 input:last-child{margin-bottom:0}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}.vector-input-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;margin-bottom:0.5em}.vector-input-wrap label{font-size:0.7em;padding:0.3em 1em 0.3em 0.3em;opacity:0.5}input[type='number']{padding:0.3em;font-size:0.9em;border:1px solid var(--color-grey-3);text-align:right}";var d=e("Z",function(){function e(e){t(this,e);this.onInput=this.onInput.bind(this);this.onChange=this.onChange.bind(this)}e.prototype.parameterChangeHandler=function(){this.setUpInputs()};e.prototype.componentDidLoad=function(){if(this.parameter){this.setUpInputs();this.onValueChanged(0)}};e.prototype.setUpInputs=function(){var e=this;this.parameter.on("valueChanged",(function(t){e.onValueChanged(t.mode)}))};e.prototype.onValueChanged=function(e){var t=this;if(!this.change){var n=this.parameter.getValue();this.xField.value=""+this.round(n.x);this.yField.value=""+this.round(n.y);this.zField.value=""+this.round(n.z);if(e==i.REMOTEUSER_SETVALUE){this.container.classList.add("user-edited");if(this.remoteUserEditedHighlightId)clearTimeout(this.remoteUserEditedHighlightId);this.remoteUserEditedHighlightId=setTimeout((function(){t.container.classList.remove("user-edited");t.remoteUserEditedHighlightId=null}),1500)}}};e.prototype.onInput=function(){var e=new r(this.xField.valueAsNumber,this.yField.valueAsNumber,this.zField.valueAsNumber);if(!this.change){this.change=new a(this.parameter,e);this.appData.undoRedoManager.addChange(this.change)}else{this.change.update({value:e})}};e.prototype.onChange=function(){this.onInput();this.change=undefined};e.prototype.round=function(e,t){if(t===void 0){t=6}return Number(Math.round(Number(e+"e"+t))+"e-"+t)};e.prototype.render=function(){var e=this;return n("div",{class:"zea-param-widget-vec3",ref:function(t){return e.container=t}},n("div",{class:"vector-input-wrap"},n("label",null,"X"),n("input",{onInput:this.onInput,onChange:this.onChange,ref:function(t){return e.xField=t},id:this.parameter.getName(),type:"number",pattern:"-?[0-9]*(.[0-9]+)?",tabindex:"0",value:this.xValue})),n("div",{class:"vector-input-wrap"},n("label",null,"Y"),n("input",{onInput:this.onInput,onChange:this.onChange,ref:function(t){return e.yField=t},id:this.parameter.getName(),type:"number",pattern:"-?[0-9]*(.[0-9]+)?",tabindex:"0",value:this.yValue})),n("div",{class:"vector-input-wrap"},n("label",null,"Z"),n("input",{onInput:this.onInput,onChange:this.onChange,ref:function(t){return e.zField=t},id:this.parameter.getName(),type:"number",pattern:"-?[0-9]*(.[0-9]+)?",tabindex:"0",value:this.zValue})))};Object.defineProperty(e,"watchers",{get:function(){return{parameter:["parameterChangeHandler"]}},enumerable:true,configurable:true});return e}());s.registerWidget("zea-param-widget-vec3",(function(e){return e.constructor.name==o.name}));d.style=u}}}));