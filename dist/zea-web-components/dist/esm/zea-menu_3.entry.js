import { r as registerInstance, h, d as getElement, c as createEvent } from './index-12ee0265.js';

const zeaMenuCss = "*{cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host{display:inline-block;vertical-align:middle}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-menu{color:var(--color-foreground-1);-ms-flex-direction:column;flex-direction:column}.zea-menu .items{display:none}.menu-anchor{color:var(--color-foreground-1)}.zea-menu.shown{color:var(--color-foreground-1);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.zea-menu.shown .items{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-direction:column;flex-direction:column}.dropdown slot{display:-ms-flexbox;display:flex}.zea-menu.contextual{position:relative}.contextual.menu-wrap{display:inline-block;position:relative;vertical-align:middle}.contextual .items{position:absolute;margin-top:25px;z-index:1000}.contextual.top-right .items{-webkit-transform:translateX(-100%);transform:translateX(-100%);margin-left:100%}.toolbar{background-color:var(--color-background-2);position:fixed;border-radius:30px}.dropdown .items,.contextual .items{background-color:var(--color-background-2)}";

const ZeaMenu = class {
    constructor(hostRef) {
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
    handleClick(ev) {
        if (ev.currentTarget == this.anchorElement) {
            this.shown = !this.shown;
            return;
        }
        else if (this.type == 'contextual' &&
            !this.isDescendant(this.hostElement, ev.target)) {
            this.shown = false;
        }
        this.mouseIsDown = false;
    }
    /**
     * isDescendant
     * @param {any} parent the parent
     * @param {any} child the parent
     * @return {any} whether or not is parent
     */
    isDescendant(parent, child) {
        let node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    /**
     * Listen to zeaMenuItemClick events on the whole window
     * @param {any} ev The zeaMenuItemClick event
     */
    handleItemClick(ev) {
        if (this.type == 'contextual' && !ev.detail.hasSubitems) {
            this.shown = false;
        }
    }
    /**
     * Listen to mousedown event
     * @param {any} event the event
     */
    mousedownHandler(event) {
        if (this.type == 'toolbar' && event.currentTarget.tagName == 'ZEA-MENU') {
            this.mouseIsDown = true;
            this.offset = [
                this.menuElement.offsetLeft - event.clientX,
                this.menuElement.offsetTop - event.clientY,
            ];
        }
    }
    /**
     * Listen to mousemove event
     * @param {any} event the event
     */
    mousemoveHandler(event) {
        if (this.type == 'toolbar' && this.mouseIsDown) {
            this.menuElement.style.left = `${event.clientX + this.offset[0]}px`;
            this.menuElement.style.top = `${event.clientY + this.offset[1]}px`;
        }
    }
    /**
     * Listen to click events on anchor
     * @param {any} ev the event
     */
    handleAnchorClick(ev) {
        this.handleClick(ev);
        ev.stopPropagation();
    }
    /**
     * Called once when component first loads
     */
    componentDidLoad() {
        // the menu is hidden by default to avoid flashing
        if (this.type != 'contextual') {
            this.shown = true;
        }
    }
    /**
     * Called everytime the component renders
     * Apply the class to children
     */
    componentDidRender() {
        this.setupChildren();
    }
    /**
     * Run some setup for the children items
     */
    setupChildren() {
        this.itemsContainer
            .querySelector('slot')
            .assignedNodes()
            .forEach((element) => {
            if ('type' in element) {
                element.type = this.type;
            }
            if ('itemParent' in element) {
                element.itemParent = this.hostElement;
            }
            if ('rootMenu' in element) {
                element.rootMenu = this.hostElement;
            }
        });
    }
    /**
     * Render function
     * @return {JSX}
     */
    render() {
        const anchor = this.type == 'contextual' && this.showAnchor ? (h("div", { onMouseUp: this.handleAnchorClick.bind(this), class: "menu-anchor", ref: (el) => (this.anchorElement = el) }, h("zea-icon", { name: this.anchorIcon }))) : null;
        const menuClass = {};
        menuClass['zea-menu'] = true;
        menuClass[this.type] = true;
        menuClass['shown'] = this.shown;
        menuClass[this.contextualAlign] = true;
        const containerStyle = {
            top: this.topOffset,
            left: this.leftOffset,
        };
        return (h("div", { class: menuClass, ref: (el) => (this.menuElement = el) }, anchor, h("div", { ref: (el) => (this.itemsContainer = el), class: "items", style: containerStyle }, h("slot", null))));
    }
    get hostElement() { return getElement(this); }
};
ZeaMenu.style = zeaMenuCss;

const zeaMenuItemCss = "*{cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-menu-item{position:relative}.outer-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;color:var(--color-foreground-1);position:relative}.toolbar .outer-wrap{background-color:transparent;border-radius:30px;margin:5px}.pressed .outer-wrap{background-color:var(--color-grey-3)}.active .outer-wrap{background-color:var(--color-grey-3)}.standalone:hover .outer-wrap{background-color:var(--color-grey-3)}.zea-menu-item:hover{background-color:var(--color-grey-3)}.zea-menu-item.toolbar:hover{background-color:transparent}.toolbar.pressed .outer-wrap{background-color:var(--color-background-2)}.toolbar.active .outer-wrap{background-color:var(--toolbar-active-bg-color, var(--color-grey-3));color:var(--toolbar-active-fg-color, var(--color-foreground-1))}.inner-wrap{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;font-size:12px;padding:0 10px;min-height:40px;white-space:nowrap;-ms-flex-positive:1;flex-grow:1}zea-switch{margin-left:0.5em;pointer-events:none}zea-checkbox{margin-right:0.5em;pointer-events:none}::slotted(zea-icon){margin-right:5px;font-size:10px;pointer-events:none}.toolbar .inner-wrap{padding:5px;min-height:auto}.toolbar ::slotted(zea-icon){margin-right:0}.hotkey{display:block;opacity:0.75;font-size:0.8em;padding-left:10px;pointer-events:none}.keyboard-key{border:1px solid var(--color-grey-3);padding:2px;border-radius:5px;font-size:0.8em;text-align:center;min-width:10px;display:inline-block;background-color:var(--color-background-1);text-transform:uppercase;margin:0 2px}";

const ZeaMenuItem = class {
    constructor(hostRef) {
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
    windowClickHandler(e) {
        this.active = false;
        e.detail.active = true;
        /* if (this.isDescendant(this.subitemsElement, e.detail)) {
          this.active = true
        } */
        if (!e.detail.hasSubitems && this.type != 'toolbar') {
            this.active = false;
        }
    }
    /**
     * Listen to click (mouse up) events on the whole window
     * and make sure the item is deactivated if the click was
     * on an external element
     * @param {any} ev the event
     */
    handleWindowMouseup(ev) {
        if (!this.isDescendant(this.rootMenu, ev.target) &&
            this.type != 'toolbar') {
            this.active = false;
        }
    }
    /**
     * Check if an element is child of another
     * @param {any} parent the parent
     * @param {any} child the child
     * @return {any} whether or not is parent
     */
    isDescendant(parent, child) {
        let node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    /**
     * Called everytime the component renders
     */
    componentDidRender() {
        // this.setupChildren()
    }
    /**
     * Called everytime the component renders
     */
    watchHandler() {
        this.setupChildren();
    }
    /**
     * Run some setup for the children items
     */
    setupChildren() {
        this.container
            .querySelector('slot')
            .assignedElements()
            .forEach((element) => {
            if (element.tagName == 'ZEA-MENU-SUBITEMS') {
                this.hasSubitems = true;
                this.subitemsElement = element;
                this.subitemsElement.rootMenu = this.rootMenu;
                this.subitemsElement.parentItem = this.hostElement;
                this.subitemsElement.type = this.hostElement.parentElement['type'];
                this.outerWrap.appendChild(this.subitemsElement);
                this.container.classList.add('has-subitems');
                if (this.hostElement.parentElement.tagName == 'ZEA-MENU') {
                    this.subitemsElement.belongsToRoot = true;
                }
            }
        });
    }
    /**
     * Handle click/tap
     * @param {any} e The event
     */
    handleItemClick(e) {
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
    }
    /**
     * Handle Mouse down
     * @param {any} e The event
     */
    handleItemMouseDown() {
        this.container.classList.add('pressed');
        this.zeaMenuItemPressed.emit(this.hostElement);
        this.checked = !this.checked;
    }
    /**
     * Handle mouse up
     * @param {any} e The event
     */
    handleItemMouseUp(e) {
        this.container.classList.remove('pressed');
        this.handleItemClick(e);
        if (!this.hasSubitems && this.type != 'toolbar') {
            this.active = false;
        }
    }
    /**
     * Run the item's callback
     * @param {any} payLoad The data to pass to the callback
     */
    runCallback(payLoad) {
        if (this.callback) {
            if (typeof this.callback == 'string') {
                eval(this.callback);
            }
            else {
                this.callback(payLoad);
            }
        }
    }
    /**
     * Listen for keyboard shortcuts
     * @param {any} e the event
     */
    keydownHandler(e) {
        if (e.target instanceof HTMLInputElement)
            return;
        const keys = [];
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
        const comboString = keys.join('+').toLowerCase();
        if (comboString == this.hotkey.toLowerCase()) {
            this.handleItemClick(new MouseEvent('click'));
        }
        e.preventDefault();
    }
    /**
     * Generate markup for keyboard shortcut
     * @param {any} action the action
     * @return {array} the html elements
     */
    keyComboAsHtml() {
        const hotkeyParts = this.hotkey.split('+');
        const elements = [];
        hotkeyParts.forEach((part) => {
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
    }
    /**
     * Render function
     * @return {JSX}
     */
    render() {
        return (h("div", { ref: (el) => (this.container = el), class: `zea-menu-item ${this.type} ${this.active ? 'active' : ''} ${this.allowHover ? 'allow-hover' : ''}` }, h("div", { class: "outer-wrap", ref: (el) => (this.outerWrap = el) }, h("div", { class: "inner-wrap", onMouseDown: this.handleItemMouseDown.bind(this), onMouseUp: this.handleItemMouseUp.bind(this) }, this.hasCheckbox ? (h("zea-checkbox", { checked: this.checked, ref: (el) => (this.checkboxElement = el) })) : null, h("slot", null), this.switch ? (h("zea-switch", { checked: this.checked })) : null, this.hotkey ? (h("span", { class: "hotkey" }, this.keyComboAsHtml())) : null))));
    }
    get hostElement() { return getElement(this); }
    static get watchers() { return {
        "rootMenu": ["watchHandler"]
    }; }
};
ZeaMenuItem.style = zeaMenuItemCss;

const zeaMenuSeparatorCss = ".ruler{overflow:hidden;margin:5px auto;height:1px;background-color:var(--color-grey-3)}.zea-menu-separator{}.zea-menu-separator.vertical{height:24px;width:21px}.vertical .ruler{width:1px;margin:0 10px;height:100%}.dropdown .ruler{height:100%;width:1px}";

const ZeaMenuSeparator = class {
    constructor(hostRef) {
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
    render() {
        return (h("div", { class: `zea-menu-separator ${this.class} ${this.orientation}` }, h("div", { class: "ruler" })));
    }
};
ZeaMenuSeparator.style = zeaMenuSeparatorCss;

export { ZeaMenu as zea_menu, ZeaMenuItem as zea_menu_item, ZeaMenuSeparator as zea_menu_separator };
