System.register(["./p-6ab71ff6.system.js","./p-df24b8bd.system.js","./p-d59836f6.system.js"],(function(e){"use strict";var t,a,r,i,n,o;return{setters:[function(e){t=e.r;a=e.h},function(e){r=e.E;i=e.N;n=e.X},function(e){o=e.u}],execute:function(){var s=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-boolean{color:var(--color-foreground-1);background-color:var(--color-background-2)}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}";var c=e("Z",function(){function e(e){t(this,e);this.checked=false;this.inputChanged=this.inputChanged.bind(this)}e.prototype.componentDidLoad=function(){var e=this;if(this.parameter){this.checked=this.parameter.getValue();this.parameter.on("valueChanged",(function(t){e.checked=e.parameter.getValue();if(t.mode==r.REMOTEUSER_SETVALUE){e.cheboxInput.classList.add("user-edited");if(e.remoteUserEditedHighlightId){clearTimeout(e.remoteUserEditedHighlightId)}e.remoteUserEditedHighlightId=setTimeout((function(){e.cheboxInput.classList.remove("user-edited");e.remoteUserEditedHighlightId=null}),1500)}}))}};e.prototype.inputChanged=function(){if(this.appData.undoRedoManager){var e=new i(this.parameter,this.cheboxInput.checked);this.appData.undoRedoManager.addChange(e)}else{this.parameter.setValue(this.cheboxInput.checked)}};e.prototype.render=function(){var e=this;return a("div",{class:"zea-param-widget-boolean"},a("input",{onChange:this.inputChanged,ref:function(t){return e.cheboxInput=t},type:"checkbox",name:this.parameter.getName(),tabindex:"0",checked:this.checked}))};return e}());o.registerWidget("zea-param-widget-boolean",(function(e){return e.constructor.name==n.name}));c.style=s}}}));