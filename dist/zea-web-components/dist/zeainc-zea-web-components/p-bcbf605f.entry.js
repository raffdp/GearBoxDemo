import{r as e,h as i}from"./p-da09bae5.js";const t=class{constructor(i){e(this,i),this.name="zea-input",this.label="Enter text...",this.invalidMessage="Not valid",this.required=!1,this.isValid=!0,this.autoValidate=!1,this.invalidMessageShown=!1,this.showLabel=!0,this.optionsShown=!1}handleClick(e){e.composedPath().includes(this.inputWrapElement)||(this.optionsShown=!1)}checkValue(){this.inputElement&&(this.value=this.inputElement.value,this.value.replace(/(^\s+|\s+$)/,""),this.required&&(this.value?(this.isValid=!0,this.invalidMessageShown=!1):(this.invalidMessage="Field is required",this.isValid=!1,this.autoValidate&&(this.invalidMessageShown=!0))))}onContainerClick(){this.optionsShown=!this.optionsShown}onBlur(){this.inputWrapElement.classList.remove("focused")}onFocus(){this.inputWrapElement.classList.add("focused")}componentDidLoad(){this.optionsContainer.addEventListener("click",e=>{e.composedPath().forEach(e=>{if("ZEA-INPUT-SELECT-ITEM"==e.tagName){this.value=e.value,this.optionsShown=!1;const i=this.selectionContainer.querySelector(".selection");i.innerHTML="",i.appendChild(e.cloneNode(!0)),this.selectCallback&&this.selectCallback(this.value)}})})}render(){return i("div",{class:`input-wrap ${this.value?"not-empty":"empty"} ${this.optionsShown?"focused":""}`,ref:e=>this.inputWrapElement=e},this.showLabel&&i("label",{class:"input-label"},this.label),i("div",{ref:e=>this.selectionContainer=e,class:"selection-container",onClick:this.onContainerClick.bind(this)},i("div",{class:"selection"}),i("zea-icon",{name:this.optionsShown?"chevron-up-outline":"chevron-down-outline",size:13})),i("div",{ref:e=>this.optionsContainer=e,class:{"options-container":!0,shown:this.optionsShown}},i("zea-scroll-pane",null,i("slot",null))),i("div",{class:"underliner"},i("div",{class:"expander"})),!this.isValid&&this.invalidMessageShown&&i("div",{class:"invalid-message"},this.invalidMessage))}};t.style=":host{display:inline-block;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;font-size:13px}.zea-input{color:var(--color-foreground-1)}.input-label{color:var(--color-grey-3);position:relative;-webkit-transition:all 0.2s linear;transition:all 0.2s linear;pointer-events:none}.empty .input-label{top:18px;font-size:13px}.not-empty .input-label,.focused .input-label{top:0;font-size:11px}.focused .input-label{color:var(--color-secondary-1)}.input-wrap{display:block;position:relative}.invalid-message{color:var(--color-warning-2);padding:0.3em 0;font-size:12px}.underliner{text-align:center;height:1px;background-color:var(--color-grey-3);overflow:hidden;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}.underliner .expander{height:1px;background-color:var(--color-secondary-1);overflow:hidden;display:inline-block;width:0;-webkit-transition:width 0.2s linear;transition:width 0.2s linear}.focused .underliner .expander{width:100%}.selection-container{min-height:22px;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.selection{-ms-flex-positive:1;flex-grow:1;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.options-container{display:none;position:absolute;width:100%;height:210px;max-height:initial;overflow:hidden;padding:2px;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-box-shadow:2px 2px 13px 0px var(--color-background-4);box-shadow:2px 2px 13px 0px var(--color-background-4);background-color:var(--color-background-1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1000;margin-top:1px}.options-container.shown{display:block}.discipline-row{display:-ms-flexbox;display:flex;width:100%;-ms-flex-align:center;align-items:center}.discipline-name{-ms-flex-positive:1;flex-grow:1}.discipline-abbreviation{text-transform:uppercase;padding:8px;width:15px;height:15px;line-height:15px;text-align:center;border-radius:20px;margin:5px 10px 5px 5px;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;white-space:nowrap}";const s=class{constructor(i){e(this,i)}render(){return i("div",{class:"zea-input-select-item"},i("slot",null))}};s.style=":host{display:block}.zea-input-select-item{color:var(--color-freground-1)}::slotted(.select-item-wrap){padding:5px}";export{t as zea_input_select,s as zea_input_select_item}