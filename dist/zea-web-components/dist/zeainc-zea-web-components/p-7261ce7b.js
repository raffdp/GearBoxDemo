import{r as t,h as s}from"./p-da09bae5.js";import{E as e,N as o,X as i}from"./p-d3472632.js";import{u as a}from"./p-c1d211b7.js";const r=class{constructor(s){t(this,s),this.checked=!1,this.inputChanged=this.inputChanged.bind(this)}componentDidLoad(){this.parameter&&(this.checked=this.parameter.getValue(),this.parameter.on("valueChanged",t=>{this.checked=this.parameter.getValue(),t.mode==e.REMOTEUSER_SETVALUE&&(this.cheboxInput.classList.add("user-edited"),this.remoteUserEditedHighlightId&&clearTimeout(this.remoteUserEditedHighlightId),this.remoteUserEditedHighlightId=setTimeout(()=>{this.cheboxInput.classList.remove("user-edited"),this.remoteUserEditedHighlightId=null},1500))}))}inputChanged(){if(this.appData.undoRedoManager){const t=new o(this.parameter,this.cheboxInput.checked);this.appData.undoRedoManager.addChange(t)}else this.parameter.setValue(this.cheboxInput.checked)}render(){return s("div",{class:"zea-param-widget-boolean"},s("input",{onChange:this.inputChanged,ref:t=>this.cheboxInput=t,type:"checkbox",name:this.parameter.getName(),tabindex:"0",checked:this.checked}))}};a.registerWidget("zea-param-widget-boolean",t=>t.constructor.name==i.name),r.style=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-param-widget-boolean{color:var(--color-foreground-1);background-color:var(--color-background-2)}.user-edited{-webkit-box-shadow:0 0 8px var(--color-success-1);box-shadow:0 0 8px var(--color-success-1);margin:0px}";export{r as Z}