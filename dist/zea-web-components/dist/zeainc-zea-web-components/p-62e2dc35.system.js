System.register(["./p-6ab71ff6.system.js","./p-df24b8bd.system.js","./p-d59836f6.system.js"],(function(t){"use strict";var e,n,i,o,r,s;return{setters:[function(t){e=t.r;n=t.h},function(t){i=t.E;o=t.N;r=t.L},function(t){s=t.u}],execute:function(){var a=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-string{color:var(--color-foreground-1);background-color:var(--color-background-2)}input{width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;padding:0.3em;font-size:0.9em;border:1px solid var(--color-grey-3);color:var(--color-foreground-1);background-color:var(--color-background-3)}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}";var d=t("Z",function(){function t(t){e(this,t);this.onInput=this.onInput.bind(this);this.onChange=this.onChange.bind(this)}t.prototype.componentDidLoad=function(){if(this.parameter){this.setUpInputs();this.onValueChanged(i.USER_SETVALUE)}};t.prototype.setUpInputs=function(){var t=this;this.parameter.on("valueChanged",(function(e){t.onValueChanged(e.mode)}))};t.prototype.onValueChanged=function(t){var e=this;if(!this.change){this.txtField.value=this.parameter.getValue();if(t==i.REMOTEUSER_SETVALUE){this.widgetContainer.classList.add("user-edited");if(this.remoteUserEditedHighlightId)clearTimeout(this.remoteUserEditedHighlightId);this.remoteUserEditedHighlightId=setTimeout((function(){e.widgetContainer.classList.remove("user-edited");e.remoteUserEditedHighlightId=null}),1500)}}};t.prototype.onInput=function(){var t=this.txtField.value;if(!this.change){this.change=new o(this.parameter,t);this.appData.undoRedoManager.addChange(this.change)}else{this.change.update({value:t})}};t.prototype.onChange=function(){this.onInput();this.change=undefined};t.prototype.render=function(){var t=this;return n("div",{class:"zea-param-widget-string",ref:function(e){return t.widgetContainer=e}},n("input",{onInput:this.onInput,onChange:this.onChange,ref:function(e){return t.txtField=e},id:this.parameter.getName(),type:"text",tabindex:"0"}))};return t}());s.registerWidget("zea-param-widget-string",(function(t){return t.constructor.name==r.name}));d.style=a}}}));