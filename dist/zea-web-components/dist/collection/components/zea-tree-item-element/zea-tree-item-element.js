import { Component, h, Prop, State, Watch, Element } from '@stencil/core';
import { Color } from '@zeainc/zea-engine';
import { ParameterValueChange } from '@zeainc/zea-ux';
/**
 * Main class for the component
 */
export class ZeaTreeItemElement {
    constructor() {
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
        }
    }
    /**
     * Placeholder comment
     */
    componentDidLoad() {
        this.updateSelected();
        this.updateVisibility();
        this.updateHighlight();
        if (this.childItems.length)
            this.rootElement.classList.add('has-children');
        else
            this.rootElement.classList.remove('has-children');
        this.treeItem.titleElement = this.rootElement;
    }
    /**
     * Placeholder comment
     */
    initTreeItem() {
        // Name
        this.label = this.treeItem.getName();
        this.nameChangedId = this.treeItem.nameChanged.connect(() => {
            this.label = this.treeItem.getName();
        });
        // Selection
        this.updateSelectedId = this.treeItem.selectedChanged.connect(this.updateSelected.bind(this));
        if (typeof this.treeItem.getChildren === 'function') {
            this.isTreeItem = true;
            this.childItems = this.treeItem.getChildren();
            // Visibility
            this.updateVisibilityId = this.treeItem.visibilityChanged.connect(this.updateVisibility.bind(this));
        }
        else {
            this.isTreeItem = false;
            this.isVisible = true;
        }
        // Highlights
        if ('highlightChanged' in this.treeItem) {
            this.updateHighlightId = this.treeItem.highlightChanged.connect(this.updateHighlight.bind(this));
        }
    }
    /**
     * Placeholder comment
     */
    updateSelected() {
        if ('getSelected' in this.treeItem)
            this.isSelected = this.treeItem.getSelected();
    }
    /**
     * Placeholder comment
     */
    updateVisibility() {
        if ('getVisible' in this.treeItem) {
            this.isVisible = this.treeItem.getVisible();
        }
    }
    /**
     * Placeholder comment
     */
    updateHighlight() {
        if ('isHighlighted' in this.treeItem) {
            this.isHighlighted = this.treeItem.isHighlighted();
            if (this.isHighlighted && 'getHighlight' in this.treeItem) {
                const highlightColor = this.treeItem.getHighlight();
                const bgColor = highlightColor.lerp(new Color(0.75, 0.75, 0.75, 0), 0.5);
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
            const change = new ParameterValueChange(visibleParam, !visibleParam.getValue());
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
        return (h("div", { class: {
                wrap: true,
                'has-children': this.childItems.length,
                selected: this.isSelected,
                visible: this.isVisible,
                highlighted: this.isHighlighted,
                'is-tree-item': this.isTreeItem,
            }, style: { display: 'block' }, ref: (el) => (this.itemContainer = el) },
            h("div", { class: "header" },
                h("div", { class: "arrow", style: { display: this.childItems.length > 0 ? 'block' : 'none' }, onClick: () => this.toggleChildren() },
                    h("span", null, this.isExpanded ? (h("zea-icon", { name: "caret-down", size: 12 })) : (h("zea-icon", { name: "caret-forward", size: 12 })))),
                this.isTreeItem && (h("div", { class: "toggle", onClick: this.onVisibilityToggleClick.bind(this) },
                    h("zea-icon", { name: this.isVisible ? 'eye-outline' : 'eye-off-outline', ref: (el) => (this.visibilityIcon = el), size: 16 }))),
                h("div", { class: "zea-tree-item-label", onClick: this.onLabelClick.bind(this) }, this.label)),
            this.isTreeItem && (h("div", { class: "children", style: { display: this.isExpanded ? 'block' : 'none' } }, this.isExpanded &&
                this.childItems.map((child) => (h("zea-tree-item-element", { treeItem: child, appData: this.appData })))))));
    }
    static get is() { return "zea-tree-item-element"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-tree-item-element.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-tree-item-element.css"]
    }; }
    static get properties() { return {
        "itemContainer": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "item-container",
            "reflect": false
        },
        "label": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "label",
            "reflect": false,
            "defaultValue": "'Loading...'"
        },
        "isRoot": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "is-root",
            "reflect": false,
            "defaultValue": "false"
        },
        "isTreeItem": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "is-tree-item",
            "reflect": false,
            "defaultValue": "false"
        },
        "isSelected": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "is-selected",
            "reflect": false,
            "defaultValue": "false"
        },
        "isVisible": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "is-visible",
            "reflect": false,
            "defaultValue": "false"
        },
        "isHighlighted": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "is-highlighted",
            "reflect": false,
            "defaultValue": "false"
        },
        "treeItem": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "tree-item",
            "reflect": false
        },
        "appData": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "app-data",
            "reflect": false
        },
        "isExpanded": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "is-expanded",
            "reflect": false,
            "defaultValue": "false"
        }
    }; }
    static get states() { return {
        "childItems": {}
    }; }
    static get elementRef() { return "rootElement"; }
    static get watchers() { return [{
            "propName": "treeItem",
            "methodName": "treeItemChanged"
        }]; }
}
