import{g as t}from"./p-382b6e3d.js";import{MENU_BACK_BUTTON_PRIORITY as n}from"./p-7261e130.js";import{c as r}from"./p-5254e350.js";const e=t=>r().duration(t?400:300),a=n=>{let a,s;const o=n.width+8,i=r(),c=r();n.isEndSide?(a=o+"px",s="0px"):(a=-o+"px",s="0px"),i.addElement(n.menuInnerEl).fromTo("transform",`translateX(${a})`,`translateX(${s})`);const u="ios"===t(n),p=u?.2:.25;return c.addElement(n.backdropEl).fromTo("opacity",.01,p),e(u).addAnimation([i,c])},s=n=>{let a,s;const o=t(n),i=n.width;n.isEndSide?(a=-i+"px",s=i+"px"):(a=i+"px",s=-i+"px");const c=r().addElement(n.menuInnerEl).fromTo("transform",`translateX(${s})`,"translateX(0px)"),u=r().addElement(n.contentEl).fromTo("transform","translateX(0px)",`translateX(${a})`),p=r().addElement(n.backdropEl).fromTo("opacity",.01,.32);return e("ios"===o).addAnimation([c,u,p])},o=n=>{const a=t(n),s=n.width*(n.isEndSide?-1:1)+"px",o=r().addElement(n.contentEl).fromTo("transform","translateX(0px)",`translateX(${s})`);return e("ios"===a).addAnimation(o)},i=(()=>{const t=new Map,r=[],e=async t=>{if(await w(),"start"===t||"end"===t){return m(n=>n.side===t&&!n.disabled)||m(n=>n.side===t)}if(null!=t)return m(n=>n.menuId===t);return m(t=>!t.disabled)||(r.length>0?r[0].el:void 0)},i=async()=>(await w(),p()),c=(n,r)=>{t.set(n,r)},u=t=>{const n=t.side;r.filter(r=>r.side===n&&r!==t).forEach(t=>t.disabled=!0)},p=()=>m(t=>t._isOpen),l=()=>r.some(t=>t.isAnimating),m=t=>{const n=r.find(t);if(void 0!==n)return n.el},w=()=>Promise.all(Array.from(document.querySelectorAll("ion-menu")).map(t=>t.componentOnReady()));return c("reveal",o),c("push",s),c("overlay",a),"undefined"!=typeof document&&document.addEventListener("ionBackButton",t=>{const r=p();r&&t.detail.register(n,()=>r.close())}),{registerAnimation:c,get:e,getMenus:async()=>(await w(),r.map(t=>t.el)),getOpen:i,isEnabled:async t=>{const n=await e(t);return!!n&&!n.disabled},swipeGesture:async(t,n)=>{const r=await e(n);return r&&(r.swipeGesture=t),r},isAnimating:async()=>(await w(),l()),isOpen:async t=>{if(null!=t){const n=await e(t);return void 0!==n&&n.isOpen()}return void 0!==await i()},enable:async(t,n)=>{const r=await e(n);return r&&(r.disabled=!t),r},toggle:async t=>{const n=await e(t);return!!n&&n.toggle()},close:async t=>{const n=await(void 0!==t?e(t):i());return void 0!==n&&n.close()},open:async t=>{const n=await e(t);return!!n&&n.open()},_getOpenSync:p,_createAnimation:(n,r)=>{const e=t.get(n);if(!e)throw new Error("animation not registered");return e(r)},_register:t=>{r.indexOf(t)<0&&(t.disabled||u(t),r.push(t))},_unregister:t=>{const n=r.indexOf(t);n>-1&&r.splice(n,1)},_setOpen:async(t,n,r)=>{if(l())return!1;if(n){const n=await i();n&&t.el!==n&&await n.setOpen(!1,!1)}return t._setOpen(n,r)},_setActiveMenu:u}})();export{i as m}