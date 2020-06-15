System.register(["./p-6ab71ff6.system.js"],(function(e){"use strict";var t,i,a;return{setters:[function(e){t=e.r;i=e.h;a=e.c}],execute:function(){var s=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-dialog-profile{color:var(--color-foreground-1)}.scrollpane-container{width:100%;height:100%;padding:10px;-webkit-box-sizing:border-box;box-sizing:border-box}";var o=e("zea_dialog_profile",function(){function e(e){t(this,e);this.allowClose=true;this.shown=false;this.showLabels=true}e.prototype.todoCompletedHandler=function(){this.shown=false};e.prototype.userRegisteredHandler=function(){console.log("userRegistered");this.shown=false};e.prototype.render=function(){return i("div",{class:"zea-dialog-profile"},i("zea-dialog",{width:"320px",allowClose:this.allowClose,showBackdrop:true,shown:this.shown,addPadding:false},i("div",{slot:"body"},i("div",{class:"scrollpane-container"},i("zea-scroll-pane",null,i("zea-form-profile",{userData:this.userData,showLabels:this.showLabels,welcomeHtml:"My Profile"}))))))};return e}());o.style=s;var r=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-form{color:var(--color-foreground-1)}zea-button.submit{margin-top:2em;width:100%}";var n=e("zea_form",function(){function e(e){t(this,e);this.submitText="SUBMIT";this.validate=true;this.isValid=true;this.formValue={};this.inputs=[]}e.prototype.getFormValue=function(){var e=this;this.checkValidation();this.inputs.forEach((function(t){e.formValue[t.name]=t.value}));return this.formValue};e.prototype.checkValidation=function(){if(!this.validate){return true}for(var e=0;e<this.inputs.length;e++){var t=this.inputs[e];if(t.isValid){t.invalidMessageShown=false;this.isValid=true}else{t.invalidMessageShown=true;this.isValid=false;return false}}return true};e.prototype.onSubmit=function(){if(this.submitCallback){this.submitCallback(this.getFormValue())}};e.prototype.componentDidRender=function(){this.setupChildren()};e.prototype.setupChildren=function(){var e=this;this.formContainer.querySelector("slot").assignedElements().forEach((function(t){if(t.tagName.match(/^ZEA-INPUT/i)){e.inputs.push(t)}}))};e.prototype.render=function(){var e=this;return i("div",{class:"zea-form",ref:function(t){return e.formContainer=t}},i("slot",null),i("zea-button",{onClick:this.onSubmit.bind(this),class:"submit"},this.submitText))};return e}());n.style=r;var l=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-form-profile{color:var(--color-foreground-1)}zea-form{width:280px;display:block;padding:20px;-webkit-box-sizing:border-box;box-sizing:border-box}zea-input{margin:2em 0 1em;display:block}zea-input-text{margin:1em 0 0}";var u=e("zea_form_profile",function(){function e(e){t(this,e);this.welcomeHtml="Welcome to Zea Construction. We just need <br />a few details and\n  then you're ready to go.";this.submitButtonText="SAVE";this.showLabels=true;this.userData={};this.userRegistered=a(this,"userRegistered",7)}e.prototype.submitCallback=function(e){if(this.formElement.isValid){this.userRegistered.emit(e)}};e.prototype.render=function(){var e=this;return i("div",{class:"zea-form-profile"},i("zea-form",{ref:function(t){return e.formElement=t},id:"quick-access-form",submitCallback:this.submitCallback.bind(this),"submit-text":this.submitButtonText,validate:true},this.welcomeHtml&&i("div",{innerHTML:this.welcomeHtml}),i("zea-input-text",{id:"quick-access-name",label:"First Name (required)",name:"firstName",showLabel:true,required:true,value:this.userData.firstName||""}),i("zea-input-text",{id:"quick-access-lastname",label:"Last Name",showLabel:this.showLabels,name:"lastName",value:this.userData.lastName||""}),i("zea-input-text",{id:"quick-access-email",label:"Email",showLabel:this.showLabels,name:"email",value:this.userData.email||""}),i("zea-input-text",{id:"quick-access-phone",label:"Phone",showLabel:this.showLabels,name:"phone",value:this.userData.phone||""}),i("zea-input-text",{id:"quick-access-company",label:"Company",showLabel:this.showLabels,name:"company",value:this.userData.company||""}),i("zea-input",{id:"quick-access-photo",type:"photo",label:"Photo",showLabel:this.showLabels,name:"avatar",value:this.userData.avatar||""}),i("zea-input",{id:"quick-access-color",type:"color",label:"Color",showLabel:this.showLabels,name:"color",value:this.userData.color||""})))};return e}());u.style=l;var c=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-user-card{color:var(--color-foreground-1);font-size:13px}.zea-user-card{min-width:290px;background-color:var(--color-background-2);display:grid;grid-template-columns:-webkit-min-content auto -webkit-min-content;grid-template-columns:min-content auto min-content;-ms-flex-align:start;align-items:flex-start;position:relative;z-index:10000000}.zea-user-card.small{min-width:280px}.user-chip-container,.user-focuser-container{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.user-focuser-container zea-icon{}.user-focuser{padding:8px}.zea-user-card .user-info{padding-left:0}.user-name{padding-top:5px;padding-bottom:4px}.user-company{color:var(--color-foreground-3)}.zea-user-card>*{padding:10px}.additional-data{grid-column-start:1;grid-column-end:4;grid-gap:1em;padding:1em;border-top:1px solid var(--color-grey-3);display:none}.additional-data.shown{display:grid}.user-phone,.user-email{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.user-phone zea-icon,.user-email zea-icon{-ms-flex-positive:0;flex-grow:0;width:32px}.profile-link{font-size:13px;color:var(--color-secondary-1);margin-top:3px;cursor:pointer}.additional-data-collapser{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;grid-column-start:span 3;padding-left:15px;padding-top:5px}.collapser-label{-ms-flex-positive:1;flex-grow:1}.small{font-size:12px}.small .additional-data{display:none !important}.small .user-company{display:none}.small .user-chip-container{padding:5px}.small .user-focuser-container{padding:0}:host-context(.overflow-entry.shown){-webkit-box-sizing:border-box;box-sizing:border-box;border:1px solid var(--color-grey-3);margin-right:10px}";var d=e("zea_user_card",function(){function e(e){t(this,e);this.isCurrentUser=false;this.collapsible=true;this.density="normal"}e.prototype.componentWillLoad=function(){this.additionalDataShown=!this.collapsible};e.prototype.onProfileLinkClick=function(){this.profileDialog.shown=true};e.prototype.render=function(){var e=this;var t=this.userData.firstName||this.userData.given_name;var a=this.userData.lastName||this.userData.family_name;var s=this.userData.company;var o=this.userData.phone;var r=this.userData.email;return i("div",{class:"zea-user-card "+this.density},i("div",{class:"user-chip-container"},i("zea-user-chip",{showProfileCard:false,showTooltip:false,userData:this.userData,density:this.density=="normal"?"large":this.density})),i("div",{class:"user-info"},i("div",{class:"user-name"},t," ",a),i("div",{class:"user-company"},s),this.isCurrentUser&&i("div",{onClick:this.onProfileLinkClick.bind(this),class:"profile-link"},"My Profile")),!this.isCurrentUser&&i("div",{class:"user-focuser-container"},i("div",{class:"user-focuser"},i("zea-icon",{type:"zea",name:"find-user",size:28}))),!this.isCurrentUser&&this.collapsible&&(o||r)&&i("div",{class:"additional-data-collapser",onClick:function(){return e.additionalDataShown=!e.additionalDataShown}},i("span",{class:"collapser-label"},this.additionalDataShown?"Less":"More"),i("span",{class:"collapser-icon"},i("zea-icon",{name:this.additionalDataShown?"chevron-up-outline":"chevron-down-outline",size:14}))),!this.isCurrentUser&&(o||r)&&i("div",{class:{"additional-data":true,shown:this.additionalDataShown}},o&&i("div",{class:"user-phone"},i("zea-icon",{name:"phone-portrait-outline"}),i("span",null,o)),r&&i("div",{class:"user-email"},i("zea-icon",{name:"mail-outline"}),i("span",null,r))),this.isCurrentUser&&i("zea-dialog-profile",{ref:function(t){return e.profileDialog=t},userData:this.userData}))};return e}());d.style=c;var p=":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-chip{color:var(--color-foreground-1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.zea-chip-avatar{border:2px solid var(--color-background-2);width:32px;height:32px;border-radius:18px;color:white;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;position:relative;font-size:13px}.active .zea-chip-avatar{-webkit-box-shadow:0px 0px 1px 2px var(--color-primary-1);box-shadow:0px 0px 1px 2px var(--color-primary-1)}.avatar-image{position:absolute;top:0;left:0;bottom:0;right:0;border-radius:18px;background-size:cover;background-position:center center}.empty-user-chip{display:none}.small .zea-chip-avatar{width:28px;height:28px;border-radius:36px;font-size:13px}.small .avatar-image{border-radius:36px}.large .zea-chip-avatar{width:60px;height:60px;border-radius:36px;font-size:18px}.large .avatar-image{border-radius:36px}zea-user-card{position:absolute;margin-top:3px}zea-user-card.align-right{margin-left:-256px}.tooltip{position:absolute;padding:4px 7px;border-radius:4px;font-size:12px;color:var(--color-foreground-1);background-color:var(--color-grey-3);z-index:100000000;white-space:nowrap;margin-left:18px;-webkit-transform:translateX(-50%);transform:translateX(-50%);display:none}.zea-chip:hover .tooltip{display:block}.tooltip.bleeded-right{right:0;-webkit-transform:none;transform:none}.tooltip.bleeded-left{left:0;margin-left:0;-webkit-transform:none;transform:none}";var h=e("zea_user_chip",function(){function e(e){t(this,e);this.isCurrentUser=false;this.isActive=false;this.showImages=true;this.density="normal";this.showTooltip=true;this.showProfileCard=true;this.profileCardShown=false;this.profileCardAlign="left";this.randomColor="#000000".replace(/0/g,(function(){return(~~(5+Math.random()*7)).toString(16)}));this.zeaUserClicked=a(this,"zeaUserClicked",7)}e.prototype.handleClick=function(e){if(e.composedPath().includes(this.chipElement)){if(!e.composedPath().includes(this.profileCardElement)){this.profileCardShown=!this.profileCardShown}}else{this.profileCardShown=false}};e.prototype.onChipClick=function(){this.zeaUserClicked.emit(this.userData)};e.prototype.onAvatarOver=function(){this.fixTooltipPosition()};e.prototype.componentDidRender=function(){this.fixTooltipPosition()};e.prototype.fixTooltipPosition=function(){if(!this.tooltipElement)return;var e=this.tooltipElement.getBoundingClientRect();if(e.x+e.width>window.innerWidth){this.tooltipElement.classList.add("bleeded-right")}else{this.tooltipElement.classList.remove("bleeded-right")}if(e.x<0){this.tooltipElement.classList.add("bleeded-left")}else{this.tooltipElement.classList.remove("bleeded-left")}};e.prototype.render=function(){var e=this;if(!this.userData)return i("span",{class:"empty-user-chip"});var t=this.userData.firstName||this.userData.given_name;var a=this.userData.lastName||this.userData.family_name;var s=this.userData.avatar||this.userData.picture;var o="";var r=this.userData.color;{var n="";var l="";if(t){n=t.charAt(0)}if(a){l=a.charAt(0)}else if(n){l=t.charAt(1)}o=String(n+l).toUpperCase()}if(!r){r=this.randomColor;this.userData.color=this.randomColor}var u={active:this.isActive,"zea-chip":true};u[this.density]=true;return i("div",{ref:function(t){return e.chipElement=t},class:u,onClick:this.onChipClick.bind(this)},i("div",{class:"zea-chip-avatar",onMouseOver:this.onAvatarOver.bind(this),style:{backgroundColor:r}},i("span",null,o),this.showImages&&!!s&&i("div",{class:"avatar-image",style:{backgroundImage:"url("+s+")"}})),this.showTooltip&&!this.profileCardShown&&i("div",{ref:function(t){return e.tooltipElement=t},class:"tooltip"},t+" "+(a?a:"")),this.showProfileCard&&i("zea-user-card",{collapsible:true,isCurrentUser:this.isCurrentUser,ref:function(t){return e.profileCardElement=t},class:"align-"+this.profileCardAlign,style:{display:this.profileCardShown?"block":"none"},userData:this.userData}))};return e}());h.style=p}}}));