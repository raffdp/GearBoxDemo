import{r as t,h as o,H as n,d as e}from"./p-da09bae5.js";import{g as i,c as r}from"./p-382b6e3d.js";import"./p-7261e130.js";import{c as a,h as s}from"./p-5b51185b.js";import"./p-54ff9b40.js";import"./p-5254e350.js";import{m as d}from"./p-9bc70ee8.js";import{u as l}from"./p-2540819a.js";const c=class{constructor(o){t(this,o),this.visible=!1,this.disabled=!1,this.autoHide=!0,this.type="button",this.onClick=async()=>d.toggle(this.menu)}componentDidLoad(){this.visibilityChanged()}async visibilityChanged(){this.visible=await l(this.menu)}render(){const{color:t,disabled:e}=this,d=i(this),l=r.get("menuIcon","ios"===d?"menu-outline":"menu-sharp"),c=this.autoHide&&!this.visible,p={type:this.type};return o(n,{onClick:this.onClick,"aria-disabled":e?"true":null,"aria-hidden":c?"true":null,class:Object.assign(Object.assign({[d]:!0},a(t)),{button:!0,"menu-button-hidden":c,"menu-button-disabled":e,"in-toolbar":s("ion-toolbar",this.el),"in-toolbar-color":s("ion-toolbar[color]",this.el),"ion-activatable":!0,"ion-focusable":!0})},o("button",Object.assign({},p,{disabled:e,class:"button-native"}),o("span",{class:"button-inner"},o("slot",null,o("ion-icon",{icon:l,mode:d,lazy:!1}))),"md"===d&&o("ion-ripple-effect",{type:"unbounded"})))}get el(){return e(this)}};c.style={ios:':host{--background:transparent;--color-focused:currentColor;--border-radius:initial;--padding-top:0;--padding-bottom:0;color:var(--color);text-align:center;text-decoration:none;text-overflow:ellipsis;text-transform:none;white-space:nowrap;-webkit-font-kerning:none;font-kerning:none}.button-native{border-radius:var(--border-radius);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;border:0;outline:none;background:var(--background);line-height:1;cursor:pointer;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.button-native{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.button-inner{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;z-index:1}ion-icon{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;pointer-events:none}:host(.menu-button-hidden){display:none}:host(.menu-button-disabled){cursor:default;opacity:0.5;pointer-events:none}:host(.ion-focused) .button-native{color:var(--color-focused)}:host(.ion-focused) .button-native::after{background:var(--background-focused);opacity:var(--background-focused-opacity)}.button-native::after{left:0;right:0;top:0;bottom:0;position:absolute;content:"";opacity:0}@media (any-hover: hover){:host(:hover) .button-native{color:var(--color-hover)}:host(:hover) .button-native::after{background:var(--background-hover);opacity:var(--background-hover-opacity, 0)}}:host(.ion-color) .button-native{color:var(--ion-color-base)}:host(.in-toolbar:not(.in-toolbar-color)){color:var(--ion-toolbar-color, var(--color))}:host{--background-focused:currentColor;--background-focused-opacity:.1;--border-radius:4px;--color:var(--ion-color-primary, #3880ff);--padding-start:5px;--padding-end:5px;height:32px;font-size:31px}:host(.ion-activated){opacity:0.4}@media (any-hover: hover){:host(:hover){opacity:0.6}}'};export{c as ion_menu_button}