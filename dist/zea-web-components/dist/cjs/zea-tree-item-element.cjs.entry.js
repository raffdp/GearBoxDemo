'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');
require('./global-ad93eec5.js');
require('./index-7e350ca9.js');
require('./buffer-es6-40c1bb4d.js');
const index_esm = require('./index.esm-88e72f8d.js');

const zeaTreeItemElementCss = ":host{display:block;font-size:14px}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.wrap{opacity:0.7;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.wrap.visible{opacity:1}.header{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;margin:4px 0;position:relative;left:-7px}.arrow{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;cursor:pointer;padding:2px}.label{white-space:nowrap}.toggle{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;font-size:1.2em;margin:0 1px 0 4px}.children{padding-left:19px;border-left:1px dotted gray}zea-tree-item-element{margin-left:16px}zea-tree-item-element.has-children{margin-left:0}.zea-tree-item-label{padding:3px 5px;border-radius:4px;border:1px solid transparent;margin-left:22px;white-space:nowrap}.is-tree-item .zea-tree-item-label{margin-left:0}.highlighted .zea-tree-item-label{background-color:var(\r\n    --treeview-highlight-bg-color,\r\n    var(--color-secondary-3)\r\n  );border:1px solid var(--treeview-highlight-color, var(--color-secondary-1))}.selected .zea-tree-item-label{background-color:var(--treeview-highlight-color, var(--color-secondary-1));border:1px solid var(--treeview-highlight-color, var(--color-secondary-1))}";

const ZeaTreeItemElement = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.label = 'Loading...';
        this.isRoot = false;
        this.isTreeItem = false;
        this.isSelected = false;
        this.isVisible = false;
        this.isHighlighted = false;
        this.isExpanded = false;
        this.childItems = [];
    }
    /**
     * Placeholder comment
     */
    treeItemChanged() {
        if (this.treeItem) {
            this.initTreeItem();
        }
    }
    /**
     * Placeholder comment
     */
    componentWillLoad() {
        if (this.treeItem) {
            this.initTreeItem();
            this.updateSelected();
            this.updateVisibility();
            this.updateHighlight();
            if (this.childItems.length)
                this.rootElement.classList.add('has-children');
            else
                this.rootElement.classList.remove('has-children');
            this.treeItem.titleElement = this.rootElement;
        }
    }
    /**
     * Placeholder comment
     */
    initTreeItem() {
        // Name
        this.label = this.treeItem.getName();
        this.nameChangedId = this.treeItem.on('nameChanged', () => {
            this.label = this.treeItem.getName();
        });
        // Selection
        this.updateSelectedId = this.treeItem.on('selectedChanged', this.updateSelected.bind(this));
        if (typeof this.treeItem.getChildren === 'function') {
            this.isTreeItem = true;
            this.childItems = [...this.treeItem.getChildren()];
            this.childAddedId = this.treeItem.on('childAdded', () => {
                this.childItems = [...this.treeItem.getChildren()];
            });
            this.childRemovedId = this.treeItem.on('childRemoved', () => {
                this.childItems = [...this.treeItem.getChildren()];
            });
            // Visibility
            this.updateVisibilityId = this.treeItem.on('visibilityChanged', this.updateVisibility.bind(this));
        }
        else {
            this.isTreeItem = false;
            this.isVisible = true;
        }
        // Highlights
        this.updateHighlightId = this.treeItem.on('highlightChanged', this.updateHighlight.bind(this));
    }
    /**
     * Placeholder comment
     */
    updateSelected() {
        if (this.treeItem && 'getSelected' in this.treeItem)
            this.isSelected = this.treeItem.getSelected();
    }
    /**
     * Placeholder comment
     */
    updateVisibility() {
        if (this.treeItem && 'getVisible' in this.treeItem) {
            this.isVisible = this.treeItem.getVisible();
        }
    }
    /**
     * Placeholder comment
     */
    updateHighlight() {
        if (this.treeItem && 'isHighlighted' in this.treeItem) {
            this.isHighlighted = this.treeItem.isHighlighted();
            if (this.isHighlighted && 'getHighlight' in this.treeItem) {
                const highlightColor = this.treeItem.getHighlight();
                const bgColor = highlightColor.lerp(new index_esm.y(0.75, 0.75, 0.75, 0), 0.5);
                this.itemContainer.style.setProperty('--treeview-highlight-bg-color', `${bgColor.toHex()}60` // add transparency
                );
                this.itemContainer.style.setProperty('--treeview-highlight-color', highlightColor.toHex());
            }
        }
    }
    /**
     * Placeholder comment
     */
    toggleChildren() {
        this.isExpanded = !this.isExpanded;
    }
    /**
     * Placeholder comment
     */
    onVisibilityToggleClick() {
        const visibleParam = this.treeItem.getParameter('Visible');
        if (this.appData && this.appData.undoRedoManager) {
            const change = new index_esm.N(visibleParam, !visibleParam.getValue());
            this.appData.undoRedoManager.addChange(change);
        }
        else {
            visibleParam.setValue(!visibleParam.getValue());
        }
    }
    /**
     * Placeholder comment
     * @param {any} e The event object
     */
    onLabelClick(e) {
        if (!this.appData || !this.appData.selectionManager) {
            this.treeItem.setSelected(!this.treeItem.getSelected());
            return;
        }
        if (this.appData.selectionManager.pickingModeActive()) {
            this.appData.selectionManager.pick(this.treeItem);
            return;
        }
        this.appData.selectionManager.toggleItemSelection(this.treeItem, !e.ctrlKey);
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        return (index.h("div", { class: {
                wrap: true,
                'has-children': this.childItems.length,
                selected: this.isSelected,
                visible: this.isVisible,
                highlighted: this.isHighlighted,
                'is-tree-item': this.isTreeItem,
            }, style: { display: 'block' }, ref: (el) => (this.itemContainer = el) }, index.h("div", { class: "header" }, index.h("div", { class: "arrow", style: { display: this.childItems.length > 0 ? 'block' : 'none' }, onClick: () => this.toggleChildren() }, index.h("span", null, this.isExpanded ? (index.h("zea-icon", { name: "caret-down", size: 12 })) : (index.h("zea-icon", { name: "caret-forward", size: 12 })))), this.isTreeItem && (index.h("div", { class: "toggle", onClick: this.onVisibilityToggleClick.bind(this) }, index.h("zea-icon", { name: this.isVisible ? 'eye-outline' : 'eye-off-outline', ref: (el) => (this.visibilityIcon = el), size: 16 }))), index.h("div", { class: "zea-tree-item-label", onClick: this.onLabelClick.bind(this) }, this.label)), this.isTreeItem && (index.h("div", { class: "children", style: { display: this.isExpanded ? 'block' : 'none' } }, this.isExpanded &&
            this.childItems.map((child) => (index.h("zea-tree-item-element", { treeItem: child, appData: this.appData })))))));
    }
    get rootElement() { return index.getElement(this); }
    static get watchers() { return {
        "treeItem": ["treeItemChanged"]
    }; }
};
ZeaTreeItemElement.style = zeaTreeItemElementCss;

exports.zea_tree_item_element = ZeaTreeItemElement;
