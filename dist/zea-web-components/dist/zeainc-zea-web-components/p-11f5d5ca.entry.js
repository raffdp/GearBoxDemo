import{r as e,h as t,d as i}from"./p-da09bae5.js";import"./p-f249487f.js";import"./p-b57dc4fe.js";import"./p-df6cbb31.js";import{y as s,N as h}from"./p-d3472632.js";const l=class{constructor(t){e(this,t),this.label="Loading...",this.isRoot=!1,this.isTreeItem=!1,this.isSelected=!1,this.isVisible=!1,this.isHighlighted=!1,this.isExpanded=!1,this.childItems=[]}treeItemChanged(){this.treeItem&&this.initTreeItem()}componentWillLoad(){this.treeItem&&this.initTreeItem()}componentDidLoad(){this.treeItem&&(this.updateSelected(),this.updateVisibility(),this.updateHighlight(),this.childItems.length?this.rootElement.classList.add("has-children"):this.rootElement.classList.remove("has-children"),this.treeItem.titleElement=this.rootElement)}initTreeItem(){this.label=this.treeItem.getName(),console.log("initTreeItem:",this.label),this.nameChangedId=this.treeItem.on("nameChanged",()=>{this.label=this.treeItem.getName()}),this.updateSelectedId=this.treeItem.on("selectedChanged",this.updateSelected.bind(this)),"function"==typeof this.treeItem.getChildren?(this.isTreeItem=!0,this.childItems=this.treeItem.getChildren(),this.childAddedId=this.treeItem.on("childAdded",()=>{console.log("childAdded"),this.childItems=this.treeItem.getChildren()}),this.childRemovedId=this.treeItem.on("childRemoved",()=>{console.log("childRemoved"),this.childItems=this.treeItem.getChildren()}),this.updateVisibilityId=this.treeItem.on("visibilityChanged",this.updateVisibility.bind(this))):(this.isTreeItem=!1,this.isVisible=!0),this.updateHighlightId=this.treeItem.on("highlightChanged",this.updateHighlight.bind(this))}updateSelected(){this.treeItem&&"getSelected"in this.treeItem&&(this.isSelected=this.treeItem.getSelected())}updateVisibility(){this.treeItem&&"getVisible"in this.treeItem&&(this.isVisible=this.treeItem.getVisible())}updateHighlight(){if(this.treeItem&&"isHighlighted"in this.treeItem&&(this.isHighlighted=this.treeItem.isHighlighted(),this.isHighlighted&&"getHighlight"in this.treeItem)){const e=this.treeItem.getHighlight(),t=e.lerp(new s(.75,.75,.75,0),.5);this.itemContainer.style.setProperty("--treeview-highlight-bg-color",t.toHex()+"60"),this.itemContainer.style.setProperty("--treeview-highlight-color",e.toHex())}}toggleChildren(){this.isExpanded=!this.isExpanded}onVisibilityToggleClick(){const e=this.treeItem.getParameter("Visible");if(this.appData&&this.appData.undoRedoManager){const t=new h(e,!e.getValue());this.appData.undoRedoManager.addChange(t)}else e.setValue(!e.getValue())}onLabelClick(e){this.appData&&this.appData.selectionManager?this.appData.selectionManager.pickingModeActive()?this.appData.selectionManager.pick(this.treeItem):this.appData.selectionManager.toggleItemSelection(this.treeItem,!e.ctrlKey):this.treeItem.setSelected(!this.treeItem.getSelected())}render(){return console.log("render"),t("div",{class:{wrap:!0,"has-children":this.childItems.length,selected:this.isSelected,visible:this.isVisible,highlighted:this.isHighlighted,"is-tree-item":this.isTreeItem},style:{display:"block"},ref:e=>this.itemContainer=e},t("div",{class:"header"},t("div",{class:"arrow",style:{display:this.childItems.length>0?"block":"none"},onClick:()=>this.toggleChildren()},t("span",null,t("zea-icon",this.isExpanded?{name:"caret-down",size:12}:{name:"caret-forward",size:12}))),this.isTreeItem&&t("div",{class:"toggle",onClick:this.onVisibilityToggleClick.bind(this)},t("zea-icon",{name:this.isVisible?"eye-outline":"eye-off-outline",ref:e=>this.visibilityIcon=e,size:16})),t("div",{class:"zea-tree-item-label",onClick:this.onLabelClick.bind(this)},this.label)),this.isTreeItem&&t("div",{class:"children",style:{display:this.isExpanded?"block":"none"}},this.isExpanded&&this.childItems.map(e=>t("zea-tree-item-element",{treeItem:e,appData:this.appData}))))}get rootElement(){return i(this)}static get watchers(){return{treeItem:["treeItemChanged"]}}};l.style=":host{display:block;font-size:14px}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.wrap{opacity:0.7;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.wrap.visible{opacity:1}.header{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;margin:4px 0;position:relative;left:-7px}.arrow{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;cursor:pointer;padding:2px}.label{white-space:nowrap}.toggle{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;font-size:1.2em;margin:0 1px 0 4px}.children{padding-left:19px;border-left:1px dotted gray}zea-tree-item-element{margin-left:16px}zea-tree-item-element.has-children{margin-left:0}.zea-tree-item-label{padding:3px 5px;border-radius:4px;border:1px solid transparent;margin-left:22px}.is-tree-item .zea-tree-item-label{margin-left:0}.highlighted .zea-tree-item-label{background-color:var(\r\n    --treeview-highlight-bg-color,\r\n    var(--color-secondary-3)\r\n  );border:1px solid var(--treeview-highlight-color, var(--color-secondary-1))}.selected .zea-tree-item-label{background-color:var(--treeview-highlight-color, var(--color-secondary-1));border:1px solid var(--treeview-highlight-color, var(--color-secondary-1))}";export{l as zea_tree_item_element}