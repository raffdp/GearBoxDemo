import { r as registerInstance, h, d as getElement, c as createEvent } from './index-12ee0265.js';
var zeaMenuCss = "*{cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host{display:inline-block;vertical-align:middle}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-menu{color:var(--color-foreground-1);-ms-flex-direction:column;flex-direction:column}.zea-menu .items{display:none}.menu-anchor{color:var(--color-foreground-1)}.zea-menu.shown{color:var(--color-foreground-1);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.zea-menu.shown .items{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-direction:column;flex-direction:column}.dropdown slot{display:-ms-flexbox;display:flex}.zea-menu.contextual{position:relative}.contextual.menu-wrap{display:inline-block;position:relative;vertical-align:middle}.contextual .items{position:absolute;margin-top:25px;z-index:1000}.contextual.top-right .items{-webkit-transform:translateX(-100%);transform:translateX(-100%);margin-left:100%}.toolbar{background-color:var(--color-background-2);position:fixed;border-radius:30px}.dropdown .items,.contextual .items{background-color:var(--color-background-2)}";
var ZeaMenu = /** @class */ (function () {
    function ZeaMenu(hostRef) {
        registerInstance(this, hostRef);
        this.offset = [0, 0];
        this.leftOffset = '';
        this.topOffset = '';
        this.type = 'dropdown';
        this.shown = false;
        this.showAnchor = false;
        this.anchorIcon = 'ellipsis-vertical-circle-outline';
        this.contextualAlign = 'top-left';
    }
    /**
     * Listen to click (mouse up) events on the whole window
     * @param {any} ev the event
     */
    ZeaMenu.prototype.handleClick = function (ev) {
        if (ev.currentTarget == this.anchorElement) {
            this.shown = !this.shown;
            return;
        }
        else if (this.type == 'contextual' &&
            !this.isDescendant(this.hostElement, ev.target)) {
            this.shown = false;
        }
        this.mouseIsDown = false;
    };
    /**
     * isDescendant
     * @param {any} parent the parent
     * @param {any} child the parent
     * @return {any} whether or not is parent
     */
    ZeaMenu.prototype.isDescendant = function (parent, child) {
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
     * Listen to zeaMenuItemClick events on the whole window
     * @param {any} ev The zeaMenuItemClick event
     */
    ZeaMenu.prototype.handleItemClick = function (ev) {
        if (this.type == 'contextual' && !ev.detail.hasSubitems) {
            this.shown = false;
        }
    };
    /**
     * Listen to mousedown event
     * @param {any} event the event
     */
    ZeaMenu.prototype.mousedownHandler = function (event) {
        if (this.type == 'toolbar' && event.currentTarget.tagName == 'ZEA-MENU') {
            this.mouseIsDown = true;
            this.offset = [
                this.menuElement.offsetLeft - event.clientX,
                this.menuElement.offsetTop - event.clientY,
            ];
        }
    };
    /**
     * Listen to mousemove event
     * @param {any} event the event
     */
    ZeaMenu.prototype.mousemoveHandler = function (event) {
        if (this.type == 'toolbar' && this.mouseIsDown) {
            this.menuElement.style.left = event.clientX + this.offset[0] + "px";
            this.menuElement.style.top = event.clientY + this.offset[1] + "px";
        }
    };
    /**
     * Listen to click events on anchor
     * @param {any} ev the event
     */
    ZeaMenu.prototype.handleAnchorClick = function (ev) {
        this.handleClick(ev);
        ev.stopPropagation();
    };
    /**
     * Called once when component first loads
     */
    ZeaMenu.prototype.componentDidLoad = function () {
        // the menu is hidden by default to avoid flashing
        if (this.type != 'contextual') {
            this.shown = true;
        }
    };
    /**
     * Called everytime the component renders
     * Apply the class to children
     */
    ZeaMenu.prototype.componentDidRender = function () {
        this.setupChildren();
    };
    /**
     * Run some setup for the children items
     */
    ZeaMenu.prototype.setupChildren = function () {
        var _this = this;
        this.itemsContainer
            .querySelector('slot')
            .assignedNodes()
            .forEach(function (element) {
            if ('type' in element) {
                element.type = _this.type;
            }
            if ('itemParent' in element) {
                element.itemParent = _this.hostElement;
            }
            if ('rootMenu' in element) {
                element.rootMenu = _this.hostElement;
            }
        });
    };
    /**
     * Render function
     * @return {JSX}
     */
    ZeaMenu.prototype.render = function () {
        var _this = this;
        var anchor = this.type == 'contextual' && this.showAnchor ? (h("div", { onMouseUp: this.handleAnchorClick.bind(this), class: "menu-anchor", ref: function (el) { return (_this.anchorElement = el); } }, h("zea-icon", { name: this.anchorIcon }))) : null;
        var menuClass = {};
        menuClass['zea-menu'] = true;
        menuClass[this.type] = true;
        menuClass['shown'] = this.shown;
        menuClass[this.contextualAlign] = true;
        var containerStyle = {
            top: this.topOffset,
            left: this.leftOffset,
        };
        return (h("div", { class: menuClass, ref: function (el) { return (_this.menuElement = el); } }, anchor, h("div", { ref: function (el) { return (_this.itemsContainer = el); }, class: "items", style: containerStyle }, h("slot", null))));
    };
    Object.defineProperty(ZeaMenu.prototype, "hostElement", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return ZeaMenu;
}());
ZeaMenu.style = zeaMenuCss;
var zeaMenuItemCss = "*{cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-menu-item{position:relative}.outer-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;color:var(--color-foreground-1);position:relative}.toolbar .outer-wrap{background-color:transparent;border-radius:30px;margin:5px}.pressed .outer-wrap{background-color:var(--color-grey-3)}.active .outer-wrap{background-color:var(--color-grey-3)}.standalone:hover .outer-wrap{background-color:var(--color-grey-3)}.zea-menu-item:hover{background-color:var(--color-grey-3)}.zea-menu-item.toolbar:hover{background-color:transparent}.toolbar.pressed .outer-wrap{background-color:var(--color-background-2)}.toolbar.active .outer-wrap{background-color:var(--toolbar-active-bg-color, var(--color-grey-3));color:var(--toolbar-active-fg-color, var(--color-foreground-1))}.inner-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;font-size:12px;padding:0 10px;min-height:40px;white-space:nowrap;-ms-flex-positive:1;flex-grow:1}zea-switch{margin-left:0.5em;pointer-events:none}zea-checkbox{margin-right:0.5em;pointer-events:none}::slotted(zea-icon){margin-right:5px;font-size:10px;pointer-events:none}.toolbar .inner-wrap{padding:5px;min-height:auto}.toolbar ::slotted(zea-icon){margin-right:0}.hotkey{display:block;opacity:0.75;font-size:0.8em;padding-left:10px;pointer-events:none}.keyboard-key{border:1px solid var(--color-grey-3);padding:2px;border-radius:5px;font-size:0.8em;text-align:center;min-width:10px;display:inline-block;background-color:var(--color-background-1);text-transform:uppercase;margin:0 2px}";
var ZeaMenuItem = /** @class */ (function () {
    function ZeaMenuItem(hostRef) {
        registerInstance(this, hostRef);
        this.switch = false;
        this.active = false;
        this.hasCheckbox = false;
        this.checked = false;
        this.shown = false;
        this.allowHover = false;
        this.hotkey = '';
        this.type = '';
        this.hasSubitems = false;
        this.zeaMenuItemClick = createEvent(this, "zeaMenuItemClick", 7);
        this.zeaMenuItemPressed = createEvent(this, "zeaMenuItemPressed", 7);
    }
    /**
     * Listen to the event emitted when any item is clicked
     * @param {any} e the event data
     */
    ZeaMenuItem.prototype.windowClickHandler = function (e) {
        this.active = false;
        e.detail.active = true;
        /* if (this.isDescendant(this.subitemsElement, e.detail)) {
          this.active = true
        } */
        if (!e.detail.hasSubitems && this.type != 'toolbar') {
            this.active = false;
        }
    };
    /**
     * Listen to click (mouse up) events on the whole window
     * and make sure the item is deactivated if the click was
     * on an external element
     * @param {any} ev the event
     */
    ZeaMenuItem.prototype.handleWindowMouseup = function (ev) {
        if (!this.isDescendant(this.rootMenu, ev.target) &&
            this.type != 'toolbar') {
            this.active = false;
        }
    };
    /**
     * Check if an element is child of another
     * @param {any} parent the parent
     * @param {any} child the child
     * @return {any} whether or not is parent
     */
    ZeaMenuItem.prototype.isDescendant = function (parent, child) {
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
     */
    ZeaMenuItem.prototype.componentDidRender = function () {
        // this.setupChildren()
    };
    /**
     * Called everytime the component renders
     */
    ZeaMenuItem.prototype.watchHandler = function () {
        this.setupChildren();
    };
    /**
     * Run some setup for the children items
     */
    ZeaMenuItem.prototype.setupChildren = function () {
        var _this = this;
        this.container
            .querySelector('slot')
            .assignedElements()
            .forEach(function (element) {
            if (element.tagName == 'ZEA-MENU-SUBITEMS') {
                _this.hasSubitems = true;
                _this.subitemsElement = element;
                _this.subitemsElement.rootMenu = _this.rootMenu;
                _this.subitemsElement.parentItem = _this.hostElement;
                _this.subitemsElement.type = _this.hostElement.parentElement['type'];
                _this.outerWrap.appendChild(_this.subitemsElement);
                _this.container.classList.add('has-subitems');
                if (_this.hostElement.parentElement.tagName == 'ZEA-MENU') {
                    _this.subitemsElement.belongsToRoot = true;
                }
            }
        });
    };
    /**
     * Handle click/tap
     * @param {any} e The event
     */
    ZeaMenuItem.prototype.handleItemClick = function (e) {
        this.zeaMenuItemClick.emit(this.hostElement);
        /* const zeaSwitch = this.container.querySelector('ZEA-SWITCH')
        if (zeaSwitch && (!e.target || e.target.tagName != 'ZEA-SWITCH'))
          zeaSwitch.checked = !zeaSwitch.checked */
        /* if (
          this.checkboxElement &&
          (!e.target || e.target.tagName != 'ZEA-CHECKBOX')
        )
          this.checked = !this.checked */
        this.active = true;
        this.runCallback(e);
    };
    /**
     * Handle Mouse down
     * @param {any} e The event
     */
    ZeaMenuItem.prototype.handleItemMouseDown = function () {
        this.container.classList.add('pressed');
        this.zeaMenuItemPressed.emit(this.hostElement);
        this.checked = !this.checked;
    };
    /**
     * Handle mouse up
     * @param {any} e The event
     */
    ZeaMenuItem.prototype.handleItemMouseUp = function (e) {
        this.container.classList.remove('pressed');
        this.handleItemClick(e);
        if (!this.hasSubitems && this.type != 'toolbar') {
            this.active = false;
        }
    };
    /**
     * Run the item's callback
     * @param {any} payLoad The data to pass to the callback
     */
    ZeaMenuItem.prototype.runCallback = function (payLoad) {
        if (this.callback) {
            if (typeof this.callback == 'string') {
                eval(this.callback);
            }
            else {
                this.callback(payLoad);
            }
        }
    };
    /**
     * Listen for keyboard shortcuts
     * @param {any} e the event
     */
    ZeaMenuItem.prototype.keydownHandler = function (e) {
        if (e.target instanceof HTMLInputElement)
            return;
        var keys = [];
        if (e.shiftKey)
            keys.push('shift');
        if (e.altKey)
            keys.push('alt');
        if (e.metaKey)
            keys.push('ctrl');
        if (e.ctrlKey)
            keys.push('ctrl');
        if (e.key != 'Alt' &&
            e.key != 'Control' &&
            e.key != 'Ctrl' &&
            e.key != 'Shift') {
            keys.push(e.key);
        }
        var comboString = keys.join('+').toLowerCase();
        if (comboString == this.hotkey.toLowerCase()) {
            this.handleItemClick(new MouseEvent('click'));
        }
        e.preventDefault();
    };
    /**
     * Generate markup for keyboard shortcut
     * @param {any} action the action
     * @return {array} the html elements
     */
    ZeaMenuItem.prototype.keyComboAsHtml = function () {
        var hotkeyParts = this.hotkey.split('+');
        var elements = [];
        hotkeyParts.forEach(function (part) {
            part = part.toLowerCase();
            if (part == 'ctrl') {
                elements.push(h("span", { class: "keyboard-key" }, "Ctrl"));
                elements.push('+');
            }
            else if (part == 'alt') {
                elements.push(h("span", { class: "keyboard-key" }, "Alt"));
                elements.push('+');
            }
            else if (part == 'shift') {
                elements.push(h("span", { class: "keyboard-key" }, "Shift"));
                elements.push('+');
            }
            else {
                elements.push(h("span", { class: "keyboard-key" }, part));
            }
        });
        return elements;
    };
    /**
     * Render function
     * @return {JSX}
     */
    ZeaMenuItem.prototype.render = function () {
        var _this = this;
        return (h("div", { ref: function (el) { return (_this.container = el); }, class: "zea-menu-item " + this.type + " " + (this.active ? 'active' : '') + " " + (this.allowHover ? 'allow-hover' : '') }, h("div", { class: "outer-wrap", ref: function (el) { return (_this.outerWrap = el); } }, h("div", { class: "inner-wrap", onMouseDown: this.handleItemMouseDown.bind(this), onMouseUp: this.handleItemMouseUp.bind(this) }, this.hasCheckbox ? (h("zea-checkbox", { checked: this.checked, ref: function (el) { return (_this.checkboxElement = el); } })) : null, h("slot", null), this.switch ? (h("zea-switch", { checked: this.checked })) : null, this.hotkey ? (h("span", { class: "hotkey" }, this.keyComboAsHtml())) : null))));
    };
    Object.defineProperty(ZeaMenuItem.prototype, "hostElement", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZeaMenuItem, "watchers", {
        get: function () {
            return {
                "rootMenu": ["watchHandler"]
            };
        },
        enumerable: true,
        configurable: true
    });
    return ZeaMenuItem;
}());
ZeaMenuItem.style = zeaMenuItemCss;
var zeaMenuSeparatorCss = ".ruler{overflow:hidden;margin:5px auto;height:1px;background-color:var(--color-grey-3)}.zea-menu-separator{}.zea-menu-separator.vertical{height:24px;width:21px}.vertical .ruler{width:1px;margin:0 10px;height:100%}.dropdown .ruler{height:100%;width:1px}";
var ZeaMenuSeparator = /** @class */ (function () {
    function ZeaMenuSeparator(hostRef) {
        registerInstance(this, hostRef);
        /**
         */
        this.class = '';
        /**
         */
        this.orientation = 'horizontal';
    }
    /**
     * Render function
     * @return {JSX}
     */
    ZeaMenuSeparator.prototype.render = function () {
        return (h("div", { class: "zea-menu-separator " + this.class + " " + this.orientation }, h("div", { class: "ruler" })));
    };
    return ZeaMenuSeparator;
}());
ZeaMenuSeparator.style = zeaMenuSeparatorCss;
export { ZeaMenu as zea_menu, ZeaMenuItem as zea_menu_item, ZeaMenuSeparator as zea_menu_separator };
