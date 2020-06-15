import{r as e,h as i}from"./p-da09bae5.js";import"./p-f249487f.js";import"./p-b57dc4fe.js";import"./p-20827418.js";import{Z as s}from"./p-035e87bc.js";const t=class{constructor(i){e(this,i),this.disciplines=[],this.scales=[],this.db=new s}onDisciplinesSelect(e){console.log("value",e)}onScalesSelect(e){console.log("value",e)}componentWillLoad(){this.db.getDocs({type:"disciplines",limit:100}).then(e=>{this.disciplines=e.docs}),this.scales=[{_id:"scale1",name:"1/32' = 1'0\""},{_id:"scale2",name:"1/16' = 1'0\""},{_id:"scale3",name:"1/8' = 1'0\""},{_id:"scale4",name:"1/4' = 1'0\""},{_id:"scale5",name:"3/8' = 1'0\""},{_id:"scale6",name:"1/32 = 1'0\""},{_id:"scale7",name:"1/32 = 1'0\""},{_id:"scale8",name:"1/32 = 1'0\""},{_id:"scale9",name:"1/32 = 1'0\""},{_id:"scale10",name:"1/32 = 1'0\""}]}render(){return i("div",{class:"zea-form-drawing-setup"},i("div",{class:"inputs"},i("div",{class:"input-container"},i("zea-input-text",{ref:e=>this.drawingNumberInput=e,label:"Drawing Number",id:"drawing-number-input"})),i("div",{class:"input-container"},i("zea-input-text",{ref:e=>this.titleInput=e,label:"Title",id:"title-input"})),i("div",{class:"input-container"},i("zea-input-select",{selectCallback:this.onDisciplinesSelect.bind(this),label:"Discipline",id:"discipline-input"},this.disciplines.map(e=>i("zea-input-select-item",{value:e},i("div",{class:"discipline-row",id:e._id,key:e._id},i("div",{class:"discipline-abbreviation",style:{backgroundColor:e.color}},e.abbreviation),i("div",{class:"discipline-name"},e.name)))))),i("div",{class:"input-container"},i("zea-input-select",{selectCallback:this.onScalesSelect.bind(this),label:"Scale",id:"scale-input"},this.scales.map(e=>i("zea-input-select-item",{value:e},i("div",{class:"select-item-wrap scale-row",id:e._id,key:e._id},i("div",{class:"scale-name"},e.name))))))),i("div",{class:"buttons"},i("div",null,i("zea-button",{density:"small"},"FINISHED ALL")),i("div",null,i("zea-button",{density:"small"},"PREVIOUS"),i("zea-button",{density:"small"},"NEXT"))))}};t.style=".zea-form-drawing-setup{color:var(--color-foreground-1);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;height:100%;width:100%;overflow:hidden}.discipline-row{display:-ms-flexbox;display:flex;width:100%;-ms-flex-align:center;align-items:center}.discipline-row:hover{background-color:var(--color-grey-2)}.discipline-name{-ms-flex-positive:1;flex-grow:1}.discipline-abbreviation{text-transform:uppercase;padding:8px;width:15px;height:15px;line-height:15px;text-align:center;border-radius:20px;margin:5px 10px 5px 5px;white-space:nowrap;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}.input-container{margin-bottom:1em}zea-input-select-item:hover{background-color:var(--color-grey-2)}.scale-row{padding:5px}.inputs{-ms-flex-positive:1;flex-grow:1;padding:1em}.buttons{display:-ms-flexbox;display:flex;padding:1em}.buttons zea-button{margin:5px}.buttons div:nth-child(1){-ms-flex-positive:1;flex-grow:1}";export{t as zea_form_drawing_setup}