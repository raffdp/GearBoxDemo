import { r as registerInstance, h, H as Host } from './index-12ee0265.js';
var zeaTreeViewCss = ":host{display:block;height:100%}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.wrap{height:100%;padding:0.5em;overflow:auto;-webkit-box-sizing:border-box;box-sizing:border-box;color:var(--color-foreground-1)}";
var ZeaTreeView = /** @class */ (function () {
    function ZeaTreeView(hostRef) {
        registerInstance(this, hostRef);
    }
    /**
     * onKeyDown
     * @param {any} event the event data
     */
    ZeaTreeView.prototype.onKeyDown = function (event) {
        if (!this.mouseIsOver)
            return;
        var selectionManager = this.appData.selectionManager;
        if (!selectionManager)
            return;
        if (event.key == 'ArrowLeft') {
            var selectedItem = Array.from(selectionManager.getSelection())[0];
            this.collapseSelection(selectedItem);
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (event.key == 'ArrowRight') {
            var selectedItem = Array.from(selectionManager.getSelection())[0];
            this.expandSelection(selectedItem);
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (event.key == 'ArrowUp') {
            var item = Array.from(selectionManager.getSelection())[0];
            var newSelection = new Set();
            var owner = item.getOwner();
            if (owner) {
                var index = owner.getChildIndex(item);
                var prevSibling = owner.getChild(index - 1);
                if (index == 0)
                    newSelection.add(owner);
                else if (prevSibling &&
                    prevSibling.getNumChildren &&
                    prevSibling.titleElement.isExpanded) {
                    newSelection.add(prevSibling.getChild(prevSibling.getNumChildren() - 1));
                }
                else {
                    newSelection.add(item.getOwner().getChild(index - 1));
                }
            }
            if (newSelection.size > 0) {
                selectionManager.setSelection(newSelection);
            }
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (event.key == 'ArrowDown') {
            var item = Array.from(selectionManager.getSelection())[0];
            var newSelection = new Set();
            if (item && item.getChild && item.titleElement.isExpanded) {
                newSelection.add(item.getChild(0));
            }
            else if (item.getOwner) {
                var index = item.getOwner().getChildIndex(item);
                var isLast = index == item.getOwner().getNumChildren() - 1;
                if (!isLast)
                    newSelection.add(item.getOwner().getChild(index + 1));
                else {
                    var owner = item.getOwner();
                    var ownerOwner = owner.getOwner();
                    if (owner && ownerOwner) {
                        var ownerIndex = ownerOwner.getChildIndex(owner);
                        var ownerIsLast = ownerIndex == ownerOwner.getNumChildren() - 1;
                        if (!ownerIsLast) {
                            newSelection.add(ownerOwner.getChild(ownerIndex + 1));
                        }
                    }
                }
            }
            if (newSelection.size > 0) {
                selectionManager.setSelection(newSelection);
            }
            event.preventDefault();
            event.stopPropagation();
            return;
        }
    };
    /**
     * The expandSelection method.
     * @param {Map} item - The item we wish to expand to show.
     * @param {boolean} scrollToView - Whether to scroll the item into view
     */
    ZeaTreeView.prototype.expandSelection = function (item, scrollToView) {
        if (scrollToView === void 0) { scrollToView = true; }
        if (item.getNumChildren() &&
            item.titleElement &&
            !item.titleElement.isExpanded)
            item.titleElement.isExpanded = true;
        // causes the element to be always at the top of the view.
        if (scrollToView)
            this.scrollItemIntoView(item);
    };
    /**
     * The collapseSelection method.
     * @param {Map} item - The item we wish to expand to show.
     * @param {boolean} scrollToView - Whether to scroll the item into view
     */
    ZeaTreeView.prototype.collapseSelection = function (item, scrollToView) {
        if (scrollToView === void 0) { scrollToView = true; }
        if (item.getNumChildren() && item.titleElement.isExpanded)
            item.titleElement.isExpanded = false;
        if (scrollToView)
            this.scrollItemIntoView(item);
    };
    /**
     * Placeholder comment
     * @param {any} item The item
     */
    ZeaTreeView.prototype.scrollItemIntoView = function (item) {
        // causes the element to be always at the top of the view.
        if (item && item.titleElement)
            item.titleElement.scrollIntoView({
                behavior: 'auto',
                block: 'nearest',
                inline: 'nearest',
            });
    };
    /**
     * onMouseEnter
     */
    ZeaTreeView.prototype.onMouseEnter = function () {
        this.mouseIsOver = true;
    };
    /**
     * onMouseLeave
     */
    ZeaTreeView.prototype.onMouseLeave = function () {
        this.mouseIsOver = false;
    };
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    ZeaTreeView.prototype.render = function () {
        var _this = this;
        return (h(Host, null, h("div", { class: "wrap", onMouseEnter: this.onMouseEnter.bind(this), onMouseLeave: this.onMouseLeave.bind(this) }, h("zea-tree-item-element", { ref: function (el) { return (_this.rootItem.titleElement = el); }, "is-root": "true", "expand-on-load": "true", treeItem: this.rootItem, appData: this.appData, isExpanded: true }))));
    };
    return ZeaTreeView;
}());
ZeaTreeView.style = zeaTreeViewCss;
export { ZeaTreeView as zea_tree_view };
