import { r as registerInstance, h, d as getElement } from './index-12ee0265.js';
var zeaMenuSubitemsCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.fgpath{fill:var(--color-foreground-1)}.arrow{display:-ms-flexbox;display:flex}.subitems{display:none;position:absolute;left:100%;margin-top:-24px;padding-left:1px;background-color:var(--color-background-2)}.shown .subitems{display:block}.dropdown .subitems{left:0;margin-top:13px;padding-top:1px}";
var ZeaMenuSubitems = /** @class */ (function () {
    function ZeaMenuSubitems(hostRef) {
        registerInstance(this, hostRef);
        this.subitemsArray = [];
        /**
         * Whether it is/should be shown
         */
        this.shown = false;
        /**
         * Menu type
         */
        this.type = '';
        /**
         * Whether the children should have checkboxes and behave as a radio button
         */
        this.radioSelect = false;
    }
    /**
     * zeaMenuItemClickHandler
     * @param {any} e the event data
     */
    ZeaMenuSubitems.prototype.windowClickHandler = function (e) {
        var clickedItem = e.detail;
        var itemIsDescendant = this.isDescendant(this.hostElement, clickedItem);
        if (clickedItem == this.parentItem) {
            this.shown = !this.shown;
        }
        else {
            if (!itemIsDescendant || !clickedItem.hasSubitems) {
                this.shown = false;
            }
        }
    };
    /**
     * zeaMenuItemClickHandler
     * @param {any} e the event data
     */
    ZeaMenuSubitems.prototype.windowItemPressHandler = function (e) {
        var clickedItem = e.detail;
        var itemIsDescendant = this.isDescendant(this.hostElement, clickedItem);
        if (this.radioSelect && itemIsDescendant) {
            this.subitemsArray.forEach(function (element) {
                element.checked = false;
            });
        }
    };
    /**
     * Listen to click (mouse up) events on the whole window
     * @param {any} ev the event
     */
    ZeaMenuSubitems.prototype.handleWindowMouseup = function (ev) {
        if (!this.isDescendant(this.rootMenu, ev.target)) {
            this.shown = false;
        }
    };
    /**
     * isDescendant
     * @param {any} parent the parent
     * @param {any} child the parent
     * @return {any} whether or not is parent
     */
    ZeaMenuSubitems.prototype.isDescendant = function (parent, child) {
        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };
    /**
     * Called everytime the component renders
     * Apply the class to children
     */
    ZeaMenuSubitems.prototype.componentDidRender = function () {
        // this.setupChildren()
    };
    /**
     * Called everytime the component renders
     */
    ZeaMenuSubitems.prototype.watchHandler = function () {
        this.setupChildren();
    };
    /**
     * Run some setup for the children items
     */
    ZeaMenuSubitems.prototype.setupChildren = function () {
        var _this = this;
        this.subitemsElement
            .querySelector('slot')
            .assignedElements()
            .forEach(function (element) {
            if ('itemParent' in element) {
                element.itemParent = _this.hostElement;
            }
            if ('rootMenu' in element) {
                element.rootMenu = _this.rootMenu;
            }
            if (_this.radioSelect) {
                element.hasCheckbox = true;
            }
            _this.subitemsArray.push(element);
        });
    };
    /**
     * Render function
     * @return {JSX}
     */
    ZeaMenuSubitems.prototype.render = function () {
        var _this = this;
        return (h("div", { class: "zea-menu-subitems " + this.type + " " + (this.shown ? 'shown' : '') + " " }, h("div", { class: "arrow" }, h("svg", { class: "branch-arrow-icon", xmlns: "http://www.w3.org/2000/svg", height: "13", viewBox: "0 0 24 24", width: "13" }, h("path", { d: "M8 5v14l11-7z", class: "fgpath" }), h("path", { d: "M0 0h24v24H0z", fill: "none" }))), h("div", { class: "subitems", ref: function (el) { return (_this.subitemsElement = el); } }, h("slot", null))));
    };
    Object.defineProperty(ZeaMenuSubitems.prototype, "hostElement", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZeaMenuSubitems, "watchers", {
        get: function () {
            return {
                "rootMenu": ["watchHandler"]
            };
        },
        enumerable: true,
        configurable: true
    });
    return ZeaMenuSubitems;
}());
ZeaMenuSubitems.style = zeaMenuSubitemsCss;
export { ZeaMenuSubitems as zea_menu_subitems };
