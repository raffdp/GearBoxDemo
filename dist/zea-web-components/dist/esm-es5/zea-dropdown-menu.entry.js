import { r as registerInstance, h } from './index-12ee0265.js';
var zeaDropdownMenuCss = ".zea-dropdown-menu{color:var(--color-foreground-1);font-size:14px}ul,li{display:block;list-style:none;margin:0;padding:0;background-color:var(--color-background-2);cursor:default;position:relative;color:var(--color-foreground-1)}li.flashed>span,li.flashed:hover>span{background-color:var(--color-secondary-3) !important}.menu-root{display:-ms-flexbox;display:flex;-ms-flex-pack:left;justify-content:left;-ms-flex-align:center;align-items:center}ul ul{display:none}.leaf-label,.branch-label{display:inline-block;white-space:nowrap}.menu-root>li>.leaf-label,.menu-root>li>.branch-label{padding:16px}.menu-root>li>.branch-label>.branch-arrow{display:none}li .leaf-label,li .branch-label{padding:8px 8px 8px 16px;display:-ms-flexbox;display:flex}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}ul ul li>.leaf-label{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.branch-name{-ms-flex-positive:1;flex-grow:1}li:hover>span{background-color:var(--color-grey-3)}li:hover>ul{display:block;position:absolute;-webkit-box-shadow:0 6px 13px 0 var(--color-shadow);box-shadow:0 6px 13px 0 var(--color-shadow)}ul ul ul{margin-left:100%;margin-top:-30px}.action-name{min-width:100px;display:block;-ms-flex-positive:1;flex-grow:1}.keyboard-shortcut{display:block;opacity:0.75;font-size:0.8em;padding-left:10px}.branch-arrow-icon{display:block;opacity:0.5}.keyboard-key{border:1px solid var(--color-grey-3);padding:2px;border-radius:5px;font-size:0.8em;text-align:center;min-width:10px;display:inline-block;background-color:var(--color-background-1);text-transform:uppercase;margin:0 2px}";
var ZeaDropdownMenu = /** @class */ (function () {
    function ZeaDropdownMenu(hostRef) {
        registerInstance(this, hostRef);
        this.hotkeysToActions = {};
        /**
         * Tree representation of the items and actions
         * based on path arrays
         */
        this.menuItems = { children: {} };
    }
    /**
     * Runs once when component first loads
     */
    ZeaDropdownMenu.prototype.componentDidLoad = function () {
        var _this = this;
        // subscribe to the actionAdded signal
        // Note: the action registry is deprecated.
        if (this.appData && this.appData.actionRegistry) {
            this.appData.actionRegistry.on('actionAdded', function () {
                _this.makeMenuTree();
            });
        }
        this.makeMenuTree();
    };
    /**
     * Listen for keyboard shortcuts
     * @param {any} e the event
     */
    ZeaDropdownMenu.prototype.keydownHandler = function (e) {
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
        if (comboString in this.hotkeysToActions) {
            var action = this.hotkeysToActions[comboString];
            action.callback(e);
        }
        e.preventDefault();
    };
    /**
     * Make a hierarchical representation out of
     * the path arrays in the action list
     */
    ZeaDropdownMenu.prototype.makeMenuTree = function () {
        var _this = this;
        this.actions = this.appData.actionRegistry.getActions();
        this.actions.forEach(function (action) {
            var currentItem = _this.getMenuTreeItem(action.path);
            currentItem['children'][action.name] = action;
        });
        this.feedHotKeys();
    };
    /**
     * Feed the list of hotkeys
     */
    ZeaDropdownMenu.prototype.feedHotKeys = function () {
        var _this = this;
        this.actions.forEach(function (action) {
            var hotkey = _this.keyComboAsText(action);
            if (hotkey)
                _this.hotkeysToActions[hotkey] = action;
        });
    };
    /**
     * Get a specific tree location using an action's path
     * @param {any} path the path
     * @return {any} item
     */
    ZeaDropdownMenu.prototype.getMenuTreeItem = function (path) {
        // here menuItems is modified by reference
        var currentItem = this.menuItems;
        path.forEach(function (pathPart) {
            if (!(pathPart in currentItem.children)) {
                currentItem.children[pathPart] = { children: {} };
            }
            // the reference runs deep
            currentItem = currentItem.children[pathPart];
        });
        return currentItem;
    };
    /**
     * Generate markup for a branch with children
     * @param {any} key the key
     * @param {any} item the item
     * @return {JSX} the ul
     */
    ZeaDropdownMenu.prototype.makeBranch = function (key, item) {
        return (h("li", { key: key }, h("span", { class: "branch-label" }, h("span", { class: "branch-name" }, key), h("span", { class: "branch-arrow" }, this.getBranchArrow())), h("ul", null, this.makeBranchItems(item))));
    };
    /**
     * Generate markup for the children of a branch
     * @param {any} item the item
     * @return {JSX} the ul
     */
    ZeaDropdownMenu.prototype.makeBranchItems = function (item) {
        var _this = this;
        var items = [];
        Object.keys(item.children).forEach(function (key) {
            var currentItem = item.children[key];
            if ('children' in currentItem) {
                items.push(_this.makeBranch(key, currentItem));
            }
            else {
                items.push(_this.makeLeaf(key, currentItem));
            }
        });
        return items;
    };
    /**
     * Generate markup for a leaf item, with an anchor
     * and no children
     * @param {any} key the key
     * @param {any} action the action
     * @return {JSX} the ul
     */
    ZeaDropdownMenu.prototype.makeLeaf = function (key, action) {
        var _this = this;
        return (h("li", { key: key, onClick: function (e) {
                _this.hadleLeafClick(e, action);
            } }, h("span", { class: "leaf-label" }, h("span", { class: "action-name" }, action.name), h("span", { class: "keyboard-shortcut" }, this.keyComboAsHtml(action)))));
    };
    /**
     * Handle click events on leafs
     * @param {any} event the event
     * @param {any} action the action
     */
    ZeaDropdownMenu.prototype.hadleLeafClick = function (event, action) {
        if ('callback' in action) {
            action.callback();
        }
        this.flashItem(event.currentTarget);
    };
    /**
     * Rapidly change items bg color to indicate it was clicked
     * @param {any} target the clicked li item
     */
    ZeaDropdownMenu.prototype.flashItem = function (target) {
        target.classList.toggle('flashed');
        var interval = setInterval(function () {
            target.classList.toggle('flashed');
        }, 80);
        setTimeout(function () {
            clearInterval(interval);
            target.classList.remove('flashed');
        }, 100);
    };
    /**
     * Generate markup for keyboard shortcut
     * @param {any} action the action
     * @return {array} the html elements
     */
    ZeaDropdownMenu.prototype.keyComboAsHtml = function (action) {
        var metaKeys = action.metaKeys, key = action.key;
        var elements = [];
        if (!key && !metaKeys) {
            return null;
        }
        if (metaKeys.control) {
            elements.push(h("span", { class: "keyboard-key" }, "Ctrl"));
            elements.push('+');
        }
        if (metaKeys.alt) {
            elements.push(h("span", { class: "keyboard-key" }, "Alt"));
            elements.push('+');
        }
        if (metaKeys.shift) {
            elements.push(h("span", { class: "keyboard-key" }, "Shift"));
            elements.push('+');
        }
        elements.push(h("span", { class: "keyboard-key" }, key));
        return elements;
    };
    /**
     * Generate markup for keyboard shortcut
     * @param {any} action the action
     * @return {string} the html elements
     */
    ZeaDropdownMenu.prototype.keyComboAsText = function (action) {
        var metaKeys = action.metaKeys, key = action.key;
        var elements = [];
        if (!key && !metaKeys) {
            return '';
        }
        if (metaKeys) {
            if (metaKeys.shift)
                elements.push('shift');
            if (metaKeys.alt)
                elements.push('alt');
            if (metaKeys.control)
                elements.push('ctrl');
        }
        elements.push(key);
        return elements.join('+').toLowerCase();
    };
    /**
     * Get arrow icon svg for branch
     * @return {JSX} the arrow svg
     */
    ZeaDropdownMenu.prototype.getBranchArrow = function () {
        return (h("svg", { class: "branch-arrow-icon", xmlns: "http://www.w3.org/2000/svg", height: "16", viewBox: "0 0 24 24", width: "16" }, h("path", { d: "M8 5v14l11-7z" }), h("path", { d: "M0 0h24v24H0z", fill: "none" })));
    };
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    ZeaDropdownMenu.prototype.render = function () {
        return (h("div", { class: "zea-dropdown-menu" }, h("ul", { class: "menu-root" }, this.makeBranchItems(this.menuItems))));
    };
    return ZeaDropdownMenu;
}());
ZeaDropdownMenu.style = zeaDropdownMenuCss;
export { ZeaDropdownMenu as zea_dropdown_menu };
