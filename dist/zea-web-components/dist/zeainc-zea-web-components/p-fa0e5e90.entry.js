import{r as e,h as i,c as t}from"./p-da09bae5.js";const s=class{constructor(i){e(this,i),this.allowClose=!0,this.shown=!1,this.showLabels=!0}todoCompletedHandler(){this.shown=!1}userRegisteredHandler(){console.log("userRegistered"),this.shown=!1}render(){return i("div",{class:"zea-dialog-profile"},i("zea-dialog",{width:"320px",allowClose:this.allowClose,showBackdrop:!0,shown:this.shown,addPadding:!1},i("div",{slot:"body"},i("div",{class:"scrollpane-container"},i("zea-scroll-pane",null,i("zea-form-profile",{userData:this.userData,showLabels:this.showLabels,welcomeHtml:"My Profile"}))))))}};s.style=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-dialog-profile{color:var(--color-foreground-1)}.scrollpane-container{width:100%;height:100%;padding:10px;-webkit-box-sizing:border-box;box-sizing:border-box}";const a=class{constructor(i){e(this,i),this.submitText="SUBMIT",this.validate=!0,this.isValid=!0,this.formValue={},this.inputs=[]}getFormValue(){return this.checkValidation(),this.inputs.forEach(e=>{this.formValue[e.name]=e.value}),this.formValue}checkValidation(){if(!this.validate)return!0;for(let e=0;e<this.inputs.length;e++){const i=this.inputs[e];if(!i.isValid)return i.invalidMessageShown=!0,this.isValid=!1,!1;i.invalidMessageShown=!1,this.isValid=!0}return!0}onSubmit(){this.submitCallback&&this.submitCallback(this.getFormValue())}componentDidRender(){this.setupChildren()}setupChildren(){this.formContainer.querySelector("slot").assignedElements().forEach(e=>{e.tagName.match(/^ZEA-INPUT/i)&&this.inputs.push(e)})}render(){return i("div",{class:"zea-form",ref:e=>this.formContainer=e},i("slot",null),i("zea-button",{onClick:this.onSubmit.bind(this),class:"submit"},this.submitText))}};a.style=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-form{color:var(--color-foreground-1)}zea-button.submit{margin-top:2em;width:100%}";const o=class{constructor(i){e(this,i),this.welcomeHtml="Welcome to Zea Construction. We just need <br />a few details and\n  then you're ready to go.",this.submitButtonText="SAVE",this.showLabels=!0,this.userData={},this.userRegistered=t(this,"userRegistered",7)}submitCallback(e){this.formElement.isValid&&this.userRegistered.emit(e)}render(){return i("div",{class:"zea-form-profile"},i("zea-form",{ref:e=>this.formElement=e,id:"quick-access-form",submitCallback:this.submitCallback.bind(this),"submit-text":this.submitButtonText,validate:!0},this.welcomeHtml&&i("div",{innerHTML:this.welcomeHtml}),i("zea-input-text",{id:"quick-access-name",label:"First Name (required)",name:"firstName",showLabel:!0,required:!0,value:this.userData.firstName||""}),i("zea-input-text",{id:"quick-access-lastname",label:"Last Name",showLabel:this.showLabels,name:"lastName",value:this.userData.lastName||""}),i("zea-input-text",{id:"quick-access-email",label:"Email",showLabel:this.showLabels,name:"email",value:this.userData.email||""}),i("zea-input-text",{id:"quick-access-phone",label:"Phone",showLabel:this.showLabels,name:"phone",value:this.userData.phone||""}),i("zea-input-text",{id:"quick-access-company",label:"Company",showLabel:this.showLabels,name:"company",value:this.userData.company||""}),i("zea-input",{id:"quick-access-photo",type:"photo",label:"Photo",showLabel:this.showLabels,name:"avatar",value:this.userData.avatar||""}),i("zea-input",{id:"quick-access-color",type:"color",label:"Color",showLabel:this.showLabels,name:"color",value:this.userData.color||""})))}};o.style=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-form-profile{color:var(--color-foreground-1)}zea-form{width:280px;display:block;padding:20px;-webkit-box-sizing:border-box;box-sizing:border-box}zea-input{margin:2em 0 1em;display:block}zea-input-text{margin:1em 0 0}";const r=class{constructor(i){e(this,i),this.isCurrentUser=!1,this.collapsible=!0,this.density="normal"}componentWillLoad(){this.additionalDataShown=!this.collapsible}onProfileLinkClick(){this.profileDialog.shown=!0}render(){const e=this.userData.firstName||this.userData.given_name,t=this.userData.lastName||this.userData.family_name,s=this.userData.company,a=this.userData.phone,o=this.userData.email;return i("div",{class:"zea-user-card "+this.density},i("div",{class:"user-chip-container"},i("zea-user-chip",{showProfileCard:!1,showTooltip:!1,userData:this.userData,density:"normal"==this.density?"large":this.density})),i("div",{class:"user-info"},i("div",{class:"user-name"},e," ",t),i("div",{class:"user-company"},s),this.isCurrentUser&&i("div",{onClick:this.onProfileLinkClick.bind(this),class:"profile-link"},"My Profile")),!this.isCurrentUser&&i("div",{class:"user-focuser-container"},i("div",{class:"user-focuser"},i("zea-icon",{type:"zea",name:"find-user",size:28}))),!this.isCurrentUser&&this.collapsible&&(a||o)&&i("div",{class:"additional-data-collapser",onClick:()=>this.additionalDataShown=!this.additionalDataShown},i("span",{class:"collapser-label"},this.additionalDataShown?"Less":"More"),i("span",{class:"collapser-icon"},i("zea-icon",{name:this.additionalDataShown?"chevron-up-outline":"chevron-down-outline",size:14}))),!this.isCurrentUser&&(a||o)&&i("div",{class:{"additional-data":!0,shown:this.additionalDataShown}},a&&i("div",{class:"user-phone"},i("zea-icon",{name:"phone-portrait-outline"}),i("span",null,a)),o&&i("div",{class:"user-email"},i("zea-icon",{name:"mail-outline"}),i("span",null,o))),this.isCurrentUser&&i("zea-dialog-profile",{ref:e=>this.profileDialog=e,userData:this.userData}))}};r.style=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-user-card{color:var(--color-foreground-1);font-size:13px}.zea-user-card{min-width:290px;background-color:var(--color-background-2);display:grid;grid-template-columns:-webkit-min-content auto -webkit-min-content;grid-template-columns:min-content auto min-content;-ms-flex-align:start;align-items:flex-start;position:relative;z-index:10000000}.zea-user-card.small{min-width:280px}.user-chip-container,.user-focuser-container{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.user-focuser-container zea-icon{}.user-focuser{padding:8px}.zea-user-card .user-info{padding-left:0}.user-name{padding-top:5px;padding-bottom:4px}.user-company{color:var(--color-foreground-3)}.zea-user-card>*{padding:10px}.additional-data{grid-column-start:1;grid-column-end:4;grid-gap:1em;padding:1em;border-top:1px solid var(--color-grey-3);display:none}.additional-data.shown{display:grid}.user-phone,.user-email{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.user-phone zea-icon,.user-email zea-icon{-ms-flex-positive:0;flex-grow:0;width:32px}.profile-link{font-size:13px;color:var(--color-secondary-1);margin-top:3px;cursor:pointer}.additional-data-collapser{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;grid-column-start:span 3;padding-left:15px;padding-top:5px}.collapser-label{-ms-flex-positive:1;flex-grow:1}.small{font-size:12px}.small .additional-data{display:none !important}.small .user-company{display:none}.small .user-chip-container{padding:5px}.small .user-focuser-container{padding:0}:host-context(.overflow-entry.shown){-webkit-box-sizing:border-box;box-sizing:border-box;border:1px solid var(--color-grey-3);margin-right:10px}";const n=class{constructor(i){e(this,i),this.isCurrentUser=!1,this.isActive=!1,this.showImages=!0,this.density="normal",this.showTooltip=!0,this.showProfileCard=!0,this.profileCardShown=!1,this.profileCardAlign="left",this.randomColor="#000000".replace(/0/g,()=>(~~(5+7*Math.random())).toString(16)),this.zeaUserClicked=t(this,"zeaUserClicked",7)}handleClick(e){e.composedPath().includes(this.chipElement)?e.composedPath().includes(this.profileCardElement)||(this.profileCardShown=!this.profileCardShown):this.profileCardShown=!1}onChipClick(){this.zeaUserClicked.emit(this.userData)}onAvatarOver(){this.fixTooltipPosition()}componentDidRender(){this.fixTooltipPosition()}fixTooltipPosition(){if(!this.tooltipElement)return;const e=this.tooltipElement.getBoundingClientRect();e.x+e.width>window.innerWidth?this.tooltipElement.classList.add("bleeded-right"):this.tooltipElement.classList.remove("bleeded-right"),e.x<0?this.tooltipElement.classList.add("bleeded-left"):this.tooltipElement.classList.remove("bleeded-left")}render(){if(!this.userData)return i("span",{class:"empty-user-chip"});const e=this.userData.firstName||this.userData.given_name,t=this.userData.lastName||this.userData.family_name,s=this.userData.avatar||this.userData.picture;let a="",o=this.userData.color;{let i="",s="";e&&(i=e.charAt(0)),t?s=t.charAt(0):i&&(s=e.charAt(1)),a=String(i+s).toUpperCase()}o||(o=this.randomColor,this.userData.color=this.randomColor);const r={active:this.isActive,"zea-chip":!0};return r[this.density]=!0,i("div",{ref:e=>this.chipElement=e,class:r,onClick:this.onChipClick.bind(this)},i("div",{class:"zea-chip-avatar",onMouseOver:this.onAvatarOver.bind(this),style:{backgroundColor:o}},i("span",null,a),this.showImages&&!!s&&i("div",{class:"avatar-image",style:{backgroundImage:`url(${s})`}})),this.showTooltip&&!this.profileCardShown&&i("div",{ref:e=>this.tooltipElement=e,class:"tooltip"},`${e} ${t||""}`),this.showProfileCard&&i("zea-user-card",{collapsible:!0,isCurrentUser:this.isCurrentUser,ref:e=>this.profileCardElement=e,class:"align-"+this.profileCardAlign,style:{display:this.profileCardShown?"block":"none"},userData:this.userData}))}};n.style=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-chip{color:var(--color-foreground-1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.zea-chip-avatar{border:2px solid var(--color-background-2);width:32px;height:32px;border-radius:18px;color:white;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;position:relative;font-size:13px}.active .zea-chip-avatar{-webkit-box-shadow:0px 0px 1px 2px var(--color-primary-1);box-shadow:0px 0px 1px 2px var(--color-primary-1)}.avatar-image{position:absolute;top:0;left:0;bottom:0;right:0;border-radius:18px;background-size:cover;background-position:center center}.empty-user-chip{display:none}.small .zea-chip-avatar{width:28px;height:28px;border-radius:36px;font-size:13px}.small .avatar-image{border-radius:36px}.large .zea-chip-avatar{width:60px;height:60px;border-radius:36px;font-size:18px}.large .avatar-image{border-radius:36px}zea-user-card{position:absolute;margin-top:3px}zea-user-card.align-right{margin-left:-256px}.tooltip{position:absolute;padding:4px 7px;border-radius:4px;font-size:12px;color:var(--color-foreground-1);background-color:var(--color-grey-3);z-index:100000000;white-space:nowrap;margin-left:18px;-webkit-transform:translateX(-50%);transform:translateX(-50%);display:none}.zea-chip:hover .tooltip{display:block}.tooltip.bleeded-right{right:0;-webkit-transform:none;transform:none}.tooltip.bleeded-left{left:0;margin-left:0;-webkit-transform:none;transform:none}";export{s as zea_dialog_profile,a as zea_form,o as zea_form_profile,r as zea_user_card,n as zea_user_chip}